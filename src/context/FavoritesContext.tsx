import { createContext, useContext, type ReactNode } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import type { Movie } from '../types/tmdb'

interface FavoritesCtx {
  favorites: Movie[]
  toggle: (movie: Movie) => void
  isFavorite: (id: number) => boolean
}

const Ctx = createContext<FavoritesCtx | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const value = useFavorites()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFavoritesContext() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useFavoritesContext must be inside FavoritesProvider')
  return ctx
}
