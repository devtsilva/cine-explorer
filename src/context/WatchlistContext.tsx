import { createContext, useContext, type ReactNode } from 'react'
import { useWatchlist } from '../hooks/useWatchlist'
import type { Movie } from '../types/tmdb'

interface WatchlistCtx {
  watchlist: Movie[]
  toggle: (movie: Movie) => void
  inWatchlist: (id: number) => boolean
}

const Ctx = createContext<WatchlistCtx | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const value = useWatchlist()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWatchlistContext() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWatchlistContext must be inside WatchlistProvider')
  return ctx
}
