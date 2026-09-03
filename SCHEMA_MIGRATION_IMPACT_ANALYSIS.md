# Schema Reorganization — Production Migration Impact Analysis

**Database:** Supabase project `nba-storylines-chat` (ref `gqvyoxfpdwfukxwoziaa`), PostgreSQL 17
**Repo reviewed:** `travisfleish/hidden-unicorn` (working copy: `/Users/travisfleisher/Downloads/hidden-unicorn-next`)
**Date:** 2026-09-03
**Status:** Review only. No database changes, no files edited, no migrations generated.
**Method:** GitHub repo inspection + live `pg_catalog` / `information_schema` inspection + Edge Function source + Supabase advisors.

---

## Scope note (read first)

The Next.js app in **this** repo has **zero database coupling**: no `supabase-js`, no `.from()`, no `fetch` to Supabase, no env vars (`grep` confirms). Its data is hand-committed static TypeScript in `lib/data.ts`, `lib/offensiveArchetypeDistances.ts`, `lib/signatureNote.ts`, generated out-of-band by the Edge Function `hu-export-9c4e7a2f`.

The **real consumer** of this database is a **separate repo** — the "chat" / query-engine app referenced in `PROJECT_CONTEXT.md` §33 (`chat/lib/warehouse/schema-registry.ts`, `query-engine.ts`, `concept-dictionary.ts`, `sql-primer.ts`, `RAW-PROMOTION-PLAN.md`). **That repo is not present here and was not inspected.** It is the largest single unknown in this review and it materially raises the risk rating.

Legend: **[V]** = directly verified this session; **[I]** = inferred / not verifiable without the consumer repo.

---

## 1. Executive summary

### Is reorganizing into schemas worthwhile here?

Marginally, and **not now**. The domains are real (raw event data, derived analytics, ML, chat) but are already legibly separated by naming convention (`play_*`, `ml_*`, `v_*`, plus the chat tables). No name collisions, no "everything in one bucket" confusion. Upside is mostly cosmetic/governance; downside is touching a live LLM-driven SQL surface, 28 RPC functions, 2 edge functions, generated types, and PostgREST exposure — nearly all of which assume `public` implicitly.

### Overall migration risk

| Scenario | Risk |
|---|---|
| Full move of `play_*` / `v_*` as described | **HIGH** |
| `ml_*` only | **MEDIUM** |
| Any move implemented as `ALTER TABLE ... SET SCHEMA` **+ backward-compatible views left in `public`** | **LOW** |

### Biggest risks

1. **The governed query engine.** `public.run_governed_sql()` / `run_readonly_sql()` take arbitrary LLM-generated `SELECT` text and `EXECUTE` it. Table names resolve purely by `search_path`. `run_governed_sql` switches to role `nba_reader`, which has **no `search_path` override** and inherits the DB default `"$user", public, extensions`. Move any queried table out of `public` and every generated query referencing it fails with `relation does not exist` until the prompt/semantic layer qualifies names or `search_path` is widened. **[V]**
2. **The un-inspected consumer repo.** `schema-registry.ts` / `query-engine.ts` / `concept-dictionary.ts` almost certainly hard-code bare table names and/or `Database['public']['Tables']` types. Cannot scope the code change without it. **[I]**
3. **28 `public` RPC functions**, all granted to `anon` / `authenticated` / `service_role`. 12 `SECURITY DEFINER` functions pin `SET search_path = public`; several others (`lineup_ratings`, `player_on_off`, `ml_run_*_kmeans`, `_refresh_governed_matviews`) pin nothing and use unqualified names. 2 trigger functions hard-code `public.conversations` / `public.profiles`. **[V]**
4. **PostgREST / Supabase API exposure.** Anything moved out of `public` disappears from `/rest/v1/...` and from generated types unless the new schema is added to "Exposed schemas" **and** re-granted **and** given RLS. Current "Exposed schemas" value is not readable via SQL — **unverified**, presumed `public` only. **[I]**
5. **RLS is disabled on all 15 `ml_*` tables** (Supabase advisor: critical — `rls_disabled`). The `anon` key can read/write every ML row today. Independent of the migration; fix first. A schema move is a tempting but wrong substitute for RLS. **[V]**

---

## 2. Current architecture

### 2.1 Schemas

Only one application schema: **`public`**. Everything else is Supabase-managed (`auth`, `storage`, `realtime`, `cron`, `extensions`, `graphql`, `graphql_public`, `vault`, `supabase_migrations`). **[V]**

