# Hidden Unicorn — Project Context

> **Purpose of this file:** This is the canonical project brief for coding agents working on the Hidden Unicorn web application. Read this before making product, modeling, data, visualization, or architectural decisions.
>
> This document summarizes the decisions and analysis developed through an extended working session. It is intentionally a project brief rather than a conversation transcript.

---

## 1. Project in one sentence

**Hidden Unicorn** is an interactive NBA scrollytelling experience that uses detailed player-behavior data and unsupervised learning to discover natural playing archetypes, then identifies the players whose actual behavior does not fit comfortably into even the archetype that describes them best.

The central idea is:

> Traditional basketball unicorns are unusual because of what their bodies allow them to do. Hidden Unicorns are unusual because the way they play does not fit the league's normal behavioral categories.

The project should feel like an interactive editorial story, not a BI dashboard.

---

# 2. The editorial thesis

Basketball traditionally uses labels like point guard, shooting guard, wing, power forward, center, stretch five, 3-and-D, rim runner, etc.

Those labels are useful, but they are imposed **before** examining how players actually behave.

Hidden Unicorn asks a different question:

1. Remove positions and conventional player labels.
2. Describe every player using detailed basketball actions and tendencies.
3. Let an unsupervised model discover the naturally occurring player archetypes.
4. Ask which players are still difficult to describe even after the game has defined its own categories.

A useful formulation:

> Previous approaches to basketball uniqueness often ask how unusual a player's statistics are relative to a traditional position. Hidden Unicorn takes the idea one step further: first throw the positions away, let detailed event data define its own archetypes, then ask which players still refuse to fit into any of them.

Another important line:

> **The next great archetype has to begin as an outlier.**

And:

> **The unicorn eventually produces a herd.**

The project is **not** attempting to rank the best players.

A Hidden Unicorn score measures **behavioral distinctiveness**, not quality, efficiency, impact, or value.

Nicolas Batum can therefore be more behaviorally unusual than Nikola Jokic without the model claiming Batum is a better basketball player.

---

# 3. Dataset / cohort

The analysis currently uses:

- `season_year = 2025`
- This corresponds to the **2025–26 NBA season**.
- `game_type = 'regular'`
- 1,230 regular-season games
- Player cohort requires **at least 250 touches**.
- Final offensive clustering cohort: **473 players**.

The source warehouse contains detailed Genius Sports / Second Spectrum-style basketball event data.

Relevant raw event scale observed during the analysis:

| Event table | Rows |
|---|---:|
| `play_touches` | 1,138,092 |
| `play_passes` | 818,567 |
| `play_chances` | 360,036 |
| `play_shots` | 268,104 |
| `play_picks` | 173,800 |
| `play_rebounds` | 145,405 |
| `play_drives` | 132,076 |
| `play_off_ball_screens` | 109,406 |
| `play_isolations` | 55,133 |
| `play_handoffs` | 53,635 |
| `play_turnovers` | 40,376 |
| `play_posts` | 10,902 |

The web app should not query these raw tables directly in the browser.

For the public/editorial application, prefer a generated static dataset or a lightweight curated API.

---

# 4. Core modeling philosophy

## 4.1 Style, not quality

The canonical offensive model intentionally describes **how a player plays**, rather than how well he performs.

Examples of inputs that belong in the style model:

- touch duration
- dribbles per touch
- passes per touch
- drives
- isolations
- post-ups
- pick-and-roll roles
- handoffs
- off-ball screens
- cuts
- catch-and-shoot behavior
- pull-ups
- shot-location tendencies

Examples deliberately excluded from the initial style model:

- makes / misses
- shooting efficiency
- points
- turnovers as an outcome measure
- qSQ
- qSP
- qSI
- qSM
- plus/minus
- opponent outcomes

Those can eventually support a **style + impact** model, but that is a separate analytical question.

## 4.2 Do not feed conventional positions into clustering

Position is not an input feature.

The goal is explicitly to let behavior create the taxonomy.

Positions can later be used as:

- annotations
- validation
- diagnostics
- comparison controls

A useful validation experiment for the future is to compare:

1. archetype-relative uniqueness
2. traditional-position-relative uniqueness

Players unusual under both definitions would be especially compelling Hidden Unicorns.

## 4.3 Rates instead of totals

The model uses normalized behavioral rates/shares so playing time and raw event volume do not dominate.

Examples:

- drives per touch
- passes per touch
- PnR ballhandler events per touch
- shot-type shares

---

# 5. Canonical offensive feature set

The current offensive feature matrix has **31 standardized behavioral dimensions**.

Order matters because some stored model vectors use this exact ordering.

1. average touch time
2. dribbles per touch
3. direct touch rate
4. catch-and-shoot touch rate
5. potential catch-and-shoot rate
6. double-team touch rate
7. passes per touch
8. kickout pass rate
9. skip pass rate
10. attacking pass rate
11. reversal pass rate
12. drives per touch
13. drive kickout rate
14. drive rim rate
15. drive pullup rate
16. drive blowby rate
17. isolation per touch
18. post per touch
19. PnR ballhandler per touch
20. PnR screener per touch
21. PnR roll rate
22. PnR pop rate
23. handoff receiver per touch
24. handoff setter per touch
25. off-ball cutter per touch
26. off-ball screener per touch
27. shots per touch
28. three-point attempt share
29. rim shot share
30. catch-and-shoot shot share
31. pullup shot share

