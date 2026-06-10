import { useState, useCallback } from 'react'
import type { Movie } from '../types/tmdb'

const KEY = 'cine-watchlist'

function load(): Movie[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>(load)

  const toggle = useCallback((movie: Movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id)
      const next = exists ? prev.filter(m => m.id !== movie.id) : [...prev, movie]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const inWatchlist = useCallback(
    (id: number) => watchlist.some(m => m.id === id),
    [watchlist]
  )

  return { watchlist, toggle, inWatchlist }
}