### 2.2 Major categories of tables (all in `public`)

| Category | Tables | Rows (est.) | RLS | Notes |
|---|---|---|---|---|
| **Raw play events** (`play_*`) | `play_touches` (1.1M), `play_passes` (819k), `play_matchups` (1.9M), `play_jumps` (837k), `play_chances` (360k), `play_possessions` (277k), `play_shot_contests` (294k), `play_shots` (268k), `play_picks`, `play_rebounds`, `play_drives`, `play_closeouts`, `play_off_ball_screens`, `play_free_throws`, `play_fouls`, `play_isolations`, `play_handoffs`, `play_turnovers`, `play_timeouts`, `play_posts`, `play_fake_handoffs`, `play_jump_balls`, `play_violations`, `play_ingest_status` | ~9M rows, ~15 GB | enabled | Policies: `authenticated` SELECT `true`; most also `nba_reader` SELECT `true`. **`play_possessions`, `play_shots`, `play_free_throws`, `play_rebounds` have NO `nba_reader` grant/policy** — governed reads go through `v_*` views. |
| **Reference / conformed dims** | `teams` (30), `players` (2.4k), `player_season_teams`, `season_games` (1.4k), `season_ingests` (1), `game_rosters` (46k) | small | enabled | `season_ingests(season_year)` is the FK hub for ~25 tables. |
| **Seasonal rollups / feeds** | `game_stats` (4.6M), `season_stats` (156k), `game_matchups` (213k), `feed_artifacts` (6.9k), `tracking_artifacts` (36), `play_set_facts` (0) | ~5M | mixed | `tracking_artifacts` + `play_set_facts` are a one-off "Thunder tracking spike" (RLS off). |
| **ML** (`ml_*`) | `ml_player_style_features` (473), `ml_player_style_model_input` (473), `ml_player_style_cluster_runs` (4.3k), `ml_player_style_kmeans_centroids_work`, `ml_player_style_kmeans_assignments_work`, `ml_player_style_signature_stats` (2.4k), `ml_player_style_feature_scores` (14.7k), `ml_player_style_feature_correlations`, `ml_player_defensive_*` (4), `ml_player_twoway_*` (3) | ~35k | **all disabled** | No FKs in or out. Not referenced by any view. Consumers: `ml_run_defensive_kmeans()`, `ml_run_twoway_kmeans()`, and 2 edge functions. Fully isolated. |
| **Chat / app** | `profiles` (1), `conversations` (7), `chat_turns` (24–32), `response_cache` (0), `auth_events` (5) | tiny | `auth.uid()` policies | FK to `auth.users`. `chat_turns` has an AFTER INSERT trigger. |

> Note: the Supabase MCP `list_tables` row counts read 0 for the play tables; those are stale planner estimates. Real `pg_class.reltuples` / `pg_stat_user_tables` confirm the tables are heavily populated (numbers above). **[V]**

### 2.3 Views and materialized views (all `public`, all defined with **unqualified** names) **[V]**

**Regular views (11):**

| View | References |
|---|---|
| `chance_score_state` | `play_chances`, `season_games` |
| `possession_players` | `play_possessions` |
| `team_schedule` | `season_games` |
| `v_free_throws` | `play_free_throws` |
| `v_matchups` | `game_matchups`, `season_games` |
| `v_shots` | `play_shots` |
| `v_rebounds` | `play_rebounds` |
| `v_possessions` | `play_possessions`, `possession_leverage` |
| `v_player_shooting` | `v_shots`, `v_free_throws`, `players` |
| `v_team_shooting` | `v_shots`, `v_free_throws`, `teams` |
| `v_team_ratings` | `v_possessions`, `teams` |

**Materialized views (8):**

| Matview | References |
|---|---|
| `play_touch_facts` | `play_touches` (thin projection) |
| `play_pass_facts` | `play_passes` (thin projection) |
| `play_matchup_facts` | `play_matchups` (thin projection) |
| `play_shot_contest_facts` | `play_shot_contests` (thin projection) |
| `possession_leverage` | `play_possessions`, `chance_score_state` |
| `v_lineup_ratings` | `v_possessions`, `teams`, `players` |
| `v_player_on_off` | `play_possessions`, `v_possessions`, `players`, `teams` |
| `v_player_passing` | `play_passes`, `v_shots`, `play_turnovers`, `players` |

Dependency depth reaches 4 levels, e.g. `play_possessions -> possession_leverage -> v_possessions -> v_team_ratings / v_lineup_ratings`.

