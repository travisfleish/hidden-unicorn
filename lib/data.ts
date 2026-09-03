import { scaleLinear } from 'd3'
import { offensiveArchetypeDistances } from './offensiveArchetypeDistances'

export type Cluster = { id: number; name: string; count: number; prototype: string; description: string }
export type Player = {
  name: string
  cluster: number
  touches: number
  /**
   * Global uniqueness percentile of distanceToCentroid among eligible (≥1,000-touch) players.
   * Higher = farther from the nearest archetype. Alias of rawPercentile.
   */
  pct: number
  /** Global uniqueness percentile among eligible players (higher = more unusual). */
  rawPercentile: number
  /** Within-archetype uniqueness percentile among eligible cluster members (higher = more unusual). */
  clusterPercentile: number
  /** Official ranking score: 0.7 * rawPercentile + 0.3 * clusterPercentile. */
  hiddenUnicornScore: number
  /** Euclidean distance to assigned archetype centroid in standardized 31D feature space. */
  distanceToCentroid: number
  prototype?: boolean
  note?: string
}

/** Minimum touches for official Hidden Unicorn rankings and highlights. */
export const HIDDEN_UNICORN_MIN_TOUCHES = 1000

/** Minimum touches for archetype Top 10 lists (closest-to-centroid). */
export const ARCHETYPE_TOP_MIN_TOUCHES = 2000

/**
 * Sample-confidence opacity from touch count.
 * Radial position stays driven only by distanceToCentroid — opacity is confidence, not unusualness.
 */
export const sampleOpacityScale = scaleLinear()
  .domain([250, 500, HIDDEN_UNICORN_MIN_TOUCHES])
  .range([0.25, 0.55, 1])
  .clamp(true)

export function sampleOpacity(touches: number) {
  return sampleOpacityScale(touches)
}

export function isHiddenUnicornEligible(p: Pick<Player, 'touches'>) {
  return p.touches >= HIDDEN_UNICORN_MIN_TOUCHES
}

/** Rank-based percentile: index 0 → 0, last → 100. Higher index = more unusual. */
function rankPercentile(index: number, n: number) {
  return n <= 1 ? 0 : (index / (n - 1)) * 100
}

/**
 * Place a distance into an eligible-only sorted ascending list.
 * Used so sub-threshold players still get display percentiles without entering the official ranking pool.
 */
function percentileAgainstSorted(sortedAsc: number[], value: number) {
  const n = sortedAsc.length
  if (n === 0) return 0
  if (n === 1) return value >= sortedAsc[0] ? 100 : 0
  let rank = -1
  for (let i = 0; i < n; i++) {
    if (sortedAsc[i] <= value) rank = i
  }
  if (rank < 0) return 0
  return rankPercentile(rank, n)
}

export const clusters: Cluster[] = [
  { id: 1, name: 'Hybrid Interior Hubs', count: 35, prototype: 'Victor Wembanyama', description: 'Interior creators who mix post play, screening, isolation and passing gravity.' },
  { id: 2, name: 'Low-Dribble Connective Frontcourt', count: 101, prototype: 'Jamir Watkins', description: 'Quick-decision frontcourt connectors: catch, move it, screen, space and keep the possession flowing.' },
  { id: 3, name: 'Movement / Off-Ball Scorers', count: 74, prototype: 'Max Christie', description: 'Scorers who create value by moving, cutting, receiving handoffs and attacking off the catch.' },
  { id: 4, name: 'Connective Slashers', count: 60, prototype: 'DeJon Jarreau', description: 'Advantage routers who pressure the rim, kick out and reverse the ball without dominating shots.' },
  { id: 5, name: 'Rim-Running Screen Bigs', count: 70, prototype: 'Marvin Bagley III', description: 'Screen, roll, finish, rebound. The cleanest and most traditional offensive archetype.' },
  { id: 6, name: 'Primary Shot Creators', count: 39, prototype: 'CJ McCollum', description: 'High-burden creators who bend defenses through isolation, pick-and-roll and self-created shots.' },
  { id: 7, name: 'Perimeter Organizers', count: 42, prototype: 'Bones Hyland', description: 'High-dribble, high-pass perimeter decision makers who organize possessions more than they consume them.' },
  { id: 8, name: 'Drive-First Lead Creators', count: 52, prototype: 'Ryan Rollins', description: 'Initiators whose identity is built around penetration, ball pressure and drive-created offense.' }
]

/** Normalize curly/smart quotes so curated names match the model export. */
function normalizeName(name: string) {
  return name.replace(/[\u2018\u2019\u02BC]/g, "'")
}

type FeaturedMeta = { prototype?: boolean; note?: string }