Preprocessing:

- Missing/no-recorded-action values coalesced to zero where appropriate.
- Each feature clipped/winsorized to the cohort 1st / 99th percentile.
- Then standardized using clipped cohort mean and standard deviation.

---

# 6. Offensive clustering model

The baseline clustering method is K-means over the standardized 31-dimensional offensive behavior matrix.

Tested cluster counts:

- K = 6
- K = 8
- K = 10

Multiple deterministic restarts were run.

### Why K=8 is canonical

K=6 had the best pure statistical separation according to rough cluster-separation diagnostics, but it was too coarse basketball-wise and merged distinct creator/player roles.

K=10 added granularity but increasingly fragmented coherent basketball categories.

**K=8 was chosen as the best balance of statistical coherence and basketball interpretability.**

For the application, treat **8 offensive clusters** as the canonical taxonomy unless explicitly running a sensitivity comparison.

Canonical run:

- `k = 8`
- `restart = 2`

---

# 7. The eight canonical offensive archetypes

These labels are working editorial names. They may evolve, but their underlying cluster assignments/model should not be casually changed.

## Cluster 1 — Hybrid Interior Hubs

Core behavioral signature:

- elevated post involvement
- elevated isolation involvement
- more double-team touches
- direct offensive involvement
- interior creation
- often blends big-man and creator behavior

Representative / notable members:

- Nikola Jokic
- Victor Wembanyama
- Bam Adebayo
- Chet Holmgren
- Evan Mobley
- Julius Randle
- Alperen Sengun
- Paolo Banchero
- Giannis Antetokounmpo
- Zion Williamson

Approximate cluster size: **35**.

Model prototype / closest-to-centroid example identified in the app work:

- **Victor Wembanyama**

Important editorial point: Jokic and Giannis fit this family but remain highly unusual members of it.

---

## Cluster 2 — Low-Dribble Connective Frontcourt

Core behavioral signature:

- low touch time
- low dribble count
- catch-and-shoot readiness
- connective passing
- perimeter-friendly frontcourt behavior
- lower on-ball creation burden

Representative / notable members:

- Draymond Green
- Toumani Camara
- Naz Reid
- Nikola Vucevic
- Royce O'Neale
- Bobby Portis
- Sandro Mamukelashvili
- Ryan Dunn
- Harrison Barnes

Approximate cluster size: **101**.

Prototype identified:

- **Jamir Watkins**

This is a relatively broad cluster and is one of the groups most likely to benefit from future taxonomy refinement.

---

## Cluster 3 — Movement / Off-Ball Scorers

Core behavioral signature:

- off-ball cutting
- handoff receiving
- catch-and-shoot behavior
- elevated shot frequency per touch
- perimeter shot mix
- lower traditional playmaking burden

Representative / notable members:

- Mikal Bridges
- Donte DiVincenzo
- Trey Murphy III
- Michael Porter Jr.
- Nickeil Alexander-Walker
- Brandon Miller
- Quentin Grimes
- AJ Green
- Corey Kispert
- Klay Thompson

Approximate cluster size: **74**.

Prototype identified:

- **Max Christie**

---

## Cluster 4 — Connective Slashers

Core behavioral signature:

- drives
- rim pressure
- kickout passing
- reversals
- connective creation
- lower shot consumption than primary creators

Representative / notable members:

- Amen Thompson
- Dyson Daniels
- Josh Hart
- Ayo Dosunmu
- Jaime Jaquez Jr.
- Naji Marshall
- Jaden McDaniels
- Matas Buzelis

Approximate cluster size: **60**.

Prototype identified:

- **DeJon Jarreau**

---

## Cluster 5 — Rim-Running Screen Bigs

This is one of the cleanest / most coherent archetypes in the model.

Core behavioral signature:

- high PnR screener involvement
- off-ball screening
- handoff setting
- roll frequency
- rim finishing
- very little perimeter creation
- very low three-point share

Representative / notable members:

- Rudy Gobert
- Jalen Duren
- Nic Claxton
- Deandre Ayton
- Neemias Queta
- Donovan Clingan
- Isaiah Jackson
- Yves Missi
- Goga Bitadze

Approximate cluster size: **70**.

Prototype identified:

- **Marvin Bagley III**

Do not interpret "prototype" as best player. It means behaviorally closest to the cluster centroid.

---

## Cluster 6 — Primary Shot Creators

Core behavioral signature:

- isolation creation
- direct touches
- PnR ballhandler involvement
- double teams
- drives
- self-created shots
- low catch-and-shoot dependence

Representative / notable members:

- Jalen Brunson
- Luka Doncic
- James Harden
- Donovan Mitchell
- De'Aaron Fox
- Kevin Durant
- Devin Booker
- Jaylen Brown
- Cooper Flagg
- CJ McCollum
- Shai Gilgeous-Alexander
- Stephen Curry

Approximate cluster size: **39**.

Prototype identified:

- **CJ McCollum**

Conceptual distinction:

> **Cluster 6:** “I create shots and bend the defense.”

---

## Cluster 7 — Perimeter Organizers

Sometimes described as “Secondary Pull-Up Guards.”

Core behavioral signature:

- high passes per touch
- higher dribble burden
- longer touch time
- PnR ballhandler organization
- pull-up shooting
- lower rim orientation than penetration-heavy creators

Representative / notable members:

