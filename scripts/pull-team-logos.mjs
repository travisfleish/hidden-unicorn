// Vendors the 30 NBA primary team logos into public/logos/<abbrev>.svg
// Source: https://cdn.nba.com/logos/nba/<teamId>/primary/L/logo.svg
// Run: node scripts/pull-team-logos.mjs

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TEAMS = [
  ['ATL', 1610612737], ['BKN', 1610612751], ['BOS', 1610612738], ['CHA', 1610612766],
  ['CHI', 1610612741], ['CLE', 1610612739], ['DAL', 1610612742], ['DEN', 1610612743],
  ['DET', 1610612765], ['GSW', 1610612744], ['HOU', 1610612745], ['IND', 1610612754],
  ['LAC', 1610612746], ['LAL', 1610612747], ['MEM', 1610612763], ['MIA', 1610612748],
  ['MIL', 1610612749], ['MIN', 1610612750], ['NOP', 1610612740], ['NYK', 1610612752],
  ['OKC', 1610612760], ['ORL', 1610612753], ['PHI', 1610612755], ['PHX', 1610612756],
  ['POR', 1610612757], ['SAC', 1610612758], ['SAS', 1610612759], ['TOR', 1610612761],
  ['UTA', 1610612762], ['WAS', 1610612764],
]

const OUT = join(process.cwd(), 'public', 'logos')
await mkdir(OUT, { recursive: true })

const variants = ['primary', 'global']

let ok = 0
for (const [abbrev, id] of TEAMS) {
  let saved = false
  for (const v of variants) {
    const url = `https://cdn.nba.com/logos/nba/${id}/${v}/L/logo.svg`
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const body = await res.text()
      if (!body.trimStart().startsWith('<')) continue
      await writeFile(join(OUT, `${abbrev}.svg`), body, 'utf8')
      console.log(`${abbrev.padEnd(4)} ← ${v}`)
      saved = true
      ok++
      break
    } catch (err) {
      console.warn(`${abbrev} ${v} failed: ${err.message}`)
    }
  }
  if (!saved) console.error(`!! ${abbrev} — no logo saved`)
}
console.log(`\n${ok}/${TEAMS.length} logos vendored → public/logos/`)