### 2.4 Functions (28 in `public`; all `EXECUTE` granted to `anon`, `authenticated`, `service_role`) **[V]**

| Group | Functions | `search_path` | References |
|---|---|---|---|
| Governed SQL engine | `run_governed_sql(q,max_rows)`, `run_readonly_sql(q,max_rows)` | **none** | dynamic `EXECUTE format(%s)`; `run_governed_sql` does `SET LOCAL ROLE nba_reader` |
| Matview refresh | `_refresh_governed_matviews()` | **none** | `refresh materialized view v_lineup_ratings; v_player_on_off` (unqualified) |
| View-backing table fns | `lineup_ratings(...)`, `player_on_off(...)` x2 overloads, `roster_starts_leaders(...)`, `list_distinct_game_stat_names(...)` | first two: **none**; last two: `public` (SECDEF) | `play_possessions`, `possession_leverage`, `game_rosters`, `season_games`, `game_stats` |
| Ingest / enrichment (all `SECURITY DEFINER`, `search_path=public`) | `enrich_play_{closeouts,drives,jumps,off_ball_screens,passes,picks,rebounds,shots}_3d(jsonb)`, `stamp_play_enriched_3d(...)`, `upsert_game_meta(...)`, `upsert_season_stat_deltas(...)`, `rebuild_season_stats_from_games(...)`, `rebuild_season_stats_one_stat(...)`, `rebuild_player_season_teams_games_started(...)` | `public` | write to `play_*`, `season_stats`, `player_season_teams`, `game_stats` |
| ML runners | `ml_run_defensive_kmeans(k,restart,iter)`, `ml_run_twoway_kmeans(...)` | **none** | `ml_*` tables, all unqualified |
| Triggers | `touch_conversation_updated_at()` -> `UPDATE public.conversations` (qualified); `handle_new_user()` -> `INSERT public.profiles` (qualified, SECDEF, `search_path=public`) | mixed | `conversations`, `profiles` |
| Pure helpers | `_jsonb_uuid_array`, `jsonb_to_float8_array`, `jsonb_to_text_array` | n/a | no table refs |

### 2.5 Other objects **[V]**

- **Triggers:** `public.chat_turns` AFTER INSERT -> `touch_conversation_updated_at()`. Plus standard `auth.users` -> `handle_new_user()`.
- **Foreign keys:** all inside `public`, plus 5 -> `auth.users`. Dominant pattern: `<table>_season_year_fkey` -> `public.season_ingests(season_year)` on ~25 tables. `chat_turns.conversation_id` -> `conversations.id`.
- **RLS policies:** `authenticated` read-`true` on warehouse tables; explicit `nba_reader_read` (`USING true`) on ~28 tables/views; `auth.uid()`-scoped ALL/SELECT on the 5 chat/app tables. `ml_*`: **none (RLS off)**.
- **Grants:** Supabase-default permissive — `anon`, `authenticated`, `service_role` hold **all** privileges (`arwdDxtm`) on every `public` table/view, via explicit grants **and** `ALTER DEFAULT PRIVILEGES` (defined **only for schema `public`**, owners `postgres` and `supabase_admin`). `nba_reader` (custom `NOLOGIN` role, no `search_path` override) holds `SELECT` on a curated ~38-object subset.
- **Extensions:** `pg_cron` 1.6.4 (installed; **`cron.job` currently empty** — migration history shows it was used for a "raw promotion" job that is not active now), `pg_stat_statements`, `pgcrypto`, `uuid-ossp` (both in `extensions`), `supabase_vault`.
- **Realtime:** publication `supabase_realtime` has **no tables**. No impact.
- **Edge functions (2):** `hu-export-9c4e7a2f`, `ml-signature-export-temp` — both `verify_jwt=false`, both use the service-role key and `supabase.from("ml_player_style_signature_stats")` (**unqualified** -> resolves to `public` via PostgREST). `ml-signature-export-temp` guards only with a hard-coded string token in source.
- **Migrations:** ~150, applied through `supabase_migrations.schema_migrations`. Themes: `raw_promote_{shots,picks,closeouts,rebounds,drives}`, `enable_pg_cron_for_promotion`, `governed_reader_role` / `run_governed_sql_rpc` / `governed_row_views` / `governed_shooting_views` / `governed_reader_rls_policies`, `possession_leverage_materialized`, `create_ml_*`, `tracking_spike`. Migration SQL files live in the **other repo** — no `supabase/` directory in this project.