- Derrick White
- Immanuel Quickley
- Andrew Nembhard
- Payton Pritchard
- Brandin Podziemski
- Jalen Suggs
- Jose Alvarado
- Bub Carrington
- Reed Sheppard

Approximate cluster size: **42**.

Prototype identified:

- **Bones Hyland**

Conceptual distinction:

> **Cluster 7:** “I organize offense and make perimeter decisions.”

---

## Cluster 8 — Drive-First Lead Creators

Core behavioral signature:

- long touches
- high dribble volume
- penetration
- passing off drives / ball pressure
- substantial PnR ballhandler usage
- less catch-and-shoot behavior

Representative / notable members:

- Tyrese Maxey
- LaMelo Ball
- Josh Giddey
- Stephon Castle
- Russell Westbrook
- Ryan Rollins
- Keyonte George
- Jeremiah Fears
- Isaiah Collier

Approximate cluster size: **52**.

Prototype identified:

- **Ryan Rollins**

Conceptual distinction:

> **Cluster 8:** “I initiate offense primarily through penetration and ball pressure.”

---

# 8. What is a Hidden Unicorn?

A player's cluster assignment alone does **not** determine whether he is a Hidden Unicorn.

For every player:

1. Compute his distance to every cluster centroid in the original standardized feature space.
2. Find the minimum distance.
3. That minimum is his **nearest-archetype distance**.
4. Convert that distance to a cohort percentile for interpretation.

Canonical definition:

> **Offensive Hidden Unicorn Score = distance to the nearest offensive archetype centroid.**

High distance means:

> Even the naturally occurring archetype that fits this player best does not describe him very well.

This is different from measuring distance to an assigned cluster only if assignments could be inconsistent. In K-means, the assigned cluster should already be the nearest centroid, but conceptually the score is always **minimum distance to any centroid**.

Do **not** use sum or average distance to all centroids as the uniqueness score.

---

# 9. Uniqueness vs ambiguity

These are separate concepts and should remain separate in the UI.

## Uniqueness / outlier score

Distance to nearest centroid.

High = no archetype describes the player particularly well.

## Ambiguity / hybrid score

Difference between nearest and second-nearest centroid distance.

Small gap = player sits between two archetypes.

This does **not** necessarily mean he is globally unusual.

Useful editorial taxonomy:

### Unicorn within an archetype

- high nearest-centroid distance
- one archetype still clearly closest
- larger nearest-to-second gap

Examples include players such as Giannis, Klay, DeRozan, Jokic.

### Hybrid / taxonomy-edge player

- somewhat high nearest distance
- second cluster nearly as close

Examples in the initial analysis included Vucevic and Rui Hachimura.

### True Hidden Unicorn

- far from all prototypes
- still may have one family that is technically closest

---

# 10. Canonical offensive Hidden Unicorn leaderboard

For editorial purposes, use a meaningful sample cutoff.

The working high-confidence leaderboard used **>= 1,500 touches**.

Top 10 offensive Hidden Unicorns:

| Rank | Player | Offensive uniqueness percentile | Assigned archetype |
|---:|---|---:|---|
| 1 | Nicolas Batum | 99.2 | Low-Dribble Connective Frontcourt |
| 2 | DeMar DeRozan | 98.9 | Primary Shot Creators |
| 3 | Zion Williamson | 98.7 | Hybrid Interior Hubs |
| 4 | Nikola Vucevic | 98.5 | Low-Dribble Connective Frontcourt |
| 5 | Dillon Brooks | 97.9 | Primary Shot Creators |
| 6 | Klay Thompson | 97.2 | Movement / Off-Ball Scorers |
| 7 | Draymond Green | 96.8 | Low-Dribble Connective Frontcourt |
| 8 | Giannis Antetokounmpo | 96.6 | Hybrid Interior Hubs |
| 9 | Rui Hachimura | 96.2 | Low-Dribble Connective Frontcourt |
| 10 | Nikola Jokic | 96.0 | Hybrid Interior Hubs |

Additional notable high-sample players:

- Brook Lopez
- Jay Huff
- Norman Powell
- Kevin Durant
- Lauri Markkanen
- AJ Green
- Sam Hauser
- Jock Landale
- Devin Booker
- Ivica Zubac

Important nuance:

- **Vucevic** and **Rui** had very small nearest/second-nearest gaps and are better framed as hybrids / taxonomy-edge cases than pure unicorns.
- **Klay, Giannis, DeRozan** had high uniqueness with clearer archetype membership and are compelling "unicorn within an archetype" examples.

---

# 11. Why specific offensive unicorns are unusual

These are useful for player detail panels and scroll-story examples.

Feature deviations below are relative to the player's nearest cluster centroid, measured in model-standardized units.

## Nicolas Batum

Closest archetype: Low-Dribble Connective Frontcourt.

Notable deviations:

- unusually high drive blowby behavior
- unusually high drive kickout behavior
- unusually low drive-to-rim behavior
- lower rim shot share
- lower shots per touch

Interpretation:

Batum has a connective frontcourt profile but handles drives in a highly unusual way: he creates penetration and passes out rather than consuming possessions at the rim.

---

## DeMar DeRozan

Closest archetype: Primary Shot Creator.

Major deviations:

- post involvement: about **+3.71z**
- kickout passing: about **+2.29z**
- reversal passing: about **+1.88z**
- off-ball cutting: about **+1.71z**
- isolation involvement: about **+1.64z**

