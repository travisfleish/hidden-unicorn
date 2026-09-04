'use client'

import { useEffect, useState } from 'react'

// Every jump target, in document order — the hero, all five sticky story
// beats, then the two closing sections.
const SECTIONS = [
  { id: 'top', label: 'Top' },
  { id: 'intro', label: 'Old definition' },
  { id: 'model', label: 'The model' },
  { id: 'clusters', label: 'Eight archetypes' },
  { id: 'unicorn', label: 'Hidden unicorns' },
  { id: 'explore', label: 'Explore' },
  { id: 'roster-dna', label: 'Roster DNA' },
  { id: 'method', label: 'Method' },
] as const

export default function FloatingNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    // A section is "active" once its top has crossed the 40% focus line — the
    // same idea the story uses to hand the sticky column to the next beat.
    const pick = () => {
      const line = window.innerHeight * 0.4
      let best: string = SECTIONS[0].id
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - line <= 0) best = id
      }
      setActive(best)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
    }
  }, [])

  return (
    <nav
      aria-label="Jump to section"
      className="fixed left-1/2 top-3 z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-x-auto rounded-full border border-black/10 bg-paper/80 px-1.5 py-1.5 shadow-[0_18px_50px_rgba(0,0,0,.12)] backdrop-blur-md"
    >
      <ul className="flex items-center gap-0.5">
        {SECTIONS.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(s.id)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[.14em] transition-colors ${
                  isActive ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    isActive ? 'bg-hot' : 'bg-black/20'
                  }`}
                />
                {s.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