### 2.6 Naming conventions in use

`play_*` (raw event grain), `game_*` / `season_*` (aggregate grain), `ml_*` (all machine learning), `v_*` (derived views — inconsistent; `chance_score_state`, `possession_players`, `team_schedule`, `possession_leverage`, `play_*_facts` are also derived and lack the prefix), `*_work` (ML scratch), `*_facts` (matview projections). No prefix for chat/app tables.

---

## 3. Proposed schema structure

Driven by what is actually present, not the example list. `analytics` is collapsed into `public`; `raw` and `chat` are proposed but deferred.

| Proposed schema | Contents | Rationale |
|---|---|---|
| **`public`** (keep) | The **entire governed read surface**: `v_*` views, `chance_score_state`, `possession_players`, `team_schedule`, `possession_leverage`, `play_*_facts`, `v_lineup_ratings`, `v_player_on_off`, `v_player_passing`; plus `players`, `teams`, `player_season_teams`, `season_games`, `game_rosters`, `game_stats`, `season_stats`; plus all RPCs. | This is what the LLM/semantic layer queries, what PostgREST exposes, and what generated types cover. Moving it is where ~90% of the breakage is and near-zero of the benefit. |
| **`raw`** | The 24 `play_*` tables, `game_matchups`, `feed_artifacts`, `tracking_artifacts`, `play_set_facts`, `play_ingest_status`, `season_ingests` | True source grain, huge, and the project already has a "raw promotion" model (`RAW-PROMOTION-PLAN.md`, `raw_promote_*` migrations). `PROJECT_CONTEXT.md` §3 says the browser must never touch these. Downstream views depend on them, but `ALTER TABLE ... SET SCHEMA` preserves those view dependencies automatically (see §5). |
| **`ml`** | All 15 `ml_*` tables + `ml_run_defensive_kmeans` + `ml_run_twoway_kmeans` | Genuinely isolated: no FKs, no views, 2 functions + 2 edge functions as the only consumers. Best and safest pilot. Aligns with `PROJECT_CONTEXT.md` §32. |
| **`chat`** | `profiles`, `conversations`, `chat_turns`, `response_cache`, `auth_events` + `touch_conversation_updated_at`, `handle_new_user` | Distinct lifecycle, user-scoped RLS, FK to `auth.users`. Small and low-traffic, so cheap to move — but the two trigger functions and Supabase Auth's expectation of `public.profiles` make it deceptively risky (see §5). |

**Stays in `public`:** the analytics/reference/RPC surface. It is the API contract. If namespacing is wanted there later, do it with the exposed-schemas feature, not with a move.

**Net structural recommendation:** if anything is done, do **`ml` only**, and optionally `raw` **with compatibility views left in `public`**. Leave `chat` and the analytics surface alone.

---

## 4. Impact matrix

Grouped by proposed move. "App refs" = code outside the DB. "DB deps" = in-database dependents.

### Move set A — `ml_*` -> `ml` (15 tables + 2 functions)

| Field | Detail |
|---|---|
| Current names | `public.ml_player_style_features`, `..._model_input`, `..._cluster_runs`, `..._kmeans_centroids_work`, `..._kmeans_assignments_work`, `..._signature_stats`, `..._feature_scores`, `..._feature_correlations`; `public.ml_player_defensive_style_features`, `..._style_model_input`, `..._cluster_runs`, `..._kmeans_centroids_work`; `public.ml_player_twoway_model_input`, `..._cluster_runs`, `..._kmeans_centroids_work` |
| Proposed names | `ml.player_style_features`, `ml.player_style_model_input`, ... (drop the `ml_` prefix) — or keep names as-is under `ml.` if you want a smaller diff |
| App references | **Edge functions** `hu-export-9c4e7a2f` and `ml-signature-export-temp`: `.from("ml_player_style_signature_stats")` -> **breaks** unless changed to `.schema("ml").from("player_style_signature_stats")` **and** `ml` added to exposed schemas + `service_role` granted (or pointed at a `public` compatibility view). The **hidden-unicorn repo**: not affected (static data). The **chat repo**: unknown — likely references `ml_*` in its schema registry. |
| DB dependencies | `ml_run_defensive_kmeans()`, `ml_run_twoway_kmeans()` — unqualified refs, **no pinned `search_path`** -> break unless bodies are re-qualified or caller `search_path` includes `ml`. No FKs, no views, no triggers, no RLS policies to migrate. |
| API / RLS implications | RLS is **off** -> tables are currently REST-readable/writable by `anon`. Moving to an *unexposed* `ml` schema removes them from the API — an improvement, provided `ml` is not then exposed. Grants move with the tables; schema `USAGE` must be granted to whoever needs it. `ALTER DEFAULT PRIVILEGES` does **not** exist for `ml` — set it up or grant explicitly. |
| Required changes | `ALTER TABLE ... SET SCHEMA ml` x15; `CREATE OR REPLACE FUNCTION` x2 with qualified refs or `SET search_path`; redeploy 2 edge functions; regenerate types with `--schema public,ml`; update chat-repo registry; decide exposed-schema policy. |
| Risk | **MEDIUM.** Isolated, but 2 edge functions + 2 RPCs + an unknown repo consumer. Reversible in seconds (`SET SCHEMA` back). |

