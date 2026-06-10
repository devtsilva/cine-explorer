import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { posterUrl, getTitle, getReleaseYear, scoreLabel } from '../../services/tmdb'
import { useFavoritesContext } from '../../context/FavoritesContext'
import { useWatchlistContext } from '../../context/WatchlistContext'
import { useToast } from '../../context/ToastContext'
import type { Movie } from '../../types/tmdb'
import './MovieCard.css'

interface Props {
  movie: Movie
  index?: number
}

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect width="300" height="450" fill="%231a1a28"/%3E%3Ctext x="150" y="225" text-anchor="middle" fill="%2360607a" font-size="14" font-family="sans-serif"%3ESem poster%3C/text%3E%3C/svg%3E'

export function MovieCard({ movie, index = 0 }: Props) {
  const navigate = useNavigate()
  const { toggle: toggleFav, isFavorite } = useFavoritesContext()
  const { toggle: toggleWatch, inWatchlist } = useWatchlistContext()
  const { show } = useToast()

  const fav = isFavorite(movie.id)
  const watched = inWatchlist(movie.id)
  const title = getTitle(movie)
  const year = getReleaseYear(movie)
  const score = movie.vote_average
  const poster = posterUrl(movie.poster_path) ?? PLACEHOLDER
  const type = movie.media_type === 'tv' ? 'Série' : 'Filme'

  function handleClick() {
    const mediaType = movie.media_type ?? 'movie'
    navigate(`/titulo/${mediaType}/${movie.id}`)
  }

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation()
    toggleFav(movie)
    show(fav ? `Removido dos favoritos` : `Adicionado aos favoritos`, fav ? 'info' : 'success')
  }

  function handleWatch(e: React.MouseEvent) {
    e.stopPropagation()
    toggleWatch(movie)
    show(watched ? `Removido da lista` : `Adicionado para assistir depois`, watched ? 'info' : 'success')
  }

  return (
    <motion.article
      className="movie-card"
      onClick={handleClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      role="button"
      tabIndex={0}
      aria-label={`${title} (${year}) — ${type}. Nota: ${score.toFixed(1)}`}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="movie-card__poster-wrap">
        <img src={poster} alt={`Poster de ${title}`} className="movie-card__poster" loading="lazy" />

        <div className="movie-card__gradient" aria-hidden="true" />

        <span className="movie-card__type-badge" aria-hidden="true">{type}</span>

        <div className="movie-card__actions">
          <button
            className={`movie-card__action-btn ${fav ? 'active-fav' : ''}`}
            onClick={handleFav}
            aria-label={fav ? `Remover ${title} dos favoritos` : `Adicionar ${title} aos favoritos`}
            aria-pressed={fav}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>

          <button
            className={`movie-card__action-btn ${watched ? 'active-watch' : ''}`}
            onClick={handleWatch}
            aria-label={watched ? `Remover ${title} da lista` : `Adicionar ${title} para assistir depois`}
            aria-pressed={watched}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M5 3l14 9-14 9V3z"
                fill={watched ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="movie-card__body">
        <h3 className="movie-card__title">{title}</h3>
        <div className="movie-card__meta">
          <span className="movie-card__year">{year || '—'}</span>
          {movie.vote_count > 0 && (
            <span className={`movie-card__score ${scoreLabel(score)}`}>
              ★ {score.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