Interpretation:

He is recognizable as a primary creator, but his old-school post/iso ecosystem plus passing and cutting behavior is unlike the typical modern primary creator.

---

## Zion Williamson

Closest archetype: Hybrid Interior Hub.

Notable deviations:

- reversal passing +2.29z
- kickouts +2.21z
- drives per touch +1.95z
- iso involvement +1.88z
- double-team touches +1.81z

Interpretation:

He is an interior creator who attacks far more like a downhill perimeter initiator than the typical member of his family.

---

## Draymond Green

Closest archetype: Low-Dribble Connective Frontcourt.

Notable deviations:

- attacking pass rate +3.85z
- shots per touch −2.20z
- passes per touch +2.08z
- reduced double-team / catch-and-shoot characteristics relative to cluster

Interpretation:

The model effectively discovers that Draymond has an unusually specific offensive job description: highly connective, aggressive as a passer, and extraordinarily low-consumption as a scorer.

---

## Giannis Antetokounmpo

Closest archetype: Hybrid Interior Hub.

Notable deviations:

- post involvement +2.51z
- kickout passing +2.21z
- double-team touches +1.81z
- skip passes +1.66z

Interpretation:

The model knows his broad "species" but he remains an extreme member of it.

This is a strong example of a **unicorn within an archetype**.

---

## Nikola Jokic

Closest archetype: Hybrid Interior Hub.

Notable deviations:

- post involvement +2.44z
- attacking passing +2.28z
- skip passing +1.83z
- handoff setting +1.66z
- lower drives per touch than the typical cluster member

Interpretation:

The taxonomy can identify the kind of player Jokic is, but very few players actually resemble him closely.

A useful line:

> **The model knows Jokic's species. It just doesn't find many members of it.**

---

## Klay Thompson

Closest archetype: Movement / Off-Ball Scorer.

Notable deviations:

- attacking passing +2.87z
- direct touch behavior +2.19z
- off-ball cutting +2.08z
- shots per touch +1.86z
- catch-and-shoot touch behavior +1.78z

Interpretation:

Even among off-ball scorers, Klay's combination of shooting volume, movement, directness, and secondary actions remains unusually extreme.

---

# 12. Prototype players

For every archetype, define a **prototype** as the player closest to that cluster centroid.

Prototype ≠ best player.

Prototype means:

> This player's behavior is the cleanest real-world example of the archetype learned by the model.

Known v1 prototype examples:

| Cluster | Prototype |
|---|---|
| Hybrid Interior Hubs | Victor Wembanyama |
| Low-Dribble Connective Frontcourt | Jamir Watkins |
| Movement / Off-Ball Scorers | Max Christie |
| Connective Slashers | DeJon Jarreau |
| Rim-Running Screen Bigs | Marvin Bagley III |
| Primary Shot Creators | CJ McCollum |
| Perimeter Organizers | Bones Hyland |
| Drive-First Lead Creators | Ryan Rollins |

The application should visually distinguish:

- prototype
- typical archetype members
- edge / hybrid players
- Hidden Unicorns

A strong cluster interaction is a spectrum:

> **Most typical ←────────────→ least typical**

---

# 13. Defensive model — current status

Defense is **not yet as canonical or trusted as offense**.

Do not present defensive rankings with the same confidence unless explicitly labeled experimental.

A separate defensive feature matrix has been built with 24 features.

Current defensive feature order:

1. contests per 100 matchup seconds
2. heavy contest rate
3. rearview contest rate
4. average contest distance
5. average contest speed
6. closeouts per 100 matchup seconds
7. full closeout rate
8. fly-by closeout rate
9. short closeout rate
10. X-out rate
11. ballhandler pick defenses per 100 matchup seconds
12. ballhandler over rate
13. ballhandler under rate
14. ballhandler switch rate
15. ballhandler ICE rate
16. ballhandler blitz rate
17. screener pick defenses per 100 matchup seconds
18. screener drop rate
19. screener switch rate
20. screener show rate
21. screener ICE rate
22. screener blitz rate
23. steals per 100 matchup seconds
24. defensive rebounds per 100 matchup seconds

A defense-only K-means model has been run experimentally.

However, several methodological concerns remain.

---

# 14. Why the defensive model needs further audit

The primary concern is **conceptual weighting**, not merely numerical standardization.

Even if every column is z-scored, an event family with many columns receives more geometric influence.

For example, pick-and-roll defense occupies a large fraction of the 24 defensive columns.

Potential problems:

### 14.1 Screen-defense overrepresentation

Ballhandler + screener pick coverage contributes many dimensions:

- event frequencies
- over
- under
- switch
- ICE
- blitz
- drop
- show
- etc.

This may cause screen behavior to dominate the defensive geometry.

### 14.2 Position / role opportunity

Bigs naturally accumulate screener-defender events.

Guards naturally accumulate ballhandler-defender events.

Therefore the model may partly rediscover traditional position / matchup role rather than defensive style.

### 14.3 Compositional features

Coverage shares are mutually exclusive categories.

Treating each percentage as an independent Euclidean dimension may effectively overweight one event family.

Possible future approaches:

- centered log-ratio transforms
- within-family PCA
- explicit feature-family weights
- conditional coverage distributions

### 14.4 Team scheme

Drop, switch, ICE, blitz, etc. are influenced heavily by coaching scheme and teammates.

