export function useScrollHeader(threshold = 50) {
  const isCompressed = ref(false)

  if (import.meta.client) {
    const { y } = useWindowScroll()
    watch(y, (scrollY) => {
      isCompressed.value = scrollY > threshold
    })
  }

  return { isCompressed }
}
