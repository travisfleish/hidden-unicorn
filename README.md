# The Hidden Unicorns

Interactive NBA offensive archetype story built with **Next.js, TypeScript, Tailwind CSS, Framer Motion, and D3**.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

The app is Vercel-ready and currently uses static model data, so no environment variables are required.

## What this draft contains

- Scrollytelling editorial experience
- 473-player / 8-archetype galaxy visualization
- Clickable archetypes and player profiles
- Archetype prototype vs. farthest high-sample member
- Offensive Hidden Unicorn reveal
- Player search
- Real offensive cluster assignments / uniqueness percentiles for named players
- Framer Motion transitions
- D3 scale used in the visualization layout

## Data / methodology note

The actual uniqueness scores are based on distance in the full 31-dimensional standardized offensive feature space. The current 2D galaxy positions are a **schematic visualization**, not a PCA/UMAP embedding. A logical next step is to export a real 2D projection for all 473 players and replace the schematic coordinates.

The current project is intentionally offense-only. Defense and two-way modes should be added only after the defensive feature model is finalized.
