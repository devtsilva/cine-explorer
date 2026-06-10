import { useState, useCallback } from 'react'
import type { Movie } from '../types/tmdb'

const KEY = 'cine-favorites'

function load(): Movie[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(load)

  const toggle = useCallback((movie: Movie) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === movie.id)
      const next = exists ? prev.filter(f => f.id !== movie.id) : [...prev, movie]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.some(f => f.id === id),
    [favorites]
  )

  return { favorites, toggle, isFavorite }
}
