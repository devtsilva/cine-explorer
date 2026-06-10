import { useEffect, useState } from 'react'
import { tmdb, IMAGE_BASE } from '../../services/tmdb'
import { FavoriteButton } from '../FavoriteButton/FavoriteButton'
import type { Movie, MovieDetail, Video } from '../../types/tmdb'
import './MovieModal.css'

interface Props {
  movie: Movie | null
  onClose: () => void
}

const PLACEHOLDER = 'https://via.placeholder.com/780x439/1a1a2e/ffffff?text=Sem+Imagem'

export function MovieModal({ movie, onClose }: Props) {
  const [detail, setDetail] = useState<MovieDetail | null>(null)
  const [trailer, setTrailer] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    if (!movie) return
    setDetail(null)
    setTrailer(null)
    setShowTrailer(false)
    setLoading(true)

    const type = movie.media_type === 'tv' ? 'tv' : 'movie'
    const detailReq = type === 'tv' ? tmdb.getTvDetail(movie.id) : tmdb.getMovieDetail(movie.id)

    Promise.all([detailReq, tmdb.getMovieVideos(movie.id, type)])
      .then(([dRes, vRes]) => {
        setDetail(dRes.data)
        const official = vRes.data.results.find(
          v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
        ) ?? vRes.data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
        setTrailer(official ?? null)
      })
      .finally(() => setLoading(false))
  }, [movie])

  useEffect(() => {
    if (!movie) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [movie, onClose])

  if (!movie) return null

  const title = movie.title ?? movie.name ?? ''
  const backdrop = movie.backdrop_path
    ? `${IMAGE_BASE}/w780${movie.backdrop_path}`
    : PLACEHOLDER

  const genres = detail?.genres?.map(g => g.name).join(', ') ?? ''
  const runtime = detail?.runtime ? `${detail.runtime} min` : detail?.number_of_seasons ? `${detail.number_of_seasons} temporada${detail.number_of_seasons > 1 ? 's' : ''}` : ''
  const score = (Math.round(movie.vote_average * 10) / 10).toFixed(1)

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal__backdrop-wrap">
          {showTrailer && trailer ? (
            <iframe
              className="modal__trailer"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={`Trailer: ${title}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <>
              <img src={backdrop} alt={title} className="modal__backdrop" />
              {trailer && (
                <button className="modal__play-btn" onClick={() => setShowTrailer(true)} aria-label="Assistir trailer">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Ver trailer</span>
                </button>
              )}
            </>
          )}
          <div className="modal__fav-wrap">
            <FavoriteButton movie={movie} />
          </div>
        </div>

        <div className="modal__body">
          {loading ? (
            <div className="modal__loading" aria-live="polite">Carregando...</div>
          ) : (
            <>
              <div className="modal__header">
                <div>
                  <h2 className="modal__title">{title}</h2>
                  <div className="modal__meta">
                    {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}
                    {runtime && <><span className="modal__dot">·</span>{runtime}</>}
                    {genres && <><span className="modal__dot">·</span>{genres}</>}
                  </div>
                </div>
                {movie.vote_count > 0 && (
                  <div className="modal__score">
                    <span className="modal__score-value">★ {score}</span>
                    <span className="modal__score-count">{movie.vote_count.toLocaleString()} votos</span>
                  </div>
                )}
              </div>

              {detail?.tagline && (
                <p className="modal__tagline">"{detail.tagline}"</p>
              )}

              {movie.overview && (
                <p className="modal__overview">{movie.overview}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
