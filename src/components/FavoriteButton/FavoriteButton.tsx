import { useFavoritesContext } from '../../context/FavoritesContext'
import type { Movie } from '../../types/tmdb'
import './FavoriteButton.css'

interface Props {
  movie: Movie
}

export function FavoriteButton({ movie }: Props) {
  const { toggle, isFavorite } = useFavoritesContext()
  const active = isFavorite(movie.id)

  return (
    <button
      className={`fav-btn ${active ? 'fav-btn--active' : ''}`}
      onClick={e => {
        e.stopPropagation()
        toggle(movie)
      }}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </button>
  )
}