A player's defensive archetype may partly reflect team system rather than individual behavior.

### 14.5 Steals / rebounds

These are more outcome/activity-like than pure style variables.

A future defensive model should consider:

- a strict style version without them
- a sensitivity version including them

---

# 15. Better future definition of defensive uniqueness

A cleaner conceptual question is:

> **Given the defensive situations a player encounters, how unusually does he respond to them?**

This separates:

### Opportunity

What defensive jobs does the player encounter / perform?

from

### Behavior conditional on opportunity

When he is in that situation, what coverage / action does he choose?

This distinction could substantially improve the defensive model.

Potential conceptual feature families for balanced weighting:

1. contest activity/profile
2. closeout activity/profile
3. ballhandler PnR defense
4. screener PnR defense
5. disruption
6. rebounding
7. matchup identity / who the player guards
8. matchup diversity

The feature-family concept is important: **equal per-column weighting is not necessarily equal conceptual weighting.**

---

# 16. Experimental defensive unicorns

Current defense-only results are exploratory rather than final.

High-sample players appearing near the top included:

- Day'Ron Sharpe
- Nic Claxton
- Donovan Clingan
- Victor Wembanyama
- Draymond Green
- Jay Huff
- Tyus Jones
- Jusuf Nurkic
- Jock Landale
- Kyle Filipowski

The big-heavy nature of this list is one reason the feature design requires more validation.

Importantly, **blocks are not one of the current 24 defensive features**.

The model is finding combinations of:

- contest behavior
- closeouts
- PnR coverages
- role frequencies
- disruption
- rebounding

### Tyus Jones example

Tyus is useful because he demonstrates the metric is not simply finding shot-blocking centers.

Relative to his nearest defensive archetype, unusual dimensions included roughly:

- screener show rate +2.41z
- rear-view contest rate +2.06z
- heavy contest rate −1.92z
- longer contest distance
- lower contest / closeout activity

Again, this means unusual defensive behavior, **not good defense**.

### Draymond example

His defensive distinctiveness appears connected to aggressive / unusual coverage combinations such as:

- screener blitzing
- ballhandler blitzing
- fly-by closeouts
- lower conventional drop behavior

This is conceptually promising because it aligns with the basketball intuition that he defends unlike a conventional frontcourt player.

---

# 17. Canonical framework: Offense / Defense / Two-Way should be separate

Do **not** treat the original combined 55-dimensional offense+defense K-means model as the primary framework.

A balanced 50/50 numerical weighting was implemented experimentally, but equal numerical block weighting does not guarantee equal conceptual representation.

The cleaner framework is:

## Offensive Hidden Unicorn

Independent offensive clustering.

Question:

> **There isn't a normal offensive archetype that adequately describes you.**

This model is currently the most mature and should drive v1 of the application.

## Defensive Hidden Unicorn

Independent defensive clustering after feature design is improved and validated.

Question:

> **There isn't a normal defensive archetype that adequately describes you.**

## Two-Way Hidden Unicorn

Should be derived from **independently normalized offensive and defensive uniqueness scores**, rather than blindly clustering all raw O+D dimensions together.

Question:

> **Neither side of your basketball identity fits comfortably into the league's normal archetypes.**

---

# 18. Future Two-Way Unicorn score

Several formulations were discussed.

### Geometric mean

If O and D are percentile scores:

`two_way = sqrt(offense_percentile * defense_percentile)`

This penalizes imbalance while still allowing continuous ranking.

Examples:

- 99 offense / 50 defense → ~70
- 90 / 90 → 90
- 97 / 95 → ~96

### Strict minimum

A later discussion favored an even stricter editorial definition:

`two_way = min(offense_percentile, defense_percentile)`

This means a player can only rank as highly as his weaker side.

That has a compelling semantic advantage:

> You cannot compensate for ordinary defense by being insanely weird offensively.

Do not hard-code a final choice before the defensive model is trustworthy.

The app architecture should make it easy to experiment with:

- min
- geometric mean
- harmonic mean

---

# 19. Position vs archetype

We deliberately do **not** filter by listed position before clustering.

The philosophical replacement is:

Traditional model:

> Compare guards to guards, wings to wings, centers to centers.

Hidden Unicorn model:

> Let basketball behavior define the peer groups, then compare each player with the behavioral archetype nearest to him.

However, archetypes may inherit positional structure from the features.

Therefore conventional positions should be used as a **validation/control layer**, not as clustering inputs.

Potential analysis:

- show cluster position composition
- determine whether clusters simply recreate PG/SG/SF/PF/C
- compare archetype-relative uniqueness with position-relative uniqueness

The hypothesis worth testing:

> Behavioral archetypes should explain player identity better than the position label printed next to his name.

---

# 20. Web application product vision

The application should feel like a **scrollytelling basketball essay** rather than an analytics dashboard.

Think interactive editorial visualization / The Pudding / NYT graphics rather than Tableau.

The same core player-space visualization should persist through most of the story and transform as the reader scrolls.

---

# 21. Main visual metaphor: the NBA player galaxy

Every player is a point / star.

The 2D display is a projection of the higher-dimensional behavioral feature space.

Important analytical rule:

> **Do not compute actual model distances using the 2D visualization coordinates.**

The 2D projection exists for display only.

Cluster membership, nearest neighbors, centroid distance, and Hidden Unicorn score should be based on the original standardized feature vectors.

