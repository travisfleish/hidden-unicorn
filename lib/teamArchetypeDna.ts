// 2025-26 regular season · games-weighted team archetype composition.
//
// This is an isolated visualization artifact. It does NOT touch the clustering model,
// player assignments, archetype definitions, Hidden Unicorn scores, or any production table.
//
// Source (Supabase warehouse, project nba-storylines-chat):
//   - canonical assignment: ml_player_style_kmeans_assignments_work (season_year=2025, k=8, restart=2)
//     — its cluster numbers 1..8 already match `clusters` in lib/data.ts (same prototypes / counts).
//   - team membership + weight: player_season_teams (season_year=2025) → games_played
//   - team names / abbreviations: teams
//
//   with assign as (
//     select a.player_id, a.cluster
//     from ml_player_style_kmeans_assignments_work a
//     where a.season_year = 2025 and a.k = 8 and a.restart = 2          -- 473 clustered players
//   ),
//   pst as (
//     select player_id, team_id, games_played
//     from player_season_teams
//     where season_year = 2025                                          -- trades => one row per team
//   ),
//   team_cluster as (
//     select t.abbrev, t.name, x.cluster, sum(pst.games_played) as gp
//     from assign x
//     join pst on pst.player_id = x.player_id
//     join teams t on t.id = pst.team_id
//     group by t.abbrev, t.name, x.cluster
//   )
//   -- archetypeShare = sum(games_played in archetype) / sum(games_played across all clustered players on team)
//
// Games-weighted on purpose: a player with 70 games shapes a team's fingerprint far more
// than a 3-game rental. 30 teams; 1 clustered player had no 2025 team row and is excluded.
// `shares` are percentages in cluster order 1..8 and sum to ~100 (rounding only).

import { clusters } from './data'

export type TeamArchetypeDna = {
  abbrev: string
  name: string
  /** Games-weighted percentage per archetype, index 0 = cluster 1 … index 7 = cluster 8. Sums ~100. */
  shares: number[]
  /** Total games-played summed across the team's clustered players (the share denominator). */
  gamesTotal: number
  /** Cluster id (1-8) with the largest games-weighted share. */
  dominantCluster: number
  /** Auto-generated, descriptive-only sentence. No quality claims. */
  observation: string
}

type RawTeam = { abbrev: string; name: string; gamesTotal: number; shares: number[] }

