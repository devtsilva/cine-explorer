import { MovieCard } from '../MovieCard/MovieCard'
import { SkeletonCard } from '../SkeletonCard/SkeletonCard'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import type { Movie } from '../../types/tmdb'
import './MovieGrid.css'

interface Props {
  movies: Movie[]
  loading: boolean
  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  emptyMessage?: string
  emptyIcon?: string
}

const SKELETONS = Array.from({ length: 20 }, (_, i) => i)

export function MovieGrid({
  movies, loading, loadingMore, hasMore, onLoadMore,
  emptyMessage = 'Nenhum resultado encontrado.',
  emptyIcon = '🎬',
}: Props) {
  const sentinelRef = useInfiniteScroll(
    onLoadMore ?? (() => {}),
    !!(hasMore && !loadingMore && onLoadMore)
  )

  if (loading) {
    return (
      <div className="movie-grid" aria-busy="true" aria-label="Carregando filmes">
        {SKELETONS.map(i => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!movies.length) {
    return (
      <div className="movie-grid__empty" role="status">
        <span className="movie-grid__empty-icon" aria-hidden="true">{emptyIcon}</span>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="movie-grid" role="list" aria-label="Lista de filmes">
        {movies.map((m, i) => (
          <div key={`${m.id}-${i}`} role="listitem">
            <MovieCard movie={m} index={i} />
          </div>
        ))}
      </div>

      {loadingMore && (
        <div className="movie-grid movie-grid--more" aria-busy="true" aria-label="Carregando mais filmes">
          {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
    </>
  )
}
