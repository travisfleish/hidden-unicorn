'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Galaxy from './Galaxy'
import {
  clusters,
  HIDDEN_UNICORN_MIN_TOUCHES,
  isHiddenUnicornEligible,
  officialHiddenUnicorns,
  players,
  type Player,
} from '@/lib/data'
import { headshotUrl } from '@/lib/headshots'

function PlayerPhoto({ name, size = 68 }: { name: string; size?: number }) {
  const src = headshotUrl(name)
  const [ok, setOk] = useState(true)
  if (!src || !ok)
    return (
      <div
        className="grid shrink-0 place-items-center rounded-xl bg-black/10 font-serif text-lg text-muted"
        style={{ width: size, height: size }}
      >
        {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
      </div>
    )
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setOk(false)}
      className="shrink-0 rounded-xl bg-black/5 object-cover object-top"
      style={{ width: size, height: size }}
    />
  )
}

const highSampleUnicorns = officialHiddenUnicorns

export default function HiddenUnicornStory(){
  const [scene,setScene]=useState('intro')
  const [selected,setSelected]=useState<Player|null>(null)
  const [activeCluster,setActiveCluster]=useState<number|null>(null)
  const [query,setQuery]=useState('')
  // video → hidden (fade out at video size) → galaxy (fade in at full square).
  // Keeps the morph off-screen so you never see a black rect expand.
  const [frameMode,setFrameMode]=useState<'video'|'hidden'|'galaxy'>('video')
  const introVideoRef=useRef<HTMLVideoElement>(null)
  const prevIntroRef=useRef(true)
  const isIntro=scene==='intro'

  useEffect(()=>{
    const els=[...document.querySelectorAll<HTMLElement>('[data-scene]')]
    // A scene owns the beat only while the focus line sits inside its tall
    // scroll range — so archetype names wait until "Eight archetypes emerge"
    // takes the sticky column, not while "Throw away the positions" is still up.
    // Intro→model still flips early enough for the video→galaxy morph: leave
    // intro once its section bottom has crossed the upper third of the viewport.
    const pick=()=>{
      const line=window.innerHeight*0.38
      let best='intro'
      for(const el of els){
        const {top,bottom}=el.getBoundingClientRect()
        if(top<line && bottom>line) best=el.dataset.scene||'intro'
      }
      setScene(best)
    }
    const observer=new IntersectionObserver(pick,{
      rootMargin:'0px 0px -10% 0px',
      threshold:[0,0.01,0.05,0.1,0.25,0.5,0.75,1],
    })
    els.forEach(el=>observer.observe(el))
    window.addEventListener('scroll',pick,{passive:true})
    window.addEventListener('resize',pick)
    pick()
    return ()=>{
      observer.disconnect()
      window.removeEventListener('scroll',pick)
      window.removeEventListener('resize',pick)
    }
  },[])

  useEffect(()=>{
    if(prevIntroRef.current===isIntro) return
    prevIntroRef.current=isIntro
    // Fade the current frame out fully, then swap size while invisible and fade back in.
    setFrameMode('hidden')
    const t=window.setTimeout(()=>setFrameMode(isIntro?'video':'galaxy'),720)
    return ()=>window.clearTimeout(t)
  },[isIntro])

  useEffect(()=>{
    const video=introVideoRef.current
    if(!video) return
    if(frameMode==='video'){
      const play=video.play()
      if(play) play.catch(()=>{})
    } else {
      video.pause()
    }
  },[frameMode])

  const matches=useMemo(()=>query.trim().length<2?[]:players.filter(p=>p.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0,6),[query])
  const pickPlayer=(p:Player)=>{
    setSelected(p)
    // Always open the player's archetype so the map fades/centers like a cluster pick
    setActiveCluster(p.cluster)
  }
  const pickCluster=(id:number)=>{setActiveCluster(prev=>prev===id?null:id);setSelected(null)}
  // Deselect player but keep the archetype open (return to Top 10 roster).
  const clearPlayer=()=>setSelected(null)
  // Close Top 10 / focused archetype and return to the full map.
  const clearCluster=()=>{setSelected(null);setActiveCluster(null)}
  const reset=()=>{setSelected(null);setActiveCluster(null);setQuery('')}

  // Scrolling the story should clear cluster/player focus so the map returns to overview.
  useEffect(()=>{
    if(!selected && activeCluster==null) return
    const onScroll=()=>{
      setSelected(null)
      setActiveCluster(null)
      setQuery('')
    }
    window.addEventListener('scroll',onScroll,{passive:true})
    return ()=>window.removeEventListener('scroll',onScroll)
  },[selected,activeCluster])

  const showVideoFrame=frameMode!=='galaxy'
  const frameVisible=frameMode!=='hidden'

  return <main className="min-h-screen bg-paper text-ink">
    <section className="relative flex min-h-[760px] flex-col justify-center overflow-hidden px-[8vw] py-[8vw]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src="/watermark-unicorn.png"
        alt=""
        className="pointer-events-none absolute right-[2vw] top-1/2 w-[clamp(280px,42vw,620px)] -translate-y-1/2 select-none opacity-[0.12] max-[900px]:right-[-8vw] max-[900px]:w-[min(78vw,400px)] max-[900px]:opacity-[0.09]"
      />
      <p className="eyebrow">A DATA-DRIVEN BASKETBALL STORY</p>
      <h1 className="relative mt-4 font-serif text-[clamp(52px,10vw,150px)] font-normal uppercase leading-[.84] tracking-[-.055em]">The <em className="not-italic text-hot">Hidden</em><br/>Unicorn</h1>
      <p className="relative mt-5 text-[12px] uppercase tracking-[.18em] text-muted">by Travis Fleisher</p>
      <p className="relative mt-8 max-w-[760px] font-serif text-[clamp(21px,2.6vw,30px)] leading-[1.28]">The unique players <em className="font-normal text-hot">hiding in plain sight.</em></p>
      <p className="relative mt-6 max-w-[640px] font-serif text-[17px] leading-7 text-muted">Instead of asking which seven-footer can dribble, we let 473 NBA players&apos; actual statistical profiles define their own offensive archetype&hellip;then found the players who still refuse to fit.</p>
      <div className="absolute bottom-10 right-[6vw] text-[10px] tracking-[.16em]">SCROLL TO ENTER <span className="ml-2 text-2xl">↓</span></div>
    </section>

    <div className="mx-auto grid max-w-[1480px] grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)] gap-[4vw] px-[4vw] max-[900px]:block max-[900px]:px-0">
      <aside className="sticky top-6 self-start pb-6 max-[900px]:top-0 max-[900px]:z-20 max-[900px]:bg-paper max-[900px]:p-3">
        <motion.div
          className="flex min-h-[calc(100vh-3rem)] w-full items-center max-[900px]:min-h-0 max-[900px]:items-start"
          initial={false}
        >
          <motion.div
            className={`relative w-full overflow-hidden rounded-[22px] bg-night text-white max-[900px]:rounded-2xl ${
              showVideoFrame
                ? 'aspect-video'
                : 'h-[min(86vh,940px)] min-h-[580px] max-[900px]:h-[60vh] max-[900px]:min-h-[440px]'
            }`}
            initial={false}
            animate={{ opacity: frameVisible ? 1 : 0 }}
            transition={{
              duration: frameVisible ? 1.35 : 0.7,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            <motion.button
              type="button"
              onClick={reset}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 px-3 py-2 text-[9px] tracking-[.12em] text-zinc-300 backdrop-blur transition-colors hover:bg-white/20"
              initial={false}
              animate={{ opacity: frameMode==='galaxy' ? 1 : 0 }}
              transition={{ duration: 1.1, ease: [0.45, 0, 0.55, 1], delay: frameMode==='galaxy' ? 0.35 : 0 }}
              style={{ pointerEvents: frameMode==='galaxy' ? 'auto' : 'none' }}
            >
              RESET
            </motion.button>
            <motion.p
              className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-[9px] tracking-[.1em] text-zinc-500"
              initial={false}
              animate={{ opacity: frameMode==='galaxy' && scene==='model' ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.45, 0, 0.55, 1] }}
              aria-hidden={!(frameMode==='galaxy' && scene==='model')}
            >
              Opacity reflects amount of touches
            </motion.p>
            <div
              className="box-border absolute inset-0 p-4 max-[900px]:p-3"
              style={{ pointerEvents: frameMode==='galaxy' ? 'auto' : 'none' }}
              aria-hidden={frameMode!=='galaxy'}
            >
              <Galaxy clusters={clusters} players={players} scene={scene} selected={selected} activeCluster={activeCluster} reveal={frameMode==='galaxy'} onPlayer={pickPlayer} onCluster={pickCluster} onClearPlayer={clearPlayer} onClearCluster={clearCluster}/>
            </div>
            <div
              className="absolute inset-0 z-[1]"
              style={{
                opacity: frameMode==='video' ? 1 : 0,
                pointerEvents: frameMode==='video' ? 'auto' : 'none',
                transition: frameMode==='video'
                  ? 'opacity 0.9s cubic-bezier(0.45, 0, 0.55, 1) 0.15s'
                  : 'opacity 0.55s cubic-bezier(0.45, 0, 0.55, 1)',
              }}
              aria-hidden={frameMode!=='video'}
            >
              <video
                ref={introVideoRef}
                src="/wemby-dunk-foul-murray.mp4"
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
          </motion.div>
        </motion.div>
        <DetailPanel selected={selected} activeCluster={activeCluster} onPlayer={pickPlayer}/>
      </aside>

      <article className="pb-[50vh] max-[900px]:px-6 max-[900px]:pb-[30vh]">
        <StoryScene id="intro" eyebrow="THE OLD DEFINITION" title="We know what a basketball unicorn looks like.">Tall. Long. Perimeter skills in a body that should not have them. Porziņģis. Giannis. Wembanyama.</StoryScene>
        <StoryScene id="model" eyebrow="THROW AWAY THE POSITIONS" title="But what if the game defines its own outliers?">
          Using exclusive Genius Sports data, we reduced 2025–26 offensive behavior into 31 standardized dimensions, then asked an unsupervised model to find the natural families. No position labels. No efficiency. No “3-and-D.”
          <div className="mt-6 flex flex-wrap gap-2">{['Touch time','Dribbles / touch','Direct touch','Catch & shoot','Double-team','Passes / touch','Kickout pass','Skip pass','Attacking pass','Drives / touch','Isolation','Post','PnR ballhandler','PnR screener','Handoffs','Off-ball cutter','Off-ball screener','3PA share','Pull-up share','Rim shot share'].map(x=><span key={x} className="rounded-full border border-black/10 bg-white/30 px-2.5 py-2 text-[10px]">{x}</span>)}</div>
        </StoryScene>
        <StoryScene id="clusters" dwell="long" eyebrow="EIGHT ARCHETYPES EMERGE" title="Eight discrete styles emerge from the noise.">
          Each constellation is a learned offensive style. Open a cluster to meet its most typical members.
          <div className="mt-5 grid grid-cols-2 gap-2 max-sm:grid-cols-1">{clusters.map(c=><button key={c.id} onClick={()=>pickCluster(c.id)} className="grid grid-cols-[28px_1fr] items-center gap-x-2 rounded-lg border border-black/10 bg-white/20 p-2.5 text-left"><b className="row-span-2 font-serif text-2xl">{c.id}</b><span className="text-[11px] font-bold">{c.name}</span><small className="text-[9px] text-muted">{c.count} players</small></button>)}</div>
        </StoryScene>
        <StoryScene id="unicorn" eyebrow="THE HIDDEN UNICORN" title="Then we ask who still doesn’t fit.">
          A player is unusual only if even his nearest archetype is far away. The official score blends global uniqueness with how unusual the player is inside his own archetype. Rankings require at least {HIDDEN_UNICORN_MIN_TOUCHES.toLocaleString()} touches.
          <div className="mt-4 border-t border-black/10">{highSampleUnicorns.map((p,i)=><button key={p.name} onClick={()=>pickPlayer(p)} className="grid w-full grid-cols-[32px_1fr] items-center border-b border-black/10 py-[7px] text-left"><span className="text-[9px] text-muted">{String(i+1).padStart(2,'0')}</span><strong className="font-serif text-[14px]">{p.name}</strong></button>)}</div>
        </StoryScene>
        <StoryScene id="explore" eyebrow="EXPLORE" title="Open a cluster. Search for a name.">
          Prototype at the center. Hidden unicorns at the edge. Open a constellation for its Top 10 roster, or search to see where the model puts a player.
          <div className="relative mt-8">
            <label className="mb-2 block text-[9px] font-extrabold tracking-[.15em]">FIND A PLAYER</label>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try Jokic, Curry, Draymond…" className="w-full rounded-xl border border-black/10 bg-white/40 p-4 text-lg outline-none"/>
            {matches.length>0&&(
              <div className="absolute left-0 right-0 top-[74px] z-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
                {matches.map(p=>(
                  <button
                    key={p.name}
                    onClick={()=>{pickPlayer(p);setQuery('')}}
                    className="flex w-full items-center gap-3 border-b border-black/10 p-2.5 text-left last:border-0 hover:bg-black/[.03]"
                  >
                    <PlayerPhoto name={p.name} size={40}/>
                    <span className="min-w-0 flex-1 font-medium">{p.name}</span>
                    <span className="shrink-0 text-[9px] text-muted">{clusters[p.cluster-1].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </StoryScene>
      </article>
    </div>

    <MethodologyAppendix />
    <footer className="flex justify-between px-[4vw] py-8 text-[10px] tracking-[.1em]"><strong>THE HIDDEN UNICORN</strong><span className="text-muted">Next.js interactive draft · offensive model only</span></footer>
  </main>
}

const ARCHETYPE_NAMES = [
  'Hybrid Interior Hubs',
  'Low-Dribble Connective Frontcourt',
  'Movement / Off-Ball Scorers',
  'Connective Slashers',
  'Rim-Running Screen Bigs',
  'Primary Shot Creators',
  'Perimeter Organizers',
  'Drive-First Lead Creators',
] as const

const FEATURE_FAMILIES = [
  'Touch profile',
  'Passing',
  'Driving',
  'Isolation / post',
  'Pick-and-roll',
  'Handoffs / off-ball',
  'Shooting profile',
] as const

function MethodologyAppendix(){
  return (
    <section className="bg-ink px-[8vw] py-[12vw] text-paper">
      <span className="eyebrow">METHOD</span>
      <h2 className="mt-4 font-serif text-[clamp(38px,5vw,74px)] leading-none tracking-[-.035em]">Style, not quality.</h2>
      <p className="mt-6 max-w-[800px] font-serif text-[21px] leading-8">
        The offensive model describes how a player plays — not how efficient or valuable he is.
        Efficiency, makes and misses, points, turnover rate, qSQ, qSP and other outcome metrics
        are excluded. Position labels are excluded. The conceptual flow is:
      </p>
      <p className="mt-5 max-w-[900px] font-serif text-[17px] leading-7 text-zinc-300">
        31D behavior → K-means clusters → archetype centroids → centroid distance → global + archetype-relative uniqueness → Hidden Unicorn Score
      </p>

      <div className="mt-16 grid grid-cols-4 border-t border-white/20 max-sm:grid-cols-2">
        {[
          ['473', 'players (≥250 touches)'],
          ['31', 'behavioral features'],
          ['8', 'learned archetypes'],
          ['1,000', 'touches to rank'],
        ].map(([v, l]) => (
          <div key={l} className="flex flex-col border-r border-white/20 p-5 last:border-r-0 max-sm:odd:border-r max-sm:[&:nth-child(2)]:border-r-0">
            <b className="font-serif text-4xl">{v}</b>
            <span className="text-[10px] uppercase tracking-[.12em] text-zinc-500">{l}</span>
          </div>
        ))}
      </div>

      <div className="mt-20 grid max-w-[1100px] gap-16 lg:grid-cols-2">
        <MethodBlock title="Model cohort">
          <p>
            Season: <em className="not-italic text-paper">2025–26 regular season</em>.
            Offensive style model cohort: <em className="not-italic text-paper">473 players</em> with at least 250 touches.
            Official Hidden Unicorn ranking eligibility requires <em className="not-italic text-paper">1,000 touches</em>.
            Players below that threshold remain visible on the map but are not eligible for the official ranking.
          </p>
        </MethodBlock>

        <MethodBlock title="Feature space">
          <p>
            The model uses 31 standardized behavioral features describing touch profile, passing,
            driving, isolation/post, pick-and-roll, handoffs/off-ball actions, and shooting profile.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {FEATURE_FAMILIES.map((f) => (
              <li key={f} className="rounded-full border border-white/15 px-2.5 py-1.5 text-[10px] tracking-wide text-zinc-300">{f}</li>
            ))}
          </ul>
        </MethodBlock>

        <MethodBlock title="Preprocessing">
          <p>
            Each feature was winsorized at the cohort 1st and 99th percentiles, then standardized to z-scores.
            Appropriate missing action-family values were treated as zero.
          </p>
        </MethodBlock>

        <MethodBlock title="Clustering">
          <p>
            Algorithm: K-means. Final model: <em className="not-italic text-paper">K = 8</em>.
            We tested K = 6, 8, and 10. K = 6 produced somewhat cleaner statistical separation but basketball roles were too broad;
            K = 10 became overly fragmented. K = 8 best balanced statistical separation and basketball interpretability.
          </p>
        </MethodBlock>
      </div>

      <MethodBlock title="Archetypes" className="mt-16 max-w-[1100px]">
        <p>
          Each archetype is a centroid in the standardized 31-dimensional feature space.
          Labels were assigned after clustering from the strongest behavioral characteristics of each centroid —
          descriptive names, not rules or model inputs.
        </p>
        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {ARCHETYPE_NAMES.map((name, i) => (
            <li key={name} className="grid grid-cols-[2rem_1fr] items-baseline gap-2 border-t border-white/10 py-2.5">
              <span className="font-serif text-xl text-zinc-500">{i + 1}</span>
              <span className="text-[14px] font-medium">{name}</span>
            </li>
          ))}
        </ol>
      </MethodBlock>

      <div className="mt-16 grid max-w-[1100px] gap-16 lg:grid-cols-2">
        <MethodBlock title="Prototype / archetype fit">
          <p>
            A player’s archetype is the cluster whose centroid he was assigned to by K-means.
            <em className="not-italic text-paper"> distanceToCentroid</em> is the Euclidean distance between his
            31D standardized feature vector and that centroid. Smaller distance = more prototypical;
            larger = less typical. The prototype is the player with the smallest assigned-centroid distance.
          </p>
          <p className="mt-4 text-zinc-400">
            In an isolated archetype view, “Top 10 in Archetype” means the 10 most prototypical players,
            sorted ascending by distanceToCentroid — not by Hidden Unicorn Score.
          </p>
        </MethodBlock>

        <MethodBlock title="Absolute uniqueness">
          <p>
            Among players with at least 1,000 touches, convert distanceToCentroid into a global percentile:
            <em className="not-italic text-paper"> rawPercentile</em>.
            Higher percentile = farther from the nearest archetype in absolute 31D space.
          </p>
        </MethodBlock>

        <MethodBlock title="Archetype-relative uniqueness">
          <p>
            Different archetypes have different natural dispersion. Among eligible players in the same cluster,
            convert distanceToCentroid into <em className="not-italic text-paper">clusterPercentile</em>.
            Higher = more unusual compared with other players in the same archetype.
            This avoids automatically favoring players assigned to broader clusters.
          </p>
        </MethodBlock>

        <MethodBlock title="Official Hidden Unicorn Score">
          <p className="font-mono text-[13px] leading-6 text-zinc-200">
            hiddenUnicornScore =<br />
            &nbsp;&nbsp;0.70 × rawPercentile +<br />
            &nbsp;&nbsp;0.30 × clusterPercentile
          </p>
          <p className="mt-4">
            70% preserves the core question — how far is this player from the closest archetype league-wide?
            30% adjusts for archetypes that are naturally wider or tighter.
            No traditional-position normalization. No forced equal representation across archetypes.
          </p>
          <p className="mt-4 text-zinc-400">
            Official ranking: filter to ≥1,000 touches, sort descending by hiddenUnicornScore.
          </p>
        </MethodBlock>
      </div>

      <MethodBlock title="Visualization vs. model" className="mt-16 max-w-[1100px]">
        <p>
          The model operates in 31 dimensions. The visualization is not the model.
          In isolated archetype mode, cluster center = archetype centroid and radius = actual distanceToCentroid.
          Angle may be used only for layout or collision avoidance.
          Do not use hiddenUnicornScore, percentile rank, or a 2D embedding to set radial position.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="border border-white/15 p-4">
            <span className="block text-[10px] uppercase tracking-[.14em] text-zinc-500">Radial position</span>
            <strong className="mt-1 block text-[15px]">Raw 31D centroid distance</strong>
          </div>
          <div className="border border-white/15 p-4">
            <span className="block text-[10px] uppercase tracking-[.14em] text-zinc-500">Hidden Unicorn ranking</span>
            <strong className="mt-1 block text-[15px]">70 / 30 hybrid percentile score</strong>
          </div>
        </div>
        <p className="mt-4 text-zinc-400">These are intentionally different.</p>
      </MethodBlock>

      <div className="mt-16 grid max-w-[1100px] gap-16 lg:grid-cols-2">
        <MethodBlock title="Sample-size treatment">
          <p>
            All model players remain visible. Opacity represents touch sample only — not uniqueness.
            A low-opacity player can still sit extremely far from a centroid; low opacity means lower sample confidence.
            Players below 1,000 touches must not appear in the official Hidden Unicorn Top 10.
          </p>
          <p className="mt-4 text-[12px] tracking-wide text-zinc-400">
            Opacity = sample size · Official ranking requires ≥1,000 touches
          </p>
        </MethodBlock>

        <MethodBlock title="Terminology">
          <dl className="space-y-3 text-[15px] leading-6">
            <div>
              <dt className="font-semibold text-paper">Prototype</dt>
              <dd className="text-zinc-400">Closest player to an archetype centroid.</dd>
            </div>
            <div>
              <dt className="font-semibold text-paper">Typical member</dt>
              <dd className="text-zinc-400">Relatively close to his assigned centroid.</dd>
            </div>
            <div>
              <dt className="font-semibold text-paper">Archetype edge case</dt>
              <dd className="text-zinc-400">Farther from the centroid but still assigned to it.</dd>
            </div>
            <div>
              <dt className="font-semibold text-paper">Hybrid</dt>
              <dd className="text-zinc-400">Similarly close to multiple archetypes — conceptually different from a Hidden Unicorn.</dd>
            </div>
            <div>
              <dt className="font-semibold text-paper">Hidden Unicorn</dt>
              <dd className="text-zinc-400">Unusually far from even the closest available archetype.</dd>
            </div>
          </dl>
        </MethodBlock>
      </div>

      <MethodBlock title="Limitations" className="mt-16 max-w-[1100px]">
        <ul className="space-y-2.5 text-[15px] leading-7 text-zinc-300">
          <li>K-means is a centroid-based clustering method.</li>
          <li>Euclidean distance on standardized features effectively gives each feature equal dimensional weight.</li>
          <li>Correlated features can influence model geometry.</li>
          <li>Team scheme, roster role, and opportunity influence observed behavior.</li>
          <li>Archetypes describe style, not player quality.</li>
          <li>A player’s archetype can change from season to season.</li>
          <li>Cluster names are human interpretations of machine-discovered behavioral groups.</li>
          <li>Some archetypes are naturally broader than others — hence the 30% within-archetype adjustment in the headline score.</li>
        </ul>
      </MethodBlock>

      <div className="mt-20 max-w-[900px] border-t border-white/20 pt-10">
        <span className="eyebrow">CORE SUMMARY</span>
        <dl className="mt-6 grid gap-x-10 gap-y-3 text-[14px] leading-6 sm:grid-cols-[auto_1fr]">
          {[
            ['Season', '2025–26 regular season'],
            ['Model', 'K-means'],
            ['K', '8'],
            ['Cohort', '473 players, ≥250 touches'],
            ['Inputs', '31 offensive behavioral features'],
            ['Preprocessing', 'p1/p99 winsorization + z-score standardization'],
            ['Positions', 'Excluded from model inputs'],
            ['Efficiency / outcomes', 'Excluded'],
            ['Archetype fit', 'Euclidean distance to assigned centroid'],
            ['Eligibility', '≥1,000 touches'],
            ['Hidden Unicorn Score', '70% global raw-distance percentile + 30% within-archetype distance percentile'],
          ].map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-zinc-500">{k}</dt>
              <dd className="text-zinc-200 sm:border-b sm:border-white/10 sm:pb-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function MethodBlock({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}){
  return (
    <div className={className}>
      <h3 className="text-[11px] font-extrabold uppercase tracking-[.16em] text-zinc-500">{title}</h3>
      <div className="mt-3 font-serif text-[17px] leading-7 text-zinc-300">{children}</div>
    </div>
  )
}

function StoryScene({id,eyebrow,title,children,dwell='default'}:{id:string;eyebrow:string;title:string;children:React.ReactNode;dwell?:'default'|'long'}){
  // Longer dwell = more scroll runway while sticky copy stays put (clusters need time to read + click).
  const height = dwell==='long'
    ? 'relative min-h-[420vh] max-[900px]:min-h-[320vh]'
    : 'relative min-h-[260vh] max-[900px]:min-h-[200vh]'
  return (
    <section data-scene={id} className={height}>
      <div className="sticky top-6 flex min-h-[calc(100vh-3rem)] flex-col justify-center py-10 max-[900px]:top-[calc(60vh+0.75rem)] max-[900px]:min-h-0 max-[900px]:justify-start max-[900px]:py-5">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="my-4 font-serif text-[clamp(38px,5vw,74px)] leading-[.96] tracking-[-.035em]">{title}</h2>
        <div className="max-w-[520px] font-serif text-[19px] leading-[1.58]">{children}</div>
      </div>
    </section>
  )
}

function DetailPanel({selected,activeCluster,onPlayer}:{selected:Player|null;activeCluster:number|null;onPlayer:(p:Player)=>void}){
  const c=selected?clusters[selected.cluster-1]:activeCluster?clusters[activeCluster-1]:null
  const prototype=activeCluster?players.find(p=>p.cluster===activeCluster&&p.prototype):null
  const unicorn=activeCluster
    ? [...players]
        .filter(p=>p.cluster===activeCluster && isHiddenUnicornEligible(p))
        .sort((a,b)=>b.hiddenUnicornScore - a.hiddenUnicornScore)[0]
    : null
  // Player profile lives inside the galaxy frame; keep this panel for archetype-only focus.
  if (selected || !(activeCluster && c)) return null

  return (
    <div className="mt-3 bg-paper max-[900px]:hidden">
      <AnimatePresence mode="wait">
        <motion.div key={`c-${activeCluster}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="border-t border-black/10 pt-5">
          <span className="eyebrow">ARCHETYPE {c.id}</span>
          <h3 className="mt-1 font-serif text-3xl">{c.name}</h3>
          <p className="mt-2 font-serif leading-6">{c.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={()=>prototype&&onPlayer(prototype)} className="rounded-xl border border-black/10 p-3 text-left">
              <span className="block text-[8px] tracking-widest text-muted">PUREST EXAMPLE</span>
              <b className="my-1 block text-xs">{prototype?.name||'—'}</b>
              <small className="text-[10px] text-muted">closest to center</small>
            </button>
            <button onClick={()=>unicorn&&onPlayer(unicorn)} className="rounded-xl border border-black/10 p-3 text-left">
              <span className="block text-[8px] tracking-widest text-muted">TOP HIDDEN UNICORN</span>
              <b className="my-1 block text-xs">{unicorn?.name||'—'}</b>
              <small className="text-[10px] text-muted">{unicorn?`score ${unicorn.hiddenUnicornScore.toFixed(1)}`:'—'}</small>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
