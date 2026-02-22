import { useElementVisibility } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

export function useScrollReveal(target: MaybeComputedElementRef) {
  const isVisible = useElementVisibility(target, {
    threshold: 0.15,
    once: true,
  })

  return { isVisible }
}