Recommended projection for display:

- UMAP is a strong candidate for an intuitive neighborhood map.
- PCA can be retained as an alternate / diagnostic.

If UMAP is used, disclose that visual distances are approximate representations of the 31-dimensional space.

---

# 22. Proposed scroll narrative

A strong v1 sequence:

## Scene 1 — The traditional unicorn

Introduce the conventional basketball unicorn concept:

- Kristaps Porzingis
- Giannis Antetokounmpo
- Victor Wembanyama

The traditional question:

> Who can do something their body says they shouldn't be able to do?

Then turn the question around.

---

## Scene 2 — Basketball puts players in five boxes

Show all players organized into conventional positional columns:

- PG
- SG
- SF
- PF
- C

This can be schematic if actual listed positions are not yet part of the app dataset.

---

## Scene 3 — Throw the positions away

Animate the five columns dissolving.

Copy idea:

> What happens if we stop telling the data what a guard or center is supposed to be?

---

## Scene 4 — Describe behavior instead

Briefly reveal the types of input behaviors:

- touches
- dribbles
- drives
- passes
- pick-and-roll
- post-ups
- handoffs
- off-ball movement
- shot creation

Avoid overwhelming readers with all 31 features at once.

---

## Scene 5 — The game discovers its own positions

Players move into the 2D embedding and the **8 archetypes emerge**.

Allow users to click each archetype.

The cluster view should show:

- archetype name
- short description
- cluster size
- prototype player
- recognizable examples
- high-unicorn member

---

## Scene 6 — Prototype → normal → edge

Explain the centroid using actual players.

Potential visual:

`prototype ← typical members ← edge cases / unicorn`

The prototype should be clearly labeled as behavioral representativeness, not player quality.

---

## Scene 7 — But some players still refuse to fit

Fade most players.

Reveal the high-confidence Hidden Unicorns.

Strong copy:

> We let the game invent its own categories. Some players still didn't fit.

---

## Scene 8 — Meet the Hidden Unicorns

Feature several strong editorial examples one at a time:

- DeMar DeRozan
- Draymond Green
- Giannis Antetokounmpo
- Nikola Jokic
- Nicolas Batum
- Klay Thompson
- Zion Williamson

Each should explain **why** the model finds him unusual.

---

## Scene 9 — Explore the league

Unlock the visualization as a player explorer.

The user should be able to:

- search for a player
- click a player
- click an archetype
- inspect uniqueness percentile
- see nearest behavioral neighbors
- compare a player with archetype prototype
- see feature fingerprint

---

# 23. Player detail interaction

Clicking a player should persist selection and show a side/detail panel.

Suggested content:

### Player name

### Archetype

Example:

`Primary Shot Creator`

### Offensive Hidden Unicorn percentile

Example:

`98.9th percentile`

### Archetype prototype

Example:

`CJ McCollum`

### Behavioral neighbors

Top 3–5 nearest players in the **31-dimensional standardized space**.

### Why this player is unusual

Show the largest deviations from his archetype centroid.

Do not default to a radar chart unless it is clearly superior.

Preferred concept:

- centered horizontal feature bars
- zero = archetype average
- positive / negative deviations
- expand / label the most unusual dimensions

This can become a recognizable “behavioral fingerprint.”

---

# 24. Nearest-neighbor interaction

One of the most interesting exploratory features:

When a player is selected, draw subtle links to his nearest behavioral neighbors.

Critical implementation rule:

> Nearest neighbors must be computed from the real 31-dimensional vectors, **not** whoever happens to look closest in the 2D UMAP layout.

This supports the compelling discovery moment:

> “Wait — why does the model think these two guys play alike?”

Clicking a neighbor should explain the shared behavioral dimensions.

---

# 25. Cluster interaction

Clicking an archetype should dim all other clusters.

Highlight three kinds of player:

### Prototype

Closest to centroid.

### Recognizable example

Potentially manually editorialized so readers immediately understand the category.

### Unicorn / edge member

A high-distance player still assigned to that archetype.

This creates a very intuitive visual definition of a cluster.

---

# 26. Suggested visual vocabulary

Avoid hard circular cluster boundaries that imply precise geographic borders in feature space.

Better metaphors:

- constellations
- neighborhoods
- islands / density fields
- softly grouped star systems

Players = stars.

Cluster centroids = subtle anchors.

Prototype = ring / special marker.

Hidden Unicorns = brighter / larger / haloed edge points.

Do not overdo “space” styling to the point that it becomes gimmicky.

The product should still feel editorial and sophisticated.

---

# 27. Offensive / Defensive / Two-Way mode concept

Eventually support a top-level mode switch:

`OFFENSE | DEFENSE | TWO-WAY`

### OFFENSE

The canonical 8-cluster galaxy.

### DEFENSE

Once the defensive model is mature, the same league can reorganize into a different behavioral galaxy.

A dramatic transition is desirable: a player may look normal offensively and suddenly become an extreme edge point defensively.

### TWO-WAY

Probably should **not** be another 55-dimensional cluster map.

A stronger visualization is likely:

- X axis = Offensive Hidden Unicorn percentile
- Y axis = Defensive Hidden Unicorn percentile

The top-right becomes the conceptual **Two-Way Hidden Unicorn** region.

This directly communicates whether a player's uniqueness is:

- offense only
- defense only
- both
- neither

---