const featuredByName: Record<string, FeaturedMeta> = {
  'Victor Wembanyama': { prototype: true },
  'Nikola Jokic': {
    note: 'Post activity, attacking passes, skip passes and handoff-setting all pull him away from even the closest archetype.',
  },
  'Giannis Antetokounmpo': {
    note: 'An interior hub with extreme post, double-team and drive behavior.',
  },
  'Zion Williamson': {
    note: 'The model finds no normal combination of interior scoring, driving and isolation that quite matches Zion.',
  },
  'Jamir Watkins': { prototype: true },
  'Nicolas Batum': {
    note: 'The highest-confidence offensive outlier: connective frontcourt behavior with an unusual drive-and-kick profile and very low shot consumption.',
  },
  'Nikola Vucevic': {
    note: 'Post involvement and passing behavior make him a poor fit for an otherwise low-dribble connective group.',
  },
  'Draymond Green': {
    note: 'Attacking-pass frequency is extreme while shot consumption is unusually low — essentially a one-of-one offensive job description.',
  },
  'Max Christie': { prototype: true },
  'Klay Thompson': {
    note: 'Clearly a movement scorer, but an unusually extreme one: direct touches, off-ball movement and shot consumption all sit far from the prototype.',
  },
  'DeJon Jarreau': { prototype: true },
  'Marvin Bagley III': { prototype: true },
  'CJ McCollum': { prototype: true },
  'DeMar DeRozan': {
    note: 'A primary creator whose post play, isolation, cutting and passing mix looks nothing like the modern prototype.',
  },
  'Stephen Curry': {
    note: 'Even inside a shot-creator cluster, Curry’s movement and shooting behavior remain unusually hard to represent.',
  },
  'Bones Hyland': { prototype: true },
  'Ryan Rollins': { prototype: true },
}

/**
 * Official percentiles are computed on eligible players only (≥1,000 touches).
 * rawPercentile = global unusualness of distanceToCentroid
 * clusterPercentile = unusualness within the assigned archetype
 * hiddenUnicornScore = 0.7 * raw + 0.3 * cluster  (headline ranking)
 * Radial layout still uses raw distanceToCentroid — never the hybrid score.
 */
const eligibleRows = offensiveArchetypeDistances.filter(
  (d) => d.touches >= HIDDEN_UNICORN_MIN_TOUCHES,
)
const eligibleByDistanceAsc = [...eligibleRows].sort(
  (a, b) => a.distanceToCentroid - b.distanceToCentroid,
)
const eligibleDistAsc = eligibleByDistanceAsc.map((d) => d.distanceToCentroid)
const rawPercentileByName = new Map(
  eligibleByDistanceAsc.map((d, i) => [d.playerName, rankPercentile(i, eligibleByDistanceAsc.length)]),
)

const eligibleByCluster = new Map<number, typeof eligibleRows>()
for (const d of eligibleRows) {
  const list = eligibleByCluster.get(d.cluster) ?? []
  list.push(d)
  eligibleByCluster.set(d.cluster, list)
}

const clusterPercentileByName = new Map<string, number>()
const eligibleDistAscByCluster = new Map<number, number[]>()
for (const [clusterId, members] of eligibleByCluster) {
  const sorted = [...members].sort((a, b) => a.distanceToCentroid - b.distanceToCentroid)
  eligibleDistAscByCluster.set(
    clusterId,
    sorted.map((d) => d.distanceToCentroid),
  )
  sorted.forEach((d, i) => {
    clusterPercentileByName.set(d.playerName, rankPercentile(i, sorted.length))
  })
}

const prototypeNames = new Set(clusters.map((c) => c.prototype))

export const players: Player[] = offensiveArchetypeDistances.map((d) => {
  const meta = featuredByName[normalizeName(d.playerName)] ?? featuredByName[d.playerName]
  const eligible = d.touches >= HIDDEN_UNICORN_MIN_TOUCHES
  const rawPercentile = eligible
    ? (rawPercentileByName.get(d.playerName) ?? 0)
    : percentileAgainstSorted(eligibleDistAsc, d.distanceToCentroid)
  const clusterPercentile = eligible
    ? (clusterPercentileByName.get(d.playerName) ?? 0)
    : percentileAgainstSorted(
        eligibleDistAscByCluster.get(d.cluster) ?? [],
        d.distanceToCentroid,
      )
  const hiddenUnicornScore = 0.7 * rawPercentile + 0.3 * clusterPercentile
  return {
    name: d.playerName,
    cluster: d.cluster,
    touches: d.touches,
    pct: rawPercentile,
    rawPercentile,
    clusterPercentile,
    hiddenUnicornScore,
    distanceToCentroid: d.distanceToCentroid,
    prototype: meta?.prototype || prototypeNames.has(d.playerName) || undefined,
    note: meta?.note,
  }
})

/** Official Hidden Unicorn Top 10: hybrid score among eligible samples (no cluster quotas). */
export const officialHiddenUnicorns = [...players]
  .filter((p) => p.touches >= HIDDEN_UNICORN_MIN_TOUCHES)
  .sort((a, b) => b.hiddenUnicornScore - a.hiddenUnicornScore)
  .slice(0, 10)

/** Closest-to-centroid Top 10 within an archetype among players with ≥2,000 touches. */
export function topInArchetype(clusterId: number, list: Player[] = players) {
  return [...list]
    .filter((p) => p.cluster === clusterId && p.touches >= ARCHETYPE_TOP_MIN_TOUCHES)
    .sort((a, b) => a.distanceToCentroid - b.distanceToCentroid)
    .slice(0, 10)
}

export const featureNames = [
  'Touch time',
  'Dribbles / touch',
  'Direct touch',
  'Catch & shoot touch',
  'Potential C&S',
  'Double-team touch',
  'Passes / touch',
  'Kickout pass',
  'Skip pass',
  'Attacking pass',
  'Reversal pass',
  'Drives / touch',
  'Drive kickout',
  'Drive rim',
  'Drive pull-up',
  'Drive blow-by',
  'Isolation / touch',
  'Post / touch',
  'PnR ballhandler',
  'PnR screener',
  'Roll rate',
  'Pop rate',
  'Handoff receiver',
  'Handoff setter',
  'Off-ball cutter',
  'Off-ball screener',
  'Shots / touch',
  '3PA share',
  'Rim shot share',
  'C&S shot share',
  'Pull-up shot share',
]
