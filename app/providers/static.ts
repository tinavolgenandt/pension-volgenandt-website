import { joinURL } from 'ufo'

/**
 * Pass-through image provider that prepends app.baseURL.
 * Like "none" but adds the base path for GitHub Pages subpath deployments.
 *
 * Nuxt Image calls the default export (a factory function) which returns
 * an object with getImage(). The ctx.options.nuxt.baseURL is populated
 * from NUXT_APP_BASE_URL at build time.
 */
export default () => ({
  getImage(
    src: string,
    _options: Record<string, unknown>,
    ctx: { options: { nuxt: { baseURL: string } } },
  ) {
    return {
      url: joinURL(ctx.options.nuxt.baseURL, src),
    }
  },
})
