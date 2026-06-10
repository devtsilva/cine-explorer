import { useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll(onLoadMore: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const observe = useCallback(() => {
    const el = sentinelRef.current
    if (!el || !enabled) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onLoadMore, enabled])

  useEffect(() => {
    const cleanup = observe()
    return cleanup
  }, [observe])

  return sentinelRef
}
