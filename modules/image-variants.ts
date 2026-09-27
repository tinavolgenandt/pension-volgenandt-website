import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import sharp from 'sharp'
import {
  IMAGE_VARIANT_DIR,
  IMAGE_VARIANT_WIDTHS,
  hasImageVariants,
} from '../app/utils/imageVariants'

/**
 * Generates downscaled WebP variants of public/img/** into the build output
 * (never into the repo), so srcset entries point at real, smaller files.
 * Skipped in dev: the image provider serves originals there.
 */
export default defineNuxtModule({
  meta: { name: 'image-variants' },
  setup(_options, nuxt) {
    if (nuxt.options.dev) return
    const logger = useLogger('image-variants')

    nuxt.hook('nitro:build:public-assets', async (nitro) => {
      const imgDir = join(nuxt.options.rootDir, 'public', 'img')
      const outDir = join(nitro.options.output.publicDir, IMAGE_VARIANT_DIR)
      const files = (await readdir(imgDir, { recursive: true }))
        .map((f) => `/img/${f.split(sep).join('/')}`)
        .filter(hasImageVariants)

      const started = Date.now()
      let resized = 0
      const queue = [...files]
      const worker = async () => {
        for (let src = queue.shift(); src; src = queue.shift()) {
          const input = join(nuxt.options.rootDir, 'public', src)
          if (!(await stat(input)).isFile()) continue
          const { width = 0 } = await sharp(input).metadata()
          for (const w of IMAGE_VARIANT_WIDTHS) {
            const output = join(outDir, String(w), src)
            await mkdir(dirname(output), { recursive: true })
            // Narrower originals are copied as-is so every variant path exists
            if (width <= w) {
              await copyFile(input, output)
            } else {
              await sharp(input)
                .resize({ width: w })
                .webp({ quality: 75, effort: 4 })
                .toFile(output)
              resized++
            }
          }
        }
      }
      await Promise.all(Array.from({ length: 4 }, worker))
      logger.success(
        `${files.length} images, ${resized} variants resized into ${relative(nuxt.options.rootDir, outDir)} (${Math.round((Date.now() - started) / 1000)}s)`,
      )
    })
  },
})