# 28. Current web app technical direction

The actual project was converted from a quick static prototype to a proper npm application.

Preferred stack:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **D3** where helpful for visualization math/rendering
- deployment on **Vercel**

The user typically works in **Cursor**, with GitHub as source control and Vercel as deployment platform.

Expected workflow:

`Cursor → GitHub → Vercel`

The app should remain easy for an AI coding agent to understand and modify.

Recommended component responsibilities:

```text
app/
  page.tsx
  globals.css

components/
  HiddenUnicornStory.tsx
  Galaxy.tsx
  PlayerDetail.tsx
  ClusterDetail.tsx
  FeatureFingerprint.tsx
  StoryScene.tsx
  PlayerSearch.tsx

lib/
  data.ts
  model-types.ts
  distances.ts
  projections.ts
```

Existing first-draft structure at the time of handoff included:

```text
components/
  HiddenUnicornStory.tsx
  Galaxy.tsx

lib/
  data.ts

app/
  page.tsx
  globals.css
```

Do not feel bound to this exact structure if a clearer component architecture emerges.

---

# 29. Data architecture for the site

The browser should not require direct access to the raw Supabase basketball warehouse.

For v1:

Prefer a static generated artifact containing the curated visualization data.

Possible structure:

```ts
type PlayerModelRow = {
  playerId: string
  playerName: string
  touches: number
  cluster: number
  clusterName: string
  distance: number
  uniquenessPercentile: number
  secondCluster?: number
  ambiguityGap?: number
  projectionX: number
  projectionY: number
  standardizedFeatures?: number[]
  nearestNeighbors?: string[]
}
```

And:

```ts
type Cluster = {
  id: number
  name: string
  description: string
  size: number
  prototypePlayerId: string
  centroid?: number[]
  representativePlayerIds: string[]
}
```

If payload size becomes an issue, separate:

- lightweight map payload
- player-detail payload

The model outputs should be generated in a repeatable pipeline rather than hand-entered over time.

---

# 30. What is currently real vs schematic in the first app draft

The first visual prototype included real model-derived information for named players such as:

- cluster assignments
- touch counts
- uniqueness percentiles
- prototype identities
- known high-sample unicorns

However, the initial background league map / galaxy layout was **schematic**, not yet a true UMAP/PCA projection of all 473 players.

This distinction is critical.

Do not imply that the initial x/y positions are analytical outputs if the app is still using schematic coordinates.

The next important data upgrade is:

1. export all 473 standardized offensive player vectors
2. compute an actual 2D projection
3. export projection coordinates
4. compute true nearest neighbors in 31D
5. render all real player points rather than anonymous filler dots

---

# 31. Recommended next implementation milestones

## Milestone 1 — Real offensive player map

Replace schematic galaxy coordinates with a real 473-player projection.

Requirements:

- all 473 players plotted
- exact cluster membership
- real prototype markers
- Hidden Unicorn percentile encoded visually
- tooltip / selection
- responsive rendering

---

## Milestone 2 — True player explorer

Add:

- player search
- nearest neighbors
- cluster prototype comparison
- feature fingerprint
- sample/touch information

---

## Milestone 3 — Scroll choreography

Make the galaxy transform through scenes rather than swapping disconnected charts.

Use Framer Motion / scroll observers carefully.

Avoid motion for motion's sake.

The visualization should support the argument.

---

## Milestone 4 — Position validation layer

Add listed player positions as annotations only.

Potential interactions:

- color by learned archetype
- toggle color by traditional position
- compare how much the two taxonomies agree / disagree

This could become a strong explanatory scene.

---

## Milestone 5 — Defensive model redesign

Before publishing a defensive leaderboard:

- rebalance feature families
- separate opportunity from behavior
- investigate matchup-role / matchup-diversity features
- sensitivity test steals/rebounds
- inspect scheme influence
- rerun K selection

---

## Milestone 6 — Two-Way quadrant

Once offense + defense are independently trustworthy:

- X = offensive uniqueness percentile
- Y = defensive uniqueness percentile
- inspect min/geometric/harmonic combined definitions
- label top-right players as Two-Way Hidden Unicorn candidates

---

# 32. Model tables created in Supabase

All machine-learning work was isolated under `ml_*` objects so existing production data structures were not changed.

Do not modify existing production play tables as part of app development.

Relevant ML tables include:

### Offensive

- `ml_player_style_features`
- `ml_player_style_model_input`
- `ml_player_style_cluster_runs`
- `ml_player_style_kmeans_centroids_work`
- `ml_player_style_kmeans_assignments_work`

### Defensive

- `ml_player_defensive_style_features`
- `ml_player_defensive_style_model_input`
- `ml_player_defensive_cluster_runs`
- `ml_player_defensive_kmeans_centroids_work`

### Experimental joint two-way

- `ml_player_twoway_model_input`
- `ml_player_twoway_cluster_runs`
- `ml_player_twoway_kmeans_centroids_work`

Helper functions were also created for isolated ML clustering.

**Important:** the joint two-way model is experimental and should not silently become the canonical product methodology.

---

# 33. Existing warehouse semantic resources

The broader NBA project has semantic definitions and query infrastructure that should be treated as authoritative if future feature definitions need verification.

Relevant project files previously identified include:

