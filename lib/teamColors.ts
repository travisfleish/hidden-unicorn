// NBA brand palettes for Roster DNA chart fills — multiple colors per team so the
// fingerprint reads as a team gradient, not a single wash.
// Archetype colors stay on labels/table; these only personalize the shape.

const PAPER = '#E8E4DC'
const SILVER = '#C4CED4'

/** Brand colors in display order (primary first). Near-black entries are filtered for chart use. */
export const teamColors: Record<string, string[]> = {
  ATL: ['#E03A3E', '#C1D32F', '#26282A'],
  BOS: ['#007A33', '#BA9653', '#FFFFFF'],
  BKN: ['#FFFFFF', '#9CA3AF', '#D4D4D8'],
  CHA: ['#00788C', '#1D1160', '#A1A1A4'],
  CHI: ['#CE1141', '#000000'],
  CLE: ['#860038', '#FDBB30', '#041E42'],
  DAL: ['#00538C', '#002B5E', '#B8C4CA'],
  DEN: ['#0E2240', '#FEC524', '#8B2131'],
  DET: ['#C8102E', '#1D42BA', '#BEC0C2'],
  GSW: ['#1D428A', '#FFC72C', '#26282A'],
  HOU: ['#CE1141', '#000000', '#8A8D8F'],
  IND: ['#002D62', '#FDBB30', '#BEC0C2'],
  LAC: ['#C8102E', '#1D428A', '#BEC0C2'],
  LAL: ['#552583', '#FDB927', '#000000'],
  MEM: ['#5D76A9', '#12173F', '#F5B112'],
  MIA: ['#98002E', '#F9A01B', '#000000'],
  MIL: ['#00471B', '#EEE1C6', '#0077C0'],
  MIN: ['#0C2340', '#236192', '#78BE20'],
  NOP: ['#0C2340', '#C8102E', '#C4CED4'],
  NYK: ['#006BB6', '#F58426', '#BEC0C2'],
  OKC: ['#007AC1', '#EF3B24', '#002D62'],
  ORL: ['#0077C0', '#C4CED4', '#000000'],
  PHI: ['#006BB6', '#ED174C', '#002B5C'],
  PHX: ['#E56020', '#1D1160', '#63727A'],
  POR: ['#E03A3E', '#000000'],
  SAC: ['#5A2D81', '#63727A', '#000000'],
  SAS: ['#C4CED4', '#8A8D8F', '#000000'],
  TOR: ['#CE1141', '#A1A1A4', '#000000'],
  UTA: ['#002B5C', '#00471B', '#F9A01B'],
  WAS: ['#002B5C', '#E31837', '#C4CED4'],
}

function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16)
  if (Number.isNaN(n)) return 0
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

/**
 * Chart-safe multi-color palette for a team.
 * Drops near-black swatches (invisible on the night UI) and guarantees ≥2 colors.
 */
export function chartPalette(abbrev: string): string[] {
  const raw = teamColors[abbrev] ?? [SILVER, PAPER]
  const usable = raw.filter((c) => luminance(c) >= 0.14)
  if (usable.length >= 2) return usable
  if (usable.length === 1) return [usable[0], PAPER]
  return [SILVER, PAPER]
}

/** Color at spoke `i` of 8 — cycles the full team palette around the fingerprint. */
export function spokeColor(palette: string[], i: number): string {
  return palette[((i % palette.length) + palette.length) % palette.length]
}