### Move set B — `play_*` + raw feeds -> `raw` (~29 tables)

| Field | Detail |
|---|---|
| Current -> proposed | `public.play_touches` -> `raw.play_touches`, ..., `public.season_ingests` -> `raw.season_ingests`, etc. |
| App references | **Governed SQL engine**: LLM-generated queries say `FROM play_touches`, resolved via `nba_reader`.`search_path` = `public,...`. **Every such query breaks.** The `sql-primer.ts` / `concept-dictionary.ts` / few-shot examples in the chat repo will contain bare `play_*` names. **Direct `supabase.from('play_*')`** anywhere in the chat repo breaks (compile-time via types, runtime via 404). |
| DB dependencies | 11 views + 8 matviews reference these tables — **but `ALTER TABLE ... SET SCHEMA` rewrites those dependencies automatically** (see §5), so the views keep working and their definitions re-print qualified. `enrich_play_*_3d()` and `rebuild_*()` pin `SET search_path=public` and use unqualified names -> **break on write** until re-qualified. `lineup_ratings()`, `player_on_off()` (unqualified, no pinned path) -> break. ~25 `*_season_year_fkey` become cross-schema FKs (legal, auto-updated, no behavior change). |
| API / RLS implications | `play_*` drop out of `/rest/v1/...` and generated `Database['public']['Tables']`. RLS policies + `nba_reader`/`authenticated` grants travel with the tables, but schema `USAGE ON raw` must be granted to `authenticated`, `nba_reader`, `service_role`, `anon` (as desired) or all access fails with `permission denied for schema raw`. Restoring REST access requires adding `raw` to exposed schemas — which re-opens the "browser can hit raw tables" concern the project wants closed. |
| Required changes | `SET SCHEMA` x29; recreate/qualify ~15 functions; `GRANT USAGE ON SCHEMA raw`; `ALTER DEFAULT PRIVILEGES ... IN SCHEMA raw`; extend `nba_reader` + DB `search_path`; **optionally** `CREATE VIEW public.play_touches AS TABLE raw.play_touches` x24 for backward compatibility (then governed SQL and PostgREST keep working unchanged — recommended); regenerate types `--schema public,raw`; rewrite chat-repo primer/registry; `NOTIFY pgrst, 'reload schema'`. |
| Risk | **HIGH** without compatibility views. **LOW–MEDIUM** with them. |

### Move set C — chat/app -> `chat` (5 tables + 2 functions)

| Field | Detail |
|---|---|
| Current -> proposed | `public.profiles` -> `chat.profiles`, `public.conversations` -> `chat.conversations`, `chat_turns`, `response_cache`, `auth_events` |
| App references | Chat repo: `supabase.from('conversations' / 'chat_turns' / 'profiles')` -> **breaks** at compile + runtime; every call site needs `.schema('chat')` and `chat` must be exposed. |
| DB dependencies | `handle_new_user()` does `INSERT INTO public.profiles` — **hard-coded, breaks user signup** the moment `profiles` moves, until the function is updated. `touch_conversation_updated_at()` does `UPDATE public.conversations` — **breaks every `chat_turns` insert**. `chat_turns.conversation_id` FK survives. RLS `auth.uid()` policies survive. |
| API / RLS implications | Supabase tooling and many examples assume `public.profiles`; some Auth hooks/UI expect it. `chat` must be exposed for the app to work at all. Grants + `ALTER DEFAULT PRIVILEGES` must be re-established for `chat`. |
| Required changes | `SET SCHEMA` x5; `CREATE OR REPLACE` both trigger functions with the new schema; expose `chat`; `GRANT USAGE`; regen types; update every chat-repo call site. |
| Risk | **MEDIUM–HIGH** despite tiny size — it is on the auth/signup hot path and the app-visible API. Low data volume does not help. |

