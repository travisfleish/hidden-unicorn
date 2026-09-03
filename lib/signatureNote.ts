import type { SignatureTrait } from './uniqueStats'

/** Short basketball phrases for composing signature-trait blurbs. */
const traitPhrase: Record<string, { high: string; low: string }> = {
  avg_touch_time: { high: 'long touch times', low: 'very short touches' },
  avg_dribbles_per_touch: { high: 'high dribble usage', low: 'almost no dribbling' },
  direct_touch_rate: { high: 'direct-touch creation', low: 'very few direct touches' },
  catch_shoot_touch_rate: { high: 'catch-and-shoot touches', low: 'rare catch-and-shoot touches' },
  potential_catch_shoot_rate: { high: 'potential catch-and-shoot volume', low: 'almost no catch-and-shoot looks' },
  double_team_touch_rate: { high: 'double-team gravity', low: 'almost no double-team pressure' },
  passes_per_touch: { high: 'pass-heavy touches', low: 'very low pass rates' },
  kickout_pass_rate: { high: 'kickout passing', low: 'almost no kickout passes' },
  skip_pass_rate: { high: 'skip-pass volume', low: 'rare skip passes' },
  attacking_pass_rate: { high: 'attacking-pass frequency', low: 'few attacking passes' },
  reversal_pass_rate: { high: 'reversal-pass volume', low: 'almost no reversal passes' },
  drives_per_touch: { high: 'drive volume', low: 'almost no drives' },
  drive_kickout_rate: { high: 'drive-and-kick creation', low: 'rare drive kickouts' },
  drive_rim_rate: { high: 'rim pressure on drives', low: 'drives that seldom reach the rim' },
  drive_pullup_rate: { high: 'drive pull-ups', low: 'almost no drive pull-ups' },
  drive_blownby_rate: { high: 'blow-by driving', low: 'rare blow-bys' },
  iso_per_touch: { high: 'isolation usage', low: 'almost no isolation' },
  post_per_touch: { high: 'post involvement', low: 'almost no post work' },
  pnr_ballhandler_per_touch: { high: 'PnR ballhandling', low: 'rare PnR ballhandling' },
  pnr_screener_per_touch: { high: 'PnR screening', low: 'almost no PnR screening' },
  pnr_roll_rate: { high: 'roll frequency', low: 'rare rolls' },
  pnr_pop_rate: { high: 'pop frequency', low: 'almost no pops' },
  handoff_receiver_per_touch: { high: 'handoff receiving', low: 'rare handoff receiving' },
  handoff_setter_per_touch: { high: 'handoff setting', low: 'almost no handoff setting' },
  offball_cutter_per_touch: { high: 'off-ball cutting', low: 'rare cutting' },
  offball_screener_per_touch: { high: 'off-ball screening', low: 'almost no off-ball screens' },
  shots_per_touch: { high: 'shot consumption', low: 'very low shot consumption' },
  three_rate: { high: 'three-point shot share', low: 'almost no threes' },
  rim_shot_rate: { high: 'rim-shot share', low: 'few rim attempts' },
  catch_shoot_shot_rate: { high: 'catch-and-shoot shot share', low: 'rare catch-and-shoot shots' },
  pullup_shot_rate: { high: 'pull-up shot share', low: 'almost no pull-ups' },
}

const archetypeShort: Record<number, string> = {
  1: 'interior hub',
  2: 'connective frontcourt',
  3: 'movement scorer',
  4: 'connective slasher',
  5: 'rim-running screen big',
  6: 'primary shot creator',
  7: 'perimeter organizer',
  8: 'drive-first creator',
}

function phraseFor(trait: SignatureTrait) {
  const entry = traitPhrase[trait.key]
  if (!entry) {
    const fallback = trait.label.replace(/ Rate$/i, '').toLowerCase()
    return trait.direction === 'high' ? `extreme ${fallback}` : `unusually low ${fallback}`
  }
  return trait.direction === 'high' ? entry.high : entry.low
}

function listJoin(items: string[]) {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function withArticle(role: string) {
  return /^[aeiou]/i.test(role) ? `an ${role}` : `a ${role}`
}

/**
 * Build a one-line scouting blurb from signature traits.
 * Prefers the top high/low extremes so the sentence matches what the card shows.
 */
export function buildSignatureNote(
  traits: SignatureTrait[] | undefined,
  clusterId: number,
  opts?: { prototype?: boolean; rawPercentile?: number },
): string | undefined {
  if (!traits?.length) return undefined

  const ranked = [...traits].sort((a, b) => a.rank - b.rank)
  const highs = ranked.filter((t) => t.direction === 'high').slice(0, 3)
  const lows = ranked.filter((t) => t.direction === 'low').slice(0, 3)
  const highPhrases = highs.map(phraseFor)
  const lowPhrases = lows.map(phraseFor)
  const role = archetypeShort[clusterId] ?? 'offensive profile'
  const roleRef = withArticle(role)

  if (opts?.prototype) {
    const accent = highPhrases[0] ?? lowPhrases[0]
    return accent
      ? `Closest player to this archetype’s center — the model’s cleanest ${role}, still marked by ${accent}.`
      : `Closest player to this archetype’s center — the model’s cleanest example of the role.`
  }

  if (highPhrases.length && lowPhrases.length) {
    return `${roleRef[0].toUpperCase()}${roleRef.slice(1)} with unusual ${listJoin(highPhrases)}, but ${listJoin(lowPhrases)}.`
  }
  if (highPhrases.length) {
    return `${roleRef[0].toUpperCase()}${roleRef.slice(1)} pulled away from the prototype by extreme ${listJoin(highPhrases)}.`
  }
  if (lowPhrases.length) {
    return `${roleRef[0].toUpperCase()}${roleRef.slice(1)} whose profile stands out for ${listJoin(lowPhrases)}.`
  }

  if (opts?.rawPercentile != null) {
    return `More stylistically unusual than ${opts.rawPercentile.toFixed(0)}% of eligible players.`
  }
  return undefined
}
