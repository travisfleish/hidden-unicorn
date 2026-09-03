'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scaleLinear } from 'd3'
import type { Cluster, Player } from '@/lib/data'
import {
  clusters as clusterData,
  HIDDEN_UNICORN_MIN_TOUCHES,
  isHiddenUnicornEligible,
  officialHiddenUnicorns,
  sampleOpacity,
  signatureTraitShortLabel,
  topInArchetype,
} from '@/lib/data'
import { headshotIds, headshotSrcSet } from '@/lib/headshots'

type Dot = Player & { x: number; y: number; ghost?: boolean; key: string }
type LabelSide = 'above' | 'below' | 'left' | 'right'

// 2–3–3 layout with enough air that halos (~9.2) and titles clear each other
const centers: Record<number, [number, number]> = {
  1:[26,23],2:[74,23],3:[82,52],4:[80,81],5:[20,81],6:[18,52],7:[50,50],8:[50,81]
}
// Cluster-only focus sits left so the Top 10 roster can breathe on the right.
// Player focus centers the cloud so the paper profile can sit underneath.
const FOCUS_ROSTER: [number, number] = [30, 50]
const FOCUS_PLAYER: [number, number] = [50, 34]
// Top + middle titles above; bottom titles below — keeps names out of neighboring clouds
const labelSide: Record<number, LabelSide> = {
  1:'above',2:'above',3:'above',4:'below',5:'below',6:'above',7:'above',8:'below'
}
const HALO_R=9.2
// Canonical archetype colors live on `clusters` in lib/data.ts — keep one source of truth.
const colors: Record<number,string> = Object.fromEntries(clusterData.map((c) => [c.id, c.color]))
const hash=(s:string)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const rand=(seed:number)=>{const x=Math.sin(seed*999.91)*43758.5453;return x-Math.floor(x)}
// Round so Node vs browser float drift on Math.sin/cos doesn't break hydration
const round=(n:number)=>Math.round(n*1e4)/1e4

const hasPhoto=(d:Dot)=>headshotIds[d.name]!=null

const ease = [0.45, 0, 0.55, 1] as const
const focusTransition = { duration: 0.7, ease }

function clusterShift(
  id: number,
  activeCluster: number | null,
  mode: 'roster' | 'player' = 'roster',
): [number, number] {
  if (!activeCluster || activeCluster !== id) return [0, 0]
  const focus = mode === 'player' ? FOCUS_PLAYER : FOCUS_ROSTER
  const [cx, cy] = centers[id]
  return [focus[0] - cx, focus[1] - cy]
}

// Split an archetype name into ~balanced lines so it sits neatly by its halo
function labelLines(name:string){
  const w=name.replace(/\s*\/\s*/g,' / ').split(' ').filter(Boolean)
  if(w.length<3) return [name]
  let cut=1,diff=Infinity
  for(let i=1;i<w.length;i++){
    const d=Math.abs(w.slice(0,i).join(' ').length - w.slice(i).join(' ').length)
    if(d<diff){diff=d;cut=i}
  }
  return [w.slice(0,cut).join(' '), w.slice(cut).join(' ')]
}

function labelLayout(id:number, lines:string[]){
  const [cx,cy]=centers[id]
  const side=labelSide[id]
  const lineH=1.85
  const gap=1.6
  if(side==='above'){
    const y0=cy-HALO_R-gap-(lines.length-1)*lineH
    return {x:cx, y0, lineH, anchor:'middle' as const}
  }
  if(side==='below'){
    const y0=cy+HALO_R+gap+1.2
    return {x:cx, y0, lineH, anchor:'middle' as const}
  }
  if(side==='left'){
    const mid=(lines.length-1)*lineH/2
    return {x:cx-HALO_R-gap, y0:cy-mid+.35, lineH, anchor:'end' as const}
  }
  const mid=(lines.length-1)*lineH/2
  return {x:cx+HALO_R+gap, y0:cy-mid+.35, lineH, anchor:'start' as const}
}