### Move set D — analytics views/matviews/rollups -> `analytics`

**Not recommended.** This is the governed read surface. Moving it breaks the LLM query target, `run_governed_sql`, `_refresh_governed_matviews()` (unqualified `refresh materialized view v_lineup_ratings`), `nba_reader` grants, generated types, and any `supabase.from('v_*')`. All cost, no benefit. Risk **HIGH**, value **LOW**.

---

## 5. Hidden-risk audit

### Verified this session

1. **`nba_reader` has no `search_path`** and inherits the cluster default `"$user", public, extensions`. `run_governed_sql()` runs user SQL as this role. Any table that leaves `public` is invisible to governed queries unless `ALTER ROLE nba_reader SET search_path = ...` (or `ALTER DATABASE`). Primary landmine, because the SQL is model-generated, not code you can grep.
2. **Unqualified references + no pinned `search_path`** in `lineup_ratings()`, `player_on_off()` (both overloads), `ml_run_defensive_kmeans()`, `ml_run_twoway_kmeans()`, `_refresh_governed_matviews()`. They work today only by search_path luck.
3. **`SECURITY DEFINER` functions that pin `SET search_path = public`**: `handle_new_user`, `roster_starts_leaders`, `list_distinct_game_stat_names`, `rebuild_season_stats_from_games`, `rebuild_season_stats_one_stat`, `rebuild_player_season_teams_games_started`, `upsert_game_meta`, `upsert_season_stat_deltas`, `stamp_play_enriched_3d`, `enrich_play_{closeouts,drives,jumps,off_ball_screens,passes,picks,rebounds,shots}_3d`. Pinning `public` is correct practice, but it means these silently keep resolving to `public` after a move and fail — and you cannot "fix" them by loosening the pinned path without reintroducing a `search_path` injection surface on a `SECURITY DEFINER` function.
4. **Hard-coded schema qualifiers that would become wrong:** `handle_new_user` -> `public.profiles`; `touch_conversation_updated_at` -> `public.conversations`. Moving `profiles`/`conversations` breaks signup and chat insert until these are edited.
5. **`ALTER DEFAULT PRIVILEGES` is scoped to `public` only** (owners `postgres`, `supabase_admin`). Every new schema starts with no default grants — good for security, but every future table needs explicit grants or its own default-privileges block.
6. **Supabase-default permissive grants:** `anon` currently has full DML on all 62 `public` tables (incl. all 15 RLS-disabled `ml_*`). A move that lands tables in an *unexposed* schema is real hardening; a move that then exposes the schema is not.
7. **RLS disabled on 15 `ml_*` tables** — Supabase security advisor flags this **critical** (`rls_disabled`). Remediation SQL exists but must not be auto-applied (enabling RLS with no policies blocks all access). Fix before, and independently of, any reorg.
8. **Two edge functions** resolve `ml_player_style_signature_stats` through PostgREST with no schema qualifier. `verify_jwt=false`; `ml-signature-export-temp` guards only with a hard-coded token string. They break silently on a move (HTTP 500, not a deploy error).
9. **`pg_cron` is installed**, `cron.job` is empty now, but migration history (`enable_pg_cron_for_promotion`) shows scheduled jobs have been used for "raw promotion." If re-enabled, `cron.schedule(...)` embeds literal SQL with table names and runs under a role whose `search_path` must be checked.
10. **PostgREST schema cache:** any DDL needs `NOTIFY pgrst, 'reload schema'` (Supabase migrations trigger this automatically; a manual `SET SCHEMA` via the SQL editor may not).
11. **Exposed-schemas ordering:** if you expose `raw` and `public` and both contain (via compatibility views) an object of the same name, PostgREST resolves by configured order — a subtle way to serve the wrong object.

### Inferred (consumer repo absent)

12. The chat/query-engine repo almost certainly contains: hard-coded bare table names in `sql-primer.ts` / few-shot prompt examples / `concept-dictionary.ts`; a `schema-registry.ts` enumerating `public` tables; generated `database.types.ts` typed as `Database['public']['Tables']`; possibly a table allow-list for `run_governed_sql`. None of this can be scoped from here.
13. There is likely an offensive-model `ml_run_style_kmeans`-type helper implied by migration `create_ml_player_style_clustering_helpers`, but it does **not** appear in `pg_proc` today — renamed, dropped, or an overload missed. Minor unknown.

