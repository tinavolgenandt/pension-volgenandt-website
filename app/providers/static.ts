import { joinURL, withQuery } from 'ufo'
import { hasImageVariants, variantPath, variantWidthFor } from '../utils/imageVariants'

/**
 * Pass-through image provider that prepends app.baseURL.
 * Like "none" but adds the base path for GitHub Pages subpath deployments.
 *
 * Nuxt Image calls the default export (a factory function) which returns
 * an object with getImage(). The ctx.options.nuxt.baseURL is populated
 * from NUXT_APP_BASE_URL at build time.
 *
 * In production, a width modifier on a local /img/*.webp maps to a
 * pre-generated variant (see modules/image-variants.ts), so phones download
 * a downscaled file instead of the full image. Widths above the largest
 * variant, dev mode and other files fall back to width/height query params
 * on the original: the server ignores them, but Nuxt Image still sees
 * distinct URLs and emits a valid srcset like `img.webp?w=640 640w`.
 * Without this, Nuxt Image collapses all variants into a nonsense
 * `img.webp 1w, img.webp 2w` srcset that Safari iOS renders incorrectly
 * (uses the tiny 1/2 px values as the intrinsic width, breaking layout).
 */
export default () => ({
  getImage(
    src: string,
    { modifiers }: { modifiers?: { width?: number | string; height?: number | string } },
    ctx: { options: { nuxt: { baseURL: string } } },
  ) {
    const width = Number(modifiers?.width) || 0
    const variantWidth = width > 10 ? variantWidthFor(width) : undefined
    if (!import.meta.dev && variantWidth && hasImageVariants(src)) {
      return { url: joinURL(ctx.options.nuxt.baseURL, variantPath(src, variantWidth)) }
    }

    const base = joinURL(ctx.options.nuxt.baseURL, src)
    // Ignore nonsense width modifiers (<= 10 px) that @nuxt/image emits as
    // density fallback when `sizes` is set. They would render as "1w, 2w"
    // srcset entries and break Safari iOS aspect-ratio calculation.
    const height = Number(modifiers?.height) || 0
    const query: Record<string, number | string> = {}
    if (width > 10) query.w = width
    if (height > 10) query.h = height
    return {
      url: Object.keys(query).length ? withQuery(base, query) : base,
    }
  },
})