function buildDots(players: Player[]): Dot[] {
  // Radius encodes true 31D distance to the assigned archetype centroid (within-cluster).
  // Angle stays a seeded layout hash — not model geometry.
  const distExtent = new Map<number, [number, number]>()
  for (const p of players) {
    const cur = distExtent.get(p.cluster)
    if (!cur) distExtent.set(p.cluster, [p.distanceToCentroid, p.distanceToCentroid])
    else {
      cur[0] = Math.min(cur[0], p.distanceToCentroid)
      cur[1] = Math.max(cur[1], p.distanceToCentroid)
    }
  }
  return players.map((p, i) => {
    const [cx, cy] = centers[p.cluster]
    const [dMin, dMax] = distExtent.get(p.cluster) ?? [p.distanceToCentroid, p.distanceToCentroid]
    const distToRadius = scaleLinear()
      .domain([dMin, dMax === dMin ? dMin + 1 : dMax])
      .range([1.2, 9.4])
    const angle = rand(hash(p.name)) * Math.PI * 2
    const radial = distToRadius(p.distanceToCentroid)
    return {
      ...p,
      x: round(cx + Math.cos(angle) * radial),
      y: round(cy + Math.sin(angle) * radial * 0.72),
      key: `p-${i}`,
    }
  })
}

// Circular headshot for a highlighted player. Hard clip (not a soft fade) keeps
 // the transparent PNGs crisp with no border ring.
function Portrait({d,r,opacity,cx,cy}:{d:Dot;r:number;opacity:number;cx:number;cy:number}){
  const id=headshotIds[d.name]
  const box=r*2
  const clipId=`portraitClip-${d.key}`
  // Translate from the resting star position so focus shifts animate with the cloud
  const dx = cx - d.x
  const dy = cy - d.y
  return <motion.g initial={{opacity:0}} animate={{opacity, x: dx, y: dy}} transition={focusTransition} style={{ pointerEvents: 'none' }}>
    <defs>
      <clipPath id={clipId}><circle cx={d.x} cy={d.y} r={r}/></clipPath>
    </defs>
    {/* Face-centered r320 WebP (sharp/Lanczos) instead of the 1040px indexed PNG:
        the SVG draws this into a viewBox-100 box, so the raw source would be
        downscaled ~15x by the browser and the face would smear. */}
    <image href={`/headshots/r320/${id}.webp`} x={d.x-box/2} y={d.y-box/2} width={box} height={box}
      preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} style={{imageRendering:'auto'}}/>
  </motion.g>
}

