/**
 * Responsive image variants for the static site.
 *
 * GitHub Pages can't resize images on request, so modules/image-variants.ts
 * pre-generates downscaled copies of every /img/*.webp at build time and the
 * `static` image provider points srcset entries at them. A requested width is
 * rounded up to the next ladder step; anything wider gets the original file.
 */
export const IMAGE_VARIANT_WIDTHS = [480, 800, 1280] as const

export const IMAGE_VARIANT_DIR = '_img'

/** Only local WebP images under /img/ get variants */
export function hasImageVariants(src: string): boolean {
  return src.startsWith('/img/') && src.endsWith('.webp') && !src.startsWith('/img/source-uploads/')
}

/** Ladder width to serve for a requested width, or undefined for the original */
export function variantWidthFor(width: number): number | undefined {
  return IMAGE_VARIANT_WIDTHS.find((w) => w >= width)
}

/** Public path of a variant, e.g. /_img/800/img/garten/foo.webp */
export function variantPath(src: string, width: number): string {
  return `/${IMAGE_VARIANT_DIR}/${width}${src}`
}
