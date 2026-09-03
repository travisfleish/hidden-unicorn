// Generate small, face-centered WebP avatars from every headshot.
//
// Two things make the raw headshots look blurry in the UI:
//   1. They're 1040x760 *indexed* (256-color) PNGs. Letting the browser downscale
//      that ~15x in one pass for a 40-48px slot smears the palette dithering.
//   2. They're head-and-shoulders framed. Dropped into a ~48px circle with
//      object-cover, the actual face ends up ~26px tall - tiny, regardless of
//      resampling quality.
//
// So we pre-crop to a square centered on the face and resize with sharp
// (Lanczos3) at roughly the sizes we actually display. The face then fills the
// avatar and the browser draws it near 1:1.
//
// Outputs:  public/headshots/r{96,160,320}/<id>.webp   (square)
// Run:      node scripts/resize-headshots.mjs [--force]

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const REPO = fileURLToPath(new URL('..', import.meta.url))
const SRC_DIR = path.join(REPO, 'public/headshots')
const SIZES = [96, 160, 320] // 96 for non-retina, 160 for 2x, 320 for the 3x / largest card photo
const FORCE = process.argv.includes('--force')

// NBA.com headshots are studio-standardized: subject centered, head near the top.
// A square this tall, centered horizontally, frames head + a sliver of shoulder
// for every player without clipping.
const CROP_H_FRAC = 0.74 // square side as a fraction of the 760px source height
const CROP_TOP_FRAC = 0.02 // top offset as a fraction of source height

const ids = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /^\d+\.png$/.test(f))
  .map((f) => f.replace('.png', ''))

if (!ids.length) {
  console.error('no source PNGs in', SRC_DIR, '- run scripts/pull-headshots.mjs first')
  process.exit(1)
}

for (const s of SIZES) fs.mkdirSync(path.join(SRC_DIR, `r${s}`), { recursive: true })

let made = 0
let skipped = 0
const failed = []

await Promise.all(
  ids.map(async (id) => {
    const src = path.join(SRC_DIR, `${id}.png`)
    let box
    try {
      const { width = 1040, height = 760 } = await sharp(src).metadata()
      const side = Math.min(width, Math.round(height * CROP_H_FRAC))
      box = {
        left: Math.max(0, Math.round((width - side) / 2)),
        top: Math.max(0, Math.round(height * CROP_TOP_FRAC)),
        width: side,
        height: side,
      }
    } catch (e) {
      failed.push(`${id}: metadata ${e.message}`)
      return
    }

    for (const s of SIZES) {
      const dest = path.join(SRC_DIR, `r${s}`, `${id}.webp`)
      if (!FORCE && fs.existsSync(dest)) {
        skipped++
        continue
      }
      try {
        await sharp(src)
          .extract(box)
          .resize(s, s, { kernel: 'lanczos3' })
          .webp({ quality: 90, effort: 4 })
          .toFile(dest)
        made++
      } catch (e) {
        failed.push(`${id}@${s}: ${e.message}`)
      }
    }
  }),
)

console.log(`headshot avatars: ${made} written, ${skipped} up to date, ${failed.length} failed`)
if (failed.length) {
  console.log(failed.join('\n'))
  process.exit(1)
}
