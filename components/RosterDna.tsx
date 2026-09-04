'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { clusters } from '@/lib/data'
import {
  FEATURED_TEAM_ABBREV,
  leagueAverageArchetype as LEAGUE,
  teamArchetypeDna,
} from '@/lib/teamArchetypeDna'
import { chartPalette, spokeColor } from '@/lib/teamColors'

// Fixed radial geometry. Radius encodes games-weighted share; angle is a fixed archetype slot.
const R_MIN = 11
const R_MAX = 40
const DOMAIN_MAX = 56 // % — fixed so every team's fingerprint is on the same scale
const R_LABEL = 48
const R_LABEL_CARDINAL = 42 // top/right/bottom/left sit closer; outward align still clears the spoke
const RINGS = [15, 30, 45]
const EASE = [0.45, 0, 0.55, 1] as const

const angle = (i: number) => ((-90 + i * 45) * Math.PI) / 180
const pxAt = (i: number, r: number) => 50 + Math.cos(angle(i)) * r
const pyAt = (i: number, r: number) => 50 + Math.sin(angle(i)) * r
const radius = (s: number) => R_MIN + Math.max(0, Math.min(1, s / DOMAIN_MAX)) * (R_MAX - R_MIN)
const f2 = (n: number) => n.toFixed(2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const argmax = (a: number[]) => a.reduce((m, v, i) => (v > a[m] ? i : m), 0)

export default function RosterDna() {
  const reduce = useReducedMotion()
  const uid = useId().replace(/[:]/g, '')
  const teams = teamArchetypeDna

  const featuredIndex = useMemo(() => {
    const i = teams.findIndex((t) => t.abbrev === FEATURED_TEAM_ABBREV)
    return i < 0 ? 0 : i
  }, [teams])

  const [selectedIndex, setSelectedIndex] = useState(featuredIndex)
  const [current, setCurrent] = useState<number[]>(() => teams[featuredIndex].shares)
  const currentRef = useRef(current)
  currentRef.current = current

  // Morph the eight vertices from their previous radial distance to the new team's.
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const from = currentRef.current
    const to = teams[selectedIndex].shares
    if (reduce) {
      setCurrent(to)
      return
    }
    const controls = animate(0, 1, {
      duration: 0.8,
      ease: EASE,
      onUpdate: (t) => setCurrent(from.map((v, i) => lerp(v, to[i], t))),
    })
    return () => controls.stop()
  }, [selectedIndex, reduce, teams])

  // Below 560px the radial name labels are dropped; the table carries all eight names.
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const team = teams[selectedIndex]
  const di = argmax(current)
  const palette = chartPalette(team.abbrev)
  const teamGlow = palette[0]
  const teamStroke = palette[Math.min(1, palette.length - 1)]

  const pts = current.map((s, i) => [pxAt(i, radius(s)), pyAt(i, radius(s))] as const)
  const poly = pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')
  const leaguePoly = LEAGUE.map((s, i) => `${f2(pxAt(i, radius(s)))},${f2(pyAt(i, radius(s)))}`).join(' ')

  // ---- searchable team selector ----
  const [comboOpen, setComboOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimer = useRef<number | undefined>(undefined)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return teams
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => !q || t.abbrev.toLowerCase().startsWith(q) || t.name.toLowerCase().includes(q))
  }, [query, teams])

  useEffect(() => {
    if (!comboOpen) return
    const id = visible[active]?.i
    if (id == null) return
    document.getElementById(`${uid}-opt-${id}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, comboOpen, uid, visible])

  const selectTeam = (i: number) => {
    window.clearTimeout(blurTimer.current)
    setSelectedIndex(i)
    setComboOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const onComboKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setComboOpen(true)
      setActive((a) => Math.min(a + 1, visible.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (comboOpen && visible[active]) {
        e.preventDefault()
        selectTeam(visible[active].i)
      }
    } else if (e.key === 'Escape') {
      if (comboOpen) {
        e.preventDefault()
        setComboOpen(false)
        inputRef.current?.blur()
      }
    } else if (e.key === 'Home' && comboOpen) {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End' && comboOpen) {
      e.preventDefault()
      setActive(visible.length - 1)
    }
  }

  const [hover, setHover] = useState<number | null>(null)

  return (
    <section id="roster-dna" className="relative scroll-mt-6 bg-[#141a26] px-[8vw] pt-[12vw] text-paper">
      <span className="eyebrow">ROSTER DNA</span>
      <h2 className="mt-4 max-w-[20ch] font-serif text-[clamp(38px,5vw,74px)] leading-[.96] tracking-[-.035em]">
        Eight archetypes describe players. They also describe how teams are built.
      </h2>
      <p className="mt-6 max-w-[52ch] font-serif text-[clamp(19px,2.2vw,24px)] leading-[1.4] text-zinc-300">
        Every roster has its own behavioral fingerprint — the mix of offensive styles its players actually log minutes in.
      </p>
      <p className="mt-3 max-w-[50ch] font-serif text-[16px] leading-6 text-zinc-500">
        Select a team to see how its games-weighted roster composition differs from the league.
      </p>

      {/* Tall runway so the explorer stays parked while people flip teams */}
      <div className="relative mt-16 min-h-[200vh] max-lg:min-h-0 max-lg:pb-[12vw]">
        <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] min-h-[calc(100vh-3rem)] flex-col justify-center overflow-y-auto py-8 max-lg:static max-lg:max-h-none max-lg:min-h-0 max-lg:justify-start max-lg:overflow-visible max-lg:py-0">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:items-stretch lg:gap-x-16 lg:gap-y-10">
            {/* selector */}
            <div className="order-1 lg:col-start-1 lg:row-start-1">
              <label
                htmlFor={`${uid}-combo`}
                className="mb-2 block text-[9px] font-extrabold uppercase tracking-[.16em] text-zinc-500"
              >
                Choose a team
              </label>
              <div className="relative">
                <input
                  id={`${uid}-combo`}
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={comboOpen}
                  aria-controls={`${uid}-list`}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    comboOpen && visible[active] ? `${uid}-opt-${visible[active].i}` : undefined
                  }
                  autoComplete="off"
                  spellCheck={false}
                  value={comboOpen ? query : team.name}
                  placeholder="Type a team or abbreviation…"
                  className="w-full rounded-xl border border-white/10 bg-night px-4 py-3.5 text-[16px] font-medium text-paper outline-none placeholder:text-zinc-500 focus-visible:border-white/40"
                  onFocus={() => {
                    setComboOpen(true)
                    setQuery('')
                    setActive(0)
                    requestAnimationFrame(() => inputRef.current?.select())
                  }}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setComboOpen(true)
                    setActive(0)
                  }}
                  onBlur={() => {
                    blurTimer.current = window.setTimeout(() => setComboOpen(false), 140)
                  }}
                  onKeyDown={onComboKey}
                />
                {comboOpen && (
                  <ul
                    id={`${uid}-list`}
                    role="listbox"
                    aria-label="NBA teams"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[288px] overflow-auto rounded-xl border border-white/10 bg-night shadow-[0_24px_64px_rgba(0,0,0,.6)]"
                  >
                    {visible.map(({ t, i }, vi) => (
                      <li
                        key={t.abbrev}
                        id={`${uid}-opt-${i}`}
                        role="option"
                        aria-selected={vi === active}
                        className={`flex cursor-pointer items-center gap-3 border-t border-white/10 px-3.5 py-2.5 first:border-t-0 ${
                          vi === active ? 'bg-white/[.08]' : ''
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActive(vi)}
                        onClick={() => selectTeam(i)}
                      >
                        <span className="w-[34px] text-[11px] font-bold tracking-[.03em] text-zinc-500">
                          {t.abbrev}
                        </span>
                        <span
                          className={`text-[14px] font-medium ${i === selectedIndex ? 'text-hot' : 'text-paper'}`}
                        >
                          {t.name}
                        </span>
                      </li>
                    ))}
                    {visible.length === 0 && (
                      <li className="px-3.5 py-2.5 text-[13px] text-zinc-500">No match</li>
                    )}
                  </ul>
                )}
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">
                Type “MIA” or “Heat”, or arrow through the list. 30 teams.
              </p>
              <p className="sr-only" aria-live="polite">
                {team.name} selected. Dominant archetype {clusters[team.dominantCluster - 1].name},{' '}
                {team.shares[team.dominantCluster - 1].toFixed(1)} percent of games-weighted composition.
              </p>
            </div>

            {/* fingerprint — chart centers on the left column; caption sits below without shifting it */}
            <div className="order-2 relative flex items-center justify-center pb-12 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:pb-0">
              <div className="relative mx-auto aspect-square w-[min(500px,100%)] max-[560px]:w-[min(440px,86vw)]">
                <svg viewBox="0 0 100 100" className="block h-full w-full overflow-visible" aria-hidden="true">
                  <defs>
                    <radialGradient id={`${uid}-vig`}>
                      <stop offset="0" stopColor={teamGlow} stopOpacity="0.18" />
                      <stop offset="0.55" stopColor={teamStroke} stopOpacity="0.08" />
                      <stop offset="1" stopColor={teamGlow} stopOpacity="0" />
                    </radialGradient>
                    <filter id={`${uid}-blur`} x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="3.4" />
                    </filter>
                    {clusters.map((c, i) => {
                      const [x1, y1] = pts[i]
                      const [x2, y2] = pts[(i + 1) % 8]
                      return (
                        <linearGradient
                          key={c.id}
                          id={`${uid}-edge${i}`}
                          gradientUnits="userSpaceOnUse"
                          x1={f2(x1)}
                          y1={f2(y1)}
                          x2={f2(x2)}
                          y2={f2(y2)}
                        >
                          <stop offset="0" stopColor={spokeColor(palette, i)} />
                          <stop offset="1" stopColor={spokeColor(palette, i + 1)} />
                        </linearGradient>
                      )
                    })}
                  </defs>

                  <circle cx="50" cy="50" r="52" fill={`url(#${uid}-vig)`} />

                  {RINGS.map((r) => (
                    <circle
                      key={r}
                      cx="50"
                      cy="50"
                      r={f2(radius(r))}
                      fill="none"
                      stroke="rgba(244,241,233,.09)"
                      strokeWidth="0.3"
                    />
                  ))}

                  {clusters.map((c, i) => (
                    <line
                      key={c.id}
                      x1="50"
                      y1="50"
                      x2={f2(pxAt(i, R_MAX))}
                      y2={f2(pyAt(i, R_MAX))}
                      stroke="rgba(244,241,233,.06)"
                      strokeWidth="0.3"
                    />
                  ))}

                  {/* league-average reference */}
                  <polygon
                    points={leaguePoly}
                    fill="none"
                    stroke="rgba(244,241,233,.5)"
                    strokeWidth="0.4"
                    strokeDasharray="1 1.4"
                    strokeLinejoin="round"
                  />

                  {/* soft glow behind the shape — team primary */}
                  <polygon points={poly} fill={teamGlow} opacity="0.24" filter={`url(#${uid}-blur)`} />

                  {/* the fingerprint — multi-color team wedges cycling the full palette */}
                  <g style={{ mixBlendMode: 'screen' }} opacity="0.72">
                    {clusters.map((c, i) => {
                      const [ax, ay] = pts[i]
                      const [bx, by] = pts[(i + 1) % 8]
                      return (
                        <path
                          key={c.id}
                          d={`M50 50 L ${f2(ax)} ${f2(ay)} L ${f2(bx)} ${f2(by)} Z`}
                          fill={`url(#${uid}-edge${i})`}
                        />
                      )
                    })}
                  </g>

                  <polygon
                    points={poly}
                    fill="none"
                    stroke={teamStroke}
                    strokeOpacity="0.6"
                    strokeWidth="0.55"
                    strokeLinejoin="round"
                  />

                  {clusters.map((c, i) => {
                    const [x, y] = pts[i]
                    return (
                      <circle
                        key={c.id}
                        cx={f2(x)}
                        cy={f2(y)}
                        r={i === di ? 2.5 : 1.6}
                        fill={c.color}
                        className="transition-[r] duration-200 ease-out motion-reduce:transition-none"
                      />
                    )
                  })}
                </svg>

                {/* archetype labels + percentages — sit outside the spokes */}
                {clusters.map((c, i) => {
                  const isCardinal = i % 2 === 0
                  const lx = pxAt(i, isCardinal ? R_LABEL_CARDINAL : R_LABEL)
                  const ly = pyAt(i, isCardinal ? R_LABEL_CARDINAL : R_LABEL)
                  // Push text away from the chart: right→outward right, left→outward left,
                  // top→above, bottom→below; diagonals stay centered past the tip.
                  let align: 'left' | 'right' | 'center' = 'center'
                  let transform = 'translate(-50%,-50%)'
                  if (!compact) {
                    if (i === 2) {
                      // 3 o'clock — text runs right, clear of the spoke
                      align = 'left'
                      transform = 'translate(2px,-50%)'
                    } else if (i === 6) {
                      // 9 o'clock — text runs left, clear of the spoke
                      align = 'right'
                      transform = 'translate(calc(-100% - 2px),-50%)'
                    } else if (i === 0) {
                      transform = 'translate(-50%,calc(-100% + 2px))'
                    } else if (i === 4) {
                      transform = 'translate(-50%,2px)'
                    }
                  }
                  return (
                    <div
                      key={c.id}
                      className="pointer-events-none absolute flex flex-col gap-0.5"
                      style={{
                        left: `${lx}%`,
                        top: `${ly}%`,
                        width: compact ? 46 : 78,
                        transform,
                        textAlign: compact ? 'center' : align,
                      }}
                    >
                      {!compact && (
                        <span
                          className="text-[10px] font-semibold leading-[1.15]"
                          style={{ color: c.color }}
                        >
                          {c.name}
                        </span>
                      )}
                      <span
                        className={`font-bold tabular-nums ${compact ? 'text-[11px]' : 'text-[14px]'} ${
                          i === di ? 'text-hot' : 'text-paper'
                        }`}
                      >
                        {current[i].toFixed(1)}%
                      </span>
                    </div>
                  )
                })}

                {/* hit / focus targets */}
                {clusters.map((c, i) => {
                  const [x, y] = pts[i]
                  const diff = current[i] - LEAGUE[i]
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className="absolute h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:bg-[#ff5a36]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff5a36]"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      aria-label={`${c.name}. Team share ${current[i].toFixed(1)} percent. League average ${LEAGUE[
                        i
                      ].toFixed(1)} percent. Difference ${diff >= 0 ? 'plus' : 'minus'} ${Math.abs(diff).toFixed(
                        1,
                      )} percentage points.`}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover((h) => (h === i ? null : h))}
                      onClick={() => setHover((h) => (h === i ? null : i))}
                    />
                  )
                })}

                {/* hover / focus detail */}
                {hover != null &&
                  (() => {
                    const i = hover
                    const [x, y] = pts[i]
                    const diff = current[i] - LEAGUE[i]
                    const hx = x > 56 ? '-108%' : x < 44 ? '8%' : '-50%'
                    const hy = y > 50 ? '-112%' : '12%'
                    return (
                      <div
                        className="pointer-events-none absolute z-20 w-[190px] rounded-[10px] border border-white/10 bg-night px-3 py-2.5 text-[11px] leading-[1.5] shadow-[0_14px_44px_rgba(0,0,0,.55)]"
                        style={{ left: `${x}%`, top: `${y}%`, transform: `translate(${hx},${hy})` }}
                      >
                        <b className="mb-1 block text-[12px] leading-tight" style={{ color: clusters[i].color }}>
                          {clusters[i].name}
                        </b>
                        <div className="flex justify-between text-zinc-400">
                          <span>Team share</span>
                          <span className="tabular-nums text-paper">{current[i].toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>League avg</span>
                          <span className="tabular-nums text-paper">{LEAGUE[i].toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Difference</span>
                          <span className="tabular-nums text-paper">
                            {diff >= 0 ? '+' : '−'}
                            {Math.abs(diff).toFixed(1)} pp
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                <p className="pointer-events-none absolute left-0 right-0 top-full mt-8 text-center text-[10px] tracking-[.06em] text-zinc-500">
                  Rings mark 15 / 30 / 45% · dashed shape is the league average
                </p>
              </div>
            </div>

            {/* readout */}
            <div className="order-3 flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
              <p className="font-serif text-[15px] text-zinc-400">
                Dominant archetype —{' '}
                <b className="font-semibold" style={{ color: clusters[di].color }}>
                  {clusters[di].name}
                </b>
              </p>
              <p className="max-w-[44ch] font-serif text-[clamp(17px,2vw,20px)] leading-[1.45] text-paper">
                {team.observation}
              </p>
            </div>

            {/* accessible table = the detail panel and the text representation of the shape */}
            <div className="order-4 max-w-[520px] lg:col-start-1 lg:row-start-3">
              <div className="mb-3 text-[9px] font-extrabold uppercase tracking-[.16em] text-zinc-500">
                Archetype breakdown · <span className="text-paper">{team.name}</span>
              </div>
              <table className="w-full border-collapse">
                <caption className="sr-only">
                  Games-weighted archetype share for {team.name}, the NBA average, and the difference in
                  percentage points.
                </caption>
                <thead>
                  <tr className="text-[9px] font-bold uppercase tracking-[.12em] text-zinc-500">
                    <th scope="col" className="pb-2.5 text-left">
                      Archetype
                    </th>
                    <th scope="col" className="pb-2.5 text-right">
                      Share %
                    </th>
                    <th scope="col" className="pb-2.5 text-right">
                      NBA %
                    </th>
                    <th scope="col" className="pb-2.5 text-right">
                      Δ pp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clusters.map((c, i) => {
                    const diff = current[i] - LEAGUE[i]
                    const isDom = i === di
                    return (
                      <tr key={c.id} className={isDom ? 'text-paper' : 'text-zinc-400'}>
                        <td className="border-t border-white/10 py-2.5 text-[13px]">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 flex-none rounded-[2px]"
                              style={{ background: c.color }}
                            />
                            <span className={isDom ? 'font-bold' : ''}>{c.name}</span>
                          </div>
                        </td>
                        <td className="border-t border-white/10 py-2.5 text-right text-[13px] tabular-nums">
                          {current[i].toFixed(1)}
                        </td>
                        <td className="border-t border-white/10 py-2.5 text-right text-[13px] tabular-nums">
                          {LEAGUE[i].toFixed(1)}
                        </td>
                        <td
                          className={`border-t border-white/10 py-2.5 text-right text-[13px] tabular-nums ${
                            diff >= 0.05 ? 'text-paper' : 'text-zinc-500'
                          }`}
                        >
                          {diff >= 0 ? '+' : '−'}
                          {Math.abs(diff).toFixed(1)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
