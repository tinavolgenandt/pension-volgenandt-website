/**
 * Reads the ad click marker of the first page (see useAdArrival). Only once the whole page is hydrated: the links the
 * server rendered with referer=Website must be hydrated as they are and then updated by Vue. Set earlier, Vue sees
 * a mismatch during hydration and keeps the server's link.
 */
export default defineNuxtPlugin(() => {
  onNuxtReady(() => markAdArrival(window.location.search))
})