### Safer than a naive text search suggests (PostgreSQL semantics; confirm on a branch)

- `ALTER TABLE ... SET SCHEMA` **preserves** view / matview / FK / trigger dependencies — tracked by OID, not name. Existing `v_*` views do **not** break on a table move; `pg_get_viewdef` simply starts printing the qualified name. Object grants and RLS policies travel with the object.
- Cross-schema FKs are fully supported; the ~25 `season_ingests` FKs keep working.

---

## 6. Recommended migration strategy (staged, reversible)

### Stage 0 — Prerequisites (do regardless of whether you proceed)

- Fix RLS on the 15 `ml_*` tables (enable + explicit policies, or confirm service-role-only and revoke `anon` / `authenticated` grants).
- Bring the consumer repo into this review. Grep it for: bare `play_*` / `ml_*` / `v_*` names, `.from(`, `.schema(`, `Database['public']`, `run_governed_sql`, `sql-primer`, table allow-lists.
- Snapshot: `pg_dump --schema-only`; full grants / policies / function defs; current "Exposed schemas" value from the dashboard.
- Create a Supabase **preview branch** and rehearse every stage there first.

### Stage 1 — Pilot: `ml` schema (lowest coupling)

1. `CREATE SCHEMA ml;` `GRANT USAGE ON SCHEMA ml TO service_role;` (+ `authenticated` only if needed). `ALTER DEFAULT PRIVILEGES IN SCHEMA ml GRANT SELECT ON TABLES TO service_role;`
2. `ALTER TABLE public.ml_* SET SCHEMA ml;` (optionally rename to drop the `ml_` prefix as a *separate later step* to keep this one reversible).
3. `CREATE OR REPLACE FUNCTION` for `ml_run_defensive_kmeans` / `ml_run_twoway_kmeans` with `SET search_path = ml, public` (or fully-qualified refs).
4. Decide whether to expose `ml` via PostgREST:
   - **No:** update both edge functions to use a direct PG connection, or keep them pointed at compatibility views (`CREATE VIEW public.ml_player_style_signature_stats AS SELECT * FROM ml.player_style_signature_stats`).
   - **Yes:** add `ml` to exposed schemas, grant, add RLS, change edge functions to `.schema('ml')`.
5. Regenerate types (`--schema public,ml`), update consumer repo, redeploy edge functions.
6. **Verify** (Stage 7 checks). **Rollback** = `ALTER TABLE ml.* SET SCHEMA public` + revert functions.
7. Bake for a week.

### Stage 2 — `raw` schema, with compatibility layer

1. `CREATE SCHEMA raw;` grant `USAGE` to `authenticated`, `nba_reader`, `service_role`, `anon`; set default privileges.
2. `ALTER TABLE public.play_*, game_matchups, feed_artifacts, tracking_artifacts, play_set_facts, play_ingest_status, season_ingests SET SCHEMA raw;` — one table per migration, or one tested transaction.
3. Immediately `CREATE VIEW public.<name> AS TABLE raw.<name>;` for every moved table. Keeps `run_governed_sql`, PostgREST, generated types, and the `v_*` views working with **zero prompt or code changes**.
4. Recreate/qualify the write-path functions: `enrich_play_*_3d`, `rebuild_*`, `lineup_ratings`, `player_on_off` -> `SET search_path = raw, public, extensions` or qualify.
5. `ALTER ROLE nba_reader SET search_path = public, raw, extensions;` and/or `ALTER DATABASE postgres SET search_path = "$user", public, raw, ml, extensions;` as defense in depth.
6. **Verify.** Rollback = drop the `public` views, `SET SCHEMA public` back.
7. Bake. Only *after* the consumer repo's primer/registry has been updated to qualify names, consider dropping the compatibility views (Stage 4).

### Stage 3 — `chat` schema (only if still wanted)

- Same pattern, but recreate `handle_new_user` and `touch_conversation_updated_at` **in the same transaction** as the move, expose `chat`, and explicitly test signup + `chat_turns` insert. Keep compatibility views for `profiles` / `conversations` if any Supabase Auth tooling needs them.

### Stage 4 — Decommission compatibility views (optional, weeks later)

Once consumers are fully migrated and telemetry shows no fallback usage.

### Never

- A single "rename/move everything" migration.
- Moving the `v_*` analytics surface.
- Moving anything before the consumer repo is audited.

---

## 7. Validation plan