// Ordered by team name.
const RAW: RawTeam[] = [
  { abbrev: 'ATL', name: 'Atlanta Hawks', gamesTotal: 647, shares: [3.6, 25.2, 35.9, 9.4, 3.1, 5.6, 8.5, 8.8] },
  { abbrev: 'BOS', name: 'Boston Celtics', gamesTotal: 670, shares: [0, 24.5, 20.9, 0, 19.7, 8.7, 26.3, 0] },
  { abbrev: 'BKN', name: 'Brooklyn Nets', gamesTotal: 674, shares: [0, 3.6, 36.8, 7, 17.4, 3.9, 13.5, 18] },
  { abbrev: 'CHA', name: 'Charlotte Hornets', gamesTotal: 695, shares: [8.8, 23, 16.3, 9.4, 18.8, 0.6, 2.4, 20.7] },
  { abbrev: 'CHI', name: 'Chicago Bulls', gamesTotal: 694, shares: [0, 30, 7.1, 30, 6.8, 4.2, 4.8, 17.3] },
  { abbrev: 'CLE', name: 'Cleveland Cavaliers', gamesTotal: 702, shares: [7.3, 36.9, 12.3, 0, 7.8, 13.2, 5.8, 16.7] },
  { abbrev: 'DAL', name: 'Dallas Mavericks', gamesTotal: 679, shares: [10, 1, 22.5, 16.8, 19.9, 10.5, 1.2, 18.1] },
  { abbrev: 'DEN', name: 'Denver Nuggets', gamesTotal: 636, shares: [11.3, 16, 22.5, 18.2, 15.4, 9.1, 7.4, 0] },
  { abbrev: 'DET', name: 'Detroit Pistons', gamesTotal: 687, shares: [6.8, 18, 18.2, 8.7, 22.3, 8.3, 3.1, 14.6] },
  { abbrev: 'GSW', name: 'Golden State Warriors', gamesTotal: 751, shares: [8.8, 36.8, 14.4, 12.6, 5.5, 5.6, 9.7, 6.7] },
  { abbrev: 'HOU', name: 'Houston Rockets', gamesTotal: 627, shares: [14.5, 20.6, 9.6, 9.7, 14.5, 9.4, 21.7, 0] },
  { abbrev: 'IND', name: 'Indiana Pacers', gamesTotal: 740, shares: [7.6, 30.5, 12.3, 10.4, 11.2, 4.3, 9.6, 14.1] },
  { abbrev: 'LAC', name: 'LA Clippers', gamesTotal: 700, shares: [0, 29.9, 0.1, 27.4, 13.7, 15.4, 13.4, 0] },
  { abbrev: 'LAL', name: 'Los Angeles Lakers', gamesTotal: 659, shares: [6.8, 27.5, 8.8, 0, 22.2, 7.6, 21.7, 5.5] },
  { abbrev: 'MEM', name: 'Memphis Grizzlies', gamesTotal: 678, shares: [6.8, 7.8, 9.3, 30.2, 11.8, 4.7, 22.1, 7.2] },
  { abbrev: 'MIA', name: 'Miami Heat', gamesTotal: 699, shares: [17.3, 9, 9.2, 54.5, 0, 10, 0, 0] },
  { abbrev: 'MIL', name: 'Milwaukee Bucks', gamesTotal: 713, shares: [4.8, 28.1, 23.3, 13.5, 7.2, 1.5, 0, 21.7] },
  { abbrev: 'MIN', name: 'Minnesota Timberwolves', gamesTotal: 693, shares: [9.4, 20.9, 9.4, 14.6, 13.9, 7.9, 18.2, 5.8] },
  { abbrev: 'NOP', name: 'New Orleans Pelicans', gamesTotal: 655, shares: [25, 20, 22.3, 0, 10.5, 0.6, 6.4, 15.1] },
  { abbrev: 'NYK', name: 'New York Knicks', gamesTotal: 694, shares: [8.6, 15.1, 29.8, 9.9, 13.4, 8.5, 6.8, 7.8] },
  { abbrev: 'OKC', name: 'Oklahoma City Thunder', gamesTotal: 717, shares: [7.9, 26.5, 9.6, 28, 5.4, 17.4, 0, 5] },
  { abbrev: 'ORL', name: 'Orlando Magic', gamesTotal: 690, shares: [11.7, 8.3, 9.6, 6.5, 25.8, 8.8, 13.8, 15.5] },
  { abbrev: 'PHI', name: 'Philadelphia 76ers', gamesTotal: 633, shares: [5.4, 14.8, 27, 6.8, 24.8, 0, 11.1, 10.1] },
  { abbrev: 'PHX', name: 'Phoenix Suns', gamesTotal: 649, shares: [0, 36.4, 6.9, 0, 26.2, 16.5, 9.1, 4.9] },
  { abbrev: 'POR', name: 'Portland Trail Blazers', gamesTotal: 702, shares: [7.3, 24.4, 8.8, 13.7, 20.8, 14.8, 0, 10.3] },
  { abbrev: 'SAC', name: 'Sacramento Kings', gamesTotal: 676, shares: [8.1, 9.6, 12.3, 9.3, 23.1, 17.5, 0.7, 19.4] },
  { abbrev: 'SAS', name: 'San Antonio Spurs', gamesTotal: 703, shares: [16.9, 31, 12.5, 4.7, 8, 7.4, 4.4, 15.1] },
  { abbrev: 'TOR', name: 'Toronto Raptors', gamesTotal: 670, shares: [14.5, 26.3, 15.8, 0, 16.3, 9, 8.8, 9.4] },
  { abbrev: 'UTA', name: 'Utah Jazz', gamesTotal: 676, shares: [0.4, 11.4, 31.7, 24, 8.7, 0, 0.7, 23.1] },
  { abbrev: 'WAS', name: 'Washington Wizards', gamesTotal: 702, shares: [3, 18.7, 18.9, 9.5, 17.1, 13.5, 8.8, 10.4] },
]

/**
 * League-average archetype distribution — the same games-weighted formula applied to the
 * whole league as one pool: sum(games in archetype, all teams) / sum(all games).
 * Index 0 = cluster 1 … index 7 = cluster 8.
 */
export const leagueAverageArchetype: number[] = [7.7, 21.2, 16.4, 13.0, 14.3, 8.2, 8.6, 10.8]

const archetypeName = (cluster: number) => clusters[cluster - 1]?.name ?? `Archetype ${cluster}`

/**
 * Descriptive, auto-generated one-liner. Never a claim about roster quality —
 * only where a team sits relative to the league.
 */
export function buildTeamObservation(name: string, shares: number[]): string {
  let over = 0
  let overIdx = 0
  let under = 0
  let underIdx = 0
  for (let i = 0; i < shares.length; i++) {
    const diff = shares[i] - (leagueAverageArchetype[i] ?? 0)
    if (diff > over) {
      over = diff
      overIdx = i
    }
    if (diff < under) {
      under = diff
      underIdx = i
    }
  }
  const verb =
    over >= 12
      ? 'heavily over-indexes on'
      : over >= 6
        ? 'over-indexes on'
        : over >= 2
          ? 'leans toward'
          : 'tracks the league, tilting slightly to'
  let sentence = `${name} ${verb} ${archetypeName(overIdx + 1)}`
  if (under <= -8) sentence += `, with little ${archetypeName(underIdx + 1)} presence`
  return `${sentence}.`
}

function dominantOf(shares: number[]): number {
  let best = 0
  for (let i = 1; i < shares.length; i++) if (shares[i] > shares[best]) best = i
  return best + 1
}

export const teamArchetypeDna: TeamArchetypeDna[] = RAW.map((t) => ({
  abbrev: t.abbrev,
  name: t.name,
  shares: t.shares,
  gamesTotal: t.gamesTotal,
  dominantCluster: dominantOf(t.shares),
  observation: buildTeamObservation(t.name, t.shares),
}))

/** Team shown when the section first loads. */
export const FEATURED_TEAM_ABBREV = 'MIA'
