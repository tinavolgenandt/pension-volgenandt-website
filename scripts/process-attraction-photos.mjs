import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const BASE = 'static/img'
const OUT = 'static/img/attractions'
const MAX_WIDTH = 1800

const jobs = [
  // Hero images for attraction pages
  {
    src: `${BASE}/Bärenpark/20250420_160454.jpg`,
    out: `${OUT}/baerenpark-worbis-baer-fruehling.jpg`,
    label: 'Bärenpark hero',
  },
  {
    src: `${BASE}/Baumwipfelpfad/PXL_20250824_110551701.jpg`,
    out: `${OUT}/baumkronenpfad-hainich-aussicht-turm.jpg`,
    label: 'Baumkronenpfad hero',
  },
  {
    src: `${BASE}/Hanstein.jpeg`,
    out: `${OUT}/burg-hanstein-ruine-weg.jpg`,
    label: 'Burg Hanstein hero',
  },
  {
    src: `${BASE}/Scharfenstein/PICT0701.JPG`,
    out: `${OUT}/burg-scharfenstein-gebaeude.jpg`,
    label: 'Burg Scharfenstein hero',
  },
  {
    src: `${BASE}/Sonnenstein/20241227_133549.jpg`,
    out: `${OUT}/skywalk-sonnenstein-holzriese-panorama.jpg`,
    label: 'Sonnenstein/Skywalk hero',
  },
  {
    src: `${BASE}/Seeburger See/PXL_20250821_121744752.jpg`,
    out: `${OUT}/seeburger-see-seerosen.jpg`,
    label: 'Seeburger See hero',
  },
  {
    src: `${BASE}/Wartburg/PICT0671.JPG`,
    out: `${OUT}/wartburg-burg-eisenach.jpg`,
    label: 'Wartburg hero',
  },
  {
    src: `${BASE}/Heiligenstadt/20240818_123516.jpg`,
    out: `${OUT}/heiligenstadt-stmarien-klostergarten.jpg`,
    label: 'Heiligenstadt hero',
  },
  // Gallery image (sideways — needs auto-rotation)
  {
    src: `${BASE}/Heiligenstadt/20240818_140555.jpg`,
    out: `${OUT}/heiligenstadt-regentrude-skulptur.jpg`,
    label: 'Heiligenstadt Regentrude gallery',
  },
  // Eiscafé San Remo
  {
    src: `${BASE}/Worbis.JPG`,
    out: `${OUT}/eiscafe-san-remo-worbis-kirche.jpg`,
    label: 'Eiscafé San Remo / Worbis church',
  },
]

if (!existsSync(OUT)) {
  await mkdir(OUT, { recursive: true })
  console.log(`Created: ${OUT}`)
}

for (const { src, out, label } of jobs) {
  try {
    const info = await sharp(src)
      .rotate() // auto-rotate from EXIF orientation, then strips EXIF
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .withMetadata({ exif: {} }) // strip all EXIF including GPS
      .toFile(out)

    const kb = Math.round(info.size / 1024)
    console.log(`✓ ${label}: ${info.width}x${info.height} — ${kb} KB → ${path.basename(out)}`)
  } catch (err) {
    console.error(`✗ ${label}: ${err.message}`)
  }
}