### Before (capture baseline on prod + branch)

- `pg_dump --schema-only` diff target.
- Row counts for every table: `SELECT relname, n_live_tup FROM pg_stat_user_tables`.
- Inventory snapshots: `pg_policies`, `information_schema.role_table_grants`, `information_schema.role_routine_grants`, `pg_proc` defs, `pg_constraint` (FKs), `pg_trigger`, `pg_matviews`.
- `pg_get_viewdef` for all 19 views/matviews.
- Golden query set: run 20–50 representative governed queries (from `pg_stat_statements` and the chat repo's few-shot examples) through `run_governed_sql()` / `run_readonly_sql()`; save result hashes.
- `curl` the REST API for one row from each currently-exposed table; save status + shape.
- Invoke both edge functions; save `playerCount` / `traitRowCount`.
- Run Supabase **security advisor** and **performance advisor**; save.
- `EXPLAIN` a few heavy `v_*` queries; save plans.

### After each stage

- Re-run all of the above; diff.
- `SELECT * FROM pg_matviews WHERE ispopulated IS FALSE;` -> expect empty.
- `_refresh_governed_matviews()` runs clean; `v_lineup_ratings` / `v_player_on_off` row counts unchanged.
- Every `v_*` view: `SELECT count(*)` equals baseline.
- Every RPC: call once with representative args (`lineup_ratings`, `player_on_off` x2, `roster_starts_leaders`, `list_distinct_game_stat_names`, `run_readonly_sql`, `run_governed_sql`, one `enrich_play_*_3d` with a real payload on the branch, one `rebuild_*`, `ml_run_defensive_kmeans(6,1,2)`).
- Golden governed-query set: identical result hashes.
- REST API: same status/shape for still-exposed paths; intended 404s where a table was un-exposed.
- Auth: create a throwaway user on the branch -> `profiles` row appears (`handle_new_user`). Insert a `chat_turns` row -> parent `conversations.updated_at` bumps (trigger).
- Edge functions: re-invoke, same counts.
- `NOTIFY pgrst, 'reload schema';` then re-check API.
- Advisors: no **new** criticals (the `ml_*` RLS finding should be **gone** if Stage 0 was done).
- Consumer app: run its test suite + a manual smoke of the chat flow against the branch.
- `pg_stat_user_tables` live-tuple counts unchanged (no accidental data loss).

### Go-live gate

Branch passed all of the above twice, 48h apart, and a documented rollback script was executed successfully on the branch at least once.

---

## 8. Go / no-go recommendation

**No-go on the full reorganization as described. Conditional go on a narrow slice.**

- **Do now:** enable/define RLS on the 15 `ml_*` tables (or lock them to `service_role`). The only urgent finding.
- **Do soon, low risk:** move `ml_*` into an `ml` schema (Stage 1) *if* the consumer repo is audited first. Isolated, reversible in seconds, matches intent already stated in `PROJECT_CONTEXT.md` §32, and doubles as a security improvement if `ml` stays unexposed.
- **Defer:** `raw`. Defensible, and the project already has a "raw promotion" model, but it only pays off with the compatibility-view layer **and** a rewrite of the chat repo's SQL primer/registry. Without those, you are exposing a live LLM SQL surface to `relation does not exist` errors.
- **Do not:** move the `v_*` / analytics / RPC surface, or the `chat` tables. High blast radius (auth signup, governed query engine, generated types, PostgREST), essentially no benefit over the current `v_*` / naming conventions.

The deciding factor: the code most affected by this migration — the semantic layer, query engine, prompt primer, and generated types — is **not in this repository and was not reviewed**. Treated as a production migration review, you cannot safely execute a move of the shared warehouse tables until that code is in scope. The `ml`-only slice is the exception because its consumers (2 functions, 2 edge functions) are fully visible here.

### Unknowns to resolve before proceeding

1. Current Supabase "Exposed schemas" value (dashboard -> Settings -> API). Presumed `public` only; unverified.
2. The consumer repo: bare table-name usage, `Database['public']` typing, `run_governed_sql` allow-list, few-shot SQL examples.
3. Whether `hu-export` / `ml-signature-export-temp` are still in use or are dead "temp" functions.
4. Whether any `pg_cron` "promotion" job is expected to return.
5. Whether Supabase Auth config or any dashboard feature depends on `public.profiles` specifically.
6. The missing offensive-model kmeans helper implied by migration `create_ml_player_style_clustering_helpers` (not in `pg_proc` today).
