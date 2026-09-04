// NBA brand palettes for Roster DNA chart fills — exactly three colors per team.
// Dark brand colors are kept as-is (not lightened). Archetype colors stay on labels/table.

/** Three brand colors in display order: primary, secondary, tertiary. */
export const teamColors: Record<string, [string, string, string]> = {
  ATL: ['#E03A3E', '#C1D32F', '#26282A'],
  BOS: ['#007A33', '#BA9653', '#FFFFFF'],
  BKN: ['#000000', '#FFFFFF', '#9CA3AF'],
  CHA: ['#1D1160', '#00788C', '#A1A1A4'],
  CHI: ['#CE1141', '#000000', '#FFFFFF'],
  CLE: ['#860038', '#FDBB30', '#041E42'],
  DAL: ['#00538C', '#002B5E', '#B8C4CA'],
  DEN: ['#0E2240', '#FEC524', '#8B2131'],
  DET: ['#C8102E', '#1D42BA', '#BEC0C2'],
  GSW: ['#1D428A', '#FFC72C', '#26282A'],
  HOU: ['#CE1141', '#000000', '#FFFFFF'],
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
  POR: ['#E03A3E', '#000000', '#FFFFFF'],
  SAC: ['#5A2D81', '#63727A', '#000000'],
  SAS: ['#C4CED4', '#000000', '#8A8D8F'],
  TOR: ['#CE1141', '#000000', '#FFFFFF'],
  UTA: ['#002B5C', '#00471B', '#F9A01B'],
  WAS: ['#002B5C', '#E31837', '#C4CED4'],
}

const FALLBACK: [string, string, string] = ['#C4CED4', '#8A8D8F', '#E8E4DC']

function isNearBlack(hex: string): boolean {
  const n = parseInt(hex.replace('#', ''), 16)
  if (Number.isNaN(n)) return false
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return r + g + b < 40
}

/** Exact three-color team palette — dark colors included unchanged. */
export function chartPalette(abbrev: string): [string, string, string] {
  return teamColors[abbrev] ?? FALLBACK
}

/** Outline color — first non-black swatch in the palette (never black on the night UI). */
export function outlineColor(palette: readonly string[]): string {
  return palette.find((c) => !isNearBlack(c)) ?? '#E8E4DC'
}

/** Color at spoke `i` of 8 — cycles the three team colors around the fingerprint. */
export function spokeColor(palette: readonly string[], i: number): string {
  return palette[((i % palette.length) + palette.length) % palette.length]
}
