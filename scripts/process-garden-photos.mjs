import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const BASE = 'static/img'
const OUT = 'static/img/garten'
const MAX_WIDTH = 1800

const jobs = [
  {
    src: `${BASE}/Grundstück und direkte Umgebung/PXL_20241227_074606398.jpg`,
    out: `${OUT}/garten-sonnenaufgang-einfahrt.jpg`,
    label: 'Sunrise over courtyard',
  },
  {
    src: `${BASE}/Grundstück und direkte Umgebung/P1010869.JPG`,
    out: `${OUT}/umgebung-pension-kornfeld.jpg`,
    label: 'Pension in summer landscape',
  },
  {
    src: `${BASE}/Grundstück und direkte Umgebung/20240511_161018.jpg`,
    out: `${OUT}/umgebung-wiese-pusteblumen.jpg`,
    label: 'Spring meadow',
  },
  {
    src: `${BASE}/Grundstück und direkte Umgebung/IMG_1593.JPG`,
    out: `${OUT}/garten-biotop-schilf.jpg`,
    label: 'Natural pond / biotope',
  },
  {
    src: `${BASE}/Garten.JPG`,
    out: `${OUT}/garten-apfelbaum-blumen.jpg`,
    label: 'Apple tree with flowers',
  },
  {
    src: `${BASE}/Grundstück und direkte Umgebung/IMAG0038.jpg`,
    out: `${OUT}/garten-laube-herbst.jpg`,
    label: 'Autumn garden with gazebo',
  },
  {
    src: `${BASE}/Grundstück und direkte Umgebung/PXL_20250823_175930148.jpg`,
    out: `${OUT}/umgebung-felder-abendsonne.jpg`,
    label: 'Evening fields view',
  },
  {
    src: `${BASE}/Winter.JPG`,
    out: `${OUT}/pension-winter-schnee.jpg`,
    label: 'Pension in snow',
  },
]

if (!existsSync(OUT)) {
  await mkdir(OUT, { recursive: true })
  console.log(`Created: ${OUT}`)
}

for (const { src, out, label } of jobs) {
  try {
    const info = await sharp(src)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .withMetadata({ exif: {} })
      .toFile(out)

    const kb = Math.round(info.size / 1024)
    console.log(`✓ ${label}: ${info.width}x${info.height} — ${kb} KB → ${path.basename(out)}`)
  } catch (err) {
    console.error(`✗ ${label}: ${err.message}`)
  }
}