function RosterPhoto({ name, size = 32 }: { name: string; size?: number }) {
  const img = headshotSrcSet(name)
  if (!img) {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full bg-black/10 text-[9px] font-semibold text-muted"
        style={{ width: size, height: size }}
      >
        {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
      </span>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      decoding="async"
      className="shrink-0 rounded-full bg-black/5 object-cover"
      style={{ width: size, height: size }}
    />
  )
}

function ClusterRoster({
  cluster,
  players,
  selected,
  onPlayer,
}: {
  cluster: Cluster
  players: Player[]
  selected: Player | null
  onPlayer: (p: Player) => void
}) {
  // Archetype Top 10 = closest to centroid among players with ≥2,000 touches
  const top = useMemo(() => topInArchetype(cluster.id, players), [players, cluster.id])

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 14 }}
      transition={focusTransition}
      className="pointer-events-none absolute inset-y-0 right-0 z-[2] flex items-center justify-center px-4 max-[900px]:px-3"
      style={{ left: `${FOCUS_ROSTER[0] + HALO_R}%` }}
    >
      <aside
        className="pointer-events-auto flex w-[min(92%,280px)] flex-col overflow-hidden rounded-xl border border-black/10 bg-paper px-4 py-3.5 max-[900px]:w-[min(96%,240px)] max-[900px]:px-3.5 max-[900px]:py-3"
        aria-label={`Top players in ${cluster.name}`}
      >
        <span className="text-[10px] font-extrabold tracking-[.16em] text-muted">TOP 10 IN ARCHETYPE</span>
        <h3 className="mt-1.5 font-serif text-[18px] leading-tight text-ink max-[900px]:text-[15px]">{cluster.name}</h3>
        <p className="mt-1.5 font-serif text-[12px] leading-[1.4] text-muted">{cluster.description}</p>
        <ol className="mt-3.5 space-y-1">
          {top.map((p, i) => {
            const isSelected = selected?.name === p.name
            return (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => onPlayer(p)}
                  className={`grid w-full grid-cols-[22px_32px_1fr] items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors ${
                    isSelected ? 'bg-black/10' : 'hover:bg-black/5'
                  }`}
                >
                  <span className="text-[11px] tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <RosterPhoto name={p.name} />
                  <span className="min-w-0 truncate text-[13px] font-medium text-ink">{p.name}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </aside>
    </motion.div>
  )
}

// Compact horizontal strip under the focused halo — keeps name/stats off the cluster title.
function SelectedPlayerStrip({
  player,
  cluster,
  onClose,
}: {
  player: Player
  cluster: Cluster
  onClose: () => void
}) {
  const eligible = isHiddenUnicornEligible(player)
  const eyebrow = player.prototype
    ? 'ARCHETYPE PROTOTYPE'
    : eligible && player.hiddenUnicornScore >= 94
      ? 'HIDDEN UNICORN'
      : 'PLAYER PROFILE'

  const stats = eligible
    ? [
        { label: 'HU score', value: player.hiddenUnicornScore.toFixed(1) },
        { label: 'Global uniq.', value: `${player.rawPercentile.toFixed(0)}th` },
        { label: 'Archetype uniq.', value: `${player.clusterPercentile.toFixed(0)}th` },
        { label: 'Dist. to center', value: player.distanceToCentroid.toFixed(2) },
        { label: 'Touches', value: player.touches.toLocaleString() },
      ]
    : [
        { label: 'Dist. to center', value: player.distanceToCentroid.toFixed(2) },
        { label: 'Touches', value: player.touches.toLocaleString() },
        { label: 'Eligibility', value: `< ${HIDDEN_UNICORN_MIN_TOUCHES.toLocaleString()}` },
      ]

  const note =
    player.note ||
    (player.prototype
      ? 'Closest player to this archetype’s center — the model’s cleanest example of the role.'
      : eligible
        ? `More stylistically unusual than ${player.rawPercentile.toFixed(0)}% of eligible players.`
        : 'Visible on the map, but below the sample threshold for official ranking.')

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={focusTransition}
      className="pointer-events-none absolute inset-x-0 z-[2] flex justify-center px-5 max-[900px]:px-3"
      style={{ top: `${FOCUS_PLAYER[1] + HALO_R + 4}%` }}
      aria-label={`${player.name} statistical profile`}
    >
      <div className="pointer-events-auto relative w-full max-w-[600px] rounded-xl border border-black/10 bg-paper px-4 py-3.5 text-ink shadow-[0_12px_40px_rgba(0,0,0,.28)] max-[900px]:max-w-none max-[900px]:px-3.5 max-[900px]:py-3">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink"
          aria-label="Back to archetype"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-start gap-3.5 pr-8">
          <RosterPhoto name={player.name} size={48} />
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-extrabold tracking-[.16em] text-muted">{eyebrow}</span>
            <h3 className="mt-0.5 truncate font-serif text-[22px] leading-none max-[900px]:text-[18px]">{player.name}</h3>
            <p className="mt-1 truncate text-[11px] text-muted">{cluster.name}</p>
          </div>
        </div>

        {eligible ? (
          <div className="relative mt-3 h-5 overflow-hidden rounded-full bg-black/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(1, player.hiddenUnicornScore)}%` }}
              transition={{ duration: 0.7, ease }}
              className="h-full rounded-full bg-hot"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-extrabold tracking-wide">
              Hidden Unicorn Score · {player.hiddenUnicornScore.toFixed(1)}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-hot">
            Not eligible for official ranking
            <span className="ml-1.5 font-normal text-muted">
              (min {HIDDEN_UNICORN_MIN_TOUCHES.toLocaleString()} touches)
            </span>
          </p>
        )}

        <dl className={`mt-3 grid gap-2 border-t border-black/10 pt-3 ${eligible ? 'grid-cols-5 max-[900px]:grid-cols-3' : 'grid-cols-3'}`}>
          {stats.map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="truncate text-[8px] font-extrabold uppercase tracking-[.12em] text-muted">{s.label}</dt>
              <dd className="mt-0.5 truncate text-[15px] font-semibold tabular-nums max-[900px]:text-[13px]">{s.value}</dd>
            </div>
          ))}
        </dl>

        {player.signatureTraits && player.signatureTraits.length > 0 ? (
          <div className="mt-2.5 border-t border-black/10 pt-2.5">
            <span className="block text-[8px] font-extrabold tracking-[.16em] text-muted">SIGNATURE TRAITS</span>
            <dl className="mt-1.5 grid grid-cols-5 gap-2 max-[900px]:grid-cols-3">
              {player.signatureTraits.map((trait) => (
                <div key={trait.key} className="min-w-0" title={`${trait.label} · ${trait.direction} · ${trait.percentile.toFixed(1)}th percentile`}>
                  <dt className="truncate text-[8px] font-extrabold uppercase tracking-[.12em] text-muted">
                    {signatureTraitShortLabel(trait)}
                  </dt>
                  <dd className="mt-0.5 truncate text-[15px] font-semibold tabular-nums max-[900px]:text-[13px]">
                    {trait.percentile.toFixed(0)}
                    <span className="text-[10px] font-bold tracking-wide text-muted">th</span>
                    <span className="ml-1 text-[9px] font-extrabold uppercase tracking-wide text-muted">
                      {trait.direction}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <p className="mt-3 border-t border-black/10 pt-2.5 font-serif text-[12px] leading-5 text-muted">{note}</p>
      </div>
    </motion.div>
  )
}

function shuffleIds(ids: number[]) {
  const out = [...ids]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const CLUSTER_STAGGER = 0.22
const CLUSTER_FADE = 0.55

export default function Galaxy({clusters, players, scene, selected, activeCluster, reveal = true, onPlayer, onCluster, onClearPlayer, onClearCluster}:{
  clusters:Cluster[]; players:Player[]; scene:string; selected:Player|null; activeCluster:number|null; reveal?:boolean; onPlayer:(p:Player)=>void; onCluster:(id:number)=>void; onClearPlayer:()=>void; onClearCluster:()=>void
}) {
  const dots=useMemo(()=>buildDots(players),[players])
  // Model beat = plain constellation. Clusters = archetype names. Unicorn = outlier portraits.
  // Explore = names back on; outlier portraits fade off (selected player can still get a headshot).
  const organized=scene==='clusters'||scene==='unicorn'||scene==='explore'
  const nameLabels=scene==='clusters'||scene==='explore'
  // Constellation click → Top 10 roster, same as the story cards — clusters + explore beats.
  const canPickCluster=scene==='clusters'||scene==='explore'
  const portraitsOn=scene==='unicorn'
  // Same Top 10 as the official Hidden Unicorn ranking (≥1,000 touches, by hiddenUnicornScore)
  const portraitNames=useMemo(()=>new Set(officialHiddenUnicorns.map(p=>p.name)),[])
  // Unicorn beat: all Top 10 outlier headshots. Once a player is selected, only theirs remains.
  const showPortrait=(d:Dot)=>{
    if (d.ghost || !hasPhoto(d)) return false
    if (selected) return selected.name === d.name
    return portraitsOn && portraitNames.has(d.name)
  }
  // Opacity = sample confidence (touches) only. Radial position remains distanceToCentroid (not the hybrid score).
  const opacityFor=(d:Dot)=>{
    const confidence = sampleOpacity(d.touches)
    if(d.ghost) return Math.min(confidence, 0.18)
    // Outside the focused archetype: gone. Inside it with a selection: dim everyone but the pick.
    if(activeCluster && d.cluster!==activeCluster) return 0
    if(selected) return d.name===selected.name ? Math.max(confidence, 0.85) : confidence * 0.14
    // Unicorn beat keeps every player visible; portraits mark the official Top 10
    return confidence
  }
  const activeMeta = activeCluster ? clusters.find((c) => c.id === activeCluster) : null
  const focusMode: 'roster' | 'player' = selected ? 'player' : 'roster'

  // Escape returns to the archetype roster without a full map reset.
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClearPlayer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, onClearPlayer])

  // Stagger each constellation when the galaxy frame appears (random order each visit).
  const [wave, setWave] = useState<{ on: boolean; order: number[] }>(() => ({
    on: false,
    order: clusters.map((c) => c.id),
  }))
  useEffect(() => {
    if (reveal) {
      setWave((w) => (w.on ? w : { on: true, order: shuffleIds(clusters.map((c) => c.id)) }))
    } else {
      setWave((w) => ({ ...w, on: false }))
    }
  }, [reveal, clusters])
  const revealDelay = (id: number) => {
    if (!wave.on) return 0
    const i = wave.order.indexOf(id)
    return (i < 0 ? 0 : i) * CLUSTER_STAGGER
  }
  const dotsByCluster = useMemo(() => {
    const map = new Map<number, Dot[]>()
    for (const c of clusters) map.set(c.id, [])
    for (const d of dots) map.get(d.cluster)?.push(d)
    return map
  }, [dots, clusters])

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full font-sans" aria-label="Interactive map of offensive player archetypes">
        {clusters.map(c=>{
          const lines=labelLines(c.name)
          const {x,y0,lineH,anchor}=labelLayout(c.id, lines)
          const [dx, dy] = clusterShift(c.id, activeCluster, focusMode)
          const focused = activeCluster === c.id
          const dimmed = !!activeCluster && !focused
          const groupDots = dotsByCluster.get(c.id) || []
          return (
            <motion.g
              key={`cluster-${c.id}`}
              initial={false}
              animate={{ opacity: wave.on ? 1 : 0 }}
              transition={{ duration: CLUSTER_FADE, delay: revealDelay(c.id), ease }}
            >
              {organized && (
                <motion.g
                  animate={{
                    x: dx,
                    y: dy,
                    opacity: dimmed ? 0 : 1,
                  }}
                  transition={focusTransition}
                  onClick={canPickCluster ? () => onCluster(c.id) : undefined}
                  className={canPickCluster ? 'cursor-pointer' : undefined}
                  style={{ pointerEvents: dimmed || !canPickCluster ? 'none' : 'auto' }}
                >
                  {/* Invisible hit target — stroke-only halo would ignore clicks inside the cloud */}
                  {canPickCluster ? (
                    <circle cx={centers[c.id][0]} cy={centers[c.id][1]} r={HALO_R + 1.2} fill="transparent" />
                  ) : null}
                  {lines.map((ln,i)=>(
                    <motion.text
                      key={i}
                      x={x}
                      y={y0+i*lineH}
                      fill="#d5dae3"
                      fontSize="1.7"
                      textAnchor={anchor}
                      fontWeight="600"
                      letterSpacing=".03"
                      style={{fontFamily:'var(--font-sans), system-ui, sans-serif'}}
                      initial={{opacity:0}}
                      // Hide title when a player in this cluster is selected — profile strip carries the name.
                      animate={{opacity: nameLabels && !dimmed && !(selected && focused) ? 1 : 0}}
                      transition={{duration:.55, ease}}
                    >
                      {ln}
                    </motion.text>
                  ))}
                </motion.g>
              )}
              {groupDots.filter(d=>!showPortrait(d)).map(d=>{
                const [dotDx, dotDy] = clusterShift(d.cluster, activeCluster, focusMode)
                return (
                  <motion.circle
                    key={d.key}
                    r={d.ghost?.55:.85}
                    fill={colors[d.cluster]}
                    initial={false}
                    animate={{
                      cx: d.x + dotDx,
                      cy: d.y + dotDy,
                      opacity: opacityFor(d),
                      scale: selected?.name===d.name ? 1.35 : 1,
                    }}
                    transition={focusTransition}
                    style={{ pointerEvents: 'none' }}
                  />
                )
              })}
              {groupDots.filter(d=>showPortrait(d)).map(d=>{
                const [dotDx, dotDy] = clusterShift(d.cluster, activeCluster, focusMode)
                return (
                  <Portrait
                    key={d.key}
                    d={d}
                    cx={d.x + dotDx}
                    cy={d.y + dotDy}
                    r={selected?.name===d.name?4.6:3.6}
                    opacity={opacityFor(d)}
                  />
                )
              })}
            </motion.g>
          )
        })}
      </svg>

      <AnimatePresence>
        {activeMeta && !selected ? (
          <motion.button
            key="cluster-dismiss"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[1] cursor-default bg-transparent"
            aria-label="Back to all archetypes"
            onClick={onClearCluster}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeMeta && !selected ? (
          <ClusterRoster
            key={activeMeta.id}
            cluster={activeMeta}
            players={players}
            selected={selected}
            onPlayer={onPlayer}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selected && activeMeta && selected.cluster === activeMeta.id ? (
          <motion.button
            key="player-dismiss"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[1] cursor-default bg-transparent"
            aria-label="Back to archetype"
            onClick={onClearPlayer}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selected && activeMeta && selected.cluster === activeMeta.id ? (
          <SelectedPlayerStrip
            key={selected.name}
            player={selected}
            cluster={activeMeta}
            onClose={onClearPlayer}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