- `chat/lib/warehouse/marking-definitions.ts`
- `db-enum-truth.ts`
- `schema-registry.ts`
- `query-engine.ts`
- `concept-dictionary.ts`
- concepts documentation
- `sql-primer.ts`
- `RAW-GAP-AUDIT.md`
- `RAW-PROMOTION-PLAN.md`
- `HYBRID-TOOLS-DESIGN.md`

The marking definitions are based on Genius Sports Basketball Insight / Fitness Definitions v1.8 (Oct. 2025).

Some relevant semantics:

- `direct` roughly means the action directly leads to a shot/change of possession by involved players, or a pass to a teammate who shoots/turns it over within one dribble.
- drives begin from >=16 feet and get within 13 feet.
- `scr_def_type = soft` corresponds to traditional NBA “drop” coverage.

Do not invent enum meaning when these semantic resources can be consulted.

---

# 34. Research / novelty context

The broad idea of data-driven basketball archetypes and statistical player uniqueness is not unprecedented.

Relevant conceptual predecessors identified during research included:

- work redefining basketball positions through unsupervised methods
- statistical “unicorn index” approaches comparing players with average position profiles
- academic clustering of player types
- probabilistic / soft player-role assignments
- longitudinal archetype models

The distinctive combination in Hidden Unicorn is:

> **Detailed action/event-level behavioral data + intentionally removing quality/efficiency + unsupervised natural archetypes + measuring uniqueness as distance from the nearest learned archetype.**

Do not market the project as though nobody has ever clustered basketball players before.

A more defensible claim is:

> We are applying a richer behavioral event vocabulary and using the learned archetypes themselves as the baseline for defining player uniqueness.

---

# 35. Editorial language to preserve

Useful phrases / concepts:

### Traditional unicorn

> Who can do something their body says they shouldn't be able to do?

### Hidden Unicorn

> Who is playing basketball in a way our existing categories say players don't play?

### Offensive Hidden Unicorn

> There isn't a normal offensive archetype that adequately describes you.

### Defensive Hidden Unicorn

> There isn't a normal defensive archetype that adequately describes you.

### Two-Way Hidden Unicorn

> Neither side of your basketball identity fits comfortably into the league's normal archetypes.

### Prototype

> The cleanest real-world example of the archetype — not the best player in it.

### Jokic framing

> The model knows his species. It just doesn't find many members of it.

### Core idea

> We let the game invent its own categories. Some players still didn't fit.

---

# 36. Things future coding agents should NOT do

1. **Do not turn the experience into a generic analytics dashboard.**
   The primary product is an editorial scrollytelling story plus an exploratory player map.

2. **Do not rank Hidden Unicorns as “best” players.**
   The score measures unusual behavior.

3. **Do not use 2D map distance for model conclusions.**
   Use original feature-space distances.

4. **Do not silently replace the canonical 8-cluster offense model with another K.**
   K=6 and K=10 are useful sensitivity runs, but K=8 is the current editorial model.

5. **Do not treat prototype players as stars / best representatives in a quality sense.**
   Prototype = nearest centroid.

6. **Do not present the defense-only results as equally mature as offense.**
   The defensive feature construction still needs validation.

7. **Do not make the experimental 55D joint O+D clustering the canonical Two-Way score.**

8. **Do not feed conventional player position into the canonical clustering model without an explicit modeling decision.**

9. **Do not connect the public browser directly to raw warehouse tables.**

10. **Do not alter production NBA warehouse tables for visualization convenience.**

---

# 37. Questions that remain open

These are legitimate areas for iteration rather than settled requirements.

### Visualization

- UMAP vs PCA as primary 2D projection
- density contours vs constellation-only display
- exact encoding of uniqueness (size / ring / brightness / halo)
- whether cluster centroids should be visible
- whether anonymous low-sample players should initially be labeled

### Editorial

- final names for some archetypes
- whether Batum is the best opening Hidden Unicorn example or whether DeRozan/Draymond/Jokic tells the story better
- how much methodology to expose before the reveal

### Modeling

- position-relative control scores
- fuzzy membership / GMM
- HDBSCAN outlier sensitivity
- rolling 15–25 game archetype trajectories
- strict vs inclusive defensive style features
- final Two-Way score function

### Product

- shareable player URLs
- player comparison mode
- social cards
- season selector
- historical models

---

# 38. Suggested coding-agent startup prompt

When using Cursor, Codex, or another coding agent, a good first instruction is:

> Read `PROJECT_CONTEXT.md` and `README.md` completely before making changes. Treat `PROJECT_CONTEXT.md` as the canonical source of truth for the product thesis, current modeling methodology, archetype definitions, and what is considered experimental. Inspect the existing codebase afterward. Do not change the analytical definitions simply to make the UI easier to implement. If code and this document conflict, point out the conflict before changing model semantics.

For visualization work, add:

> Preserve the distinction between display-space geometry and true 31-dimensional model geometry. UI positions may come from UMAP/PCA, but nearest neighbors, centroid distance, and Hidden Unicorn scores must use the original standardized model outputs.

---

# 39. Product north star

If a basketball fan finishes the experience, they should understand three things without needing to know machine learning:

1. **The five traditional positions are not the only way to describe how basketball players behave.**
2. **The data can discover recognizable player types on its own.**
3. **The most interesting players may be the ones who remain difficult to categorize even after the game creates its own categories.**

The ideal reaction is not:

> “That was a cool clustering dashboard.”

It is:

> **“I never thought of that player that way before.”**

