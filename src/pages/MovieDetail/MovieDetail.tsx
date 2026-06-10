import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  tmdb, backdropUrl, posterUrl, formatRuntime,
  formatMoney, getTitle, getReleaseYear, scoreLabel
} from '../../services/tmdb'
import { useFavoritesContext } from '../../context/FavoritesContext'
import { useWatchlistContext } from '../../context/WatchlistContext'
import { useToast } from '../../context/ToastContext'
import { WatchProviders } from '../../components/WatchProviders/WatchProviders'
import { CastRow } from '../../components/CastRow/CastRow'
import { MovieCard } from '../../components/MovieCard/MovieCard'
import { SkeletonCard } from '../../components/SkeletonCard/SkeletonCard'
import type { MovieDetail as Detail, CastMember, CrewMember, Video, WatchProviders as WP, Movie } from '../../types/tmdb'
import './MovieDetail.css'

type MediaType = 'movie' | 'tv'

interface State {
  detail: Detail | null
  cast: CastMember[]
  crew: CrewMember[]
  trailer: Video | null
  providers: WP | null
  similar: Movie[]
  loading: boolean
  error: string | null
}

export function MovieDetail() {
  const { type, id } = useParams<{ type: MediaType; id: string }>()
  const navigate = useNavigate()
  const { toggle: toggleFav, isFavorite } = useFavoritesContext()
  const { toggle: toggleWatch, inWatchlist } = useWatchlistContext()
  const { show } = useToast()
  const [showTrailer, setShowTrailer] = useState(false)
  const [state, setState] = useState<State>({
    detail: null, cast: [], crew: [], trailer: null,
    providers: null, similar: [], loading: true, error: null,
  })

  const mediaType: MediaType = (type === 'tv' ? 'tv' : 'movie')
  const numId = Number(id)

  useEffect(() => {
    if (!numId) return
    setShowTrailer(false)
    setState(s => ({ ...s, loading: true, error: null }))
    window.scrollTo({ top: 0 })

    const detailReq = mediaType === 'tv' ? tmdb.getTvDetail(numId) : tmdb.getMovieDetail(numId)

    Promise.allSettled([
      detailReq,
      tmdb.getCredits(numId, mediaType),
      tmdb.getVideos(numId, mediaType),
      tmdb.getWatchProviders(numId, mediaType),
      tmdb.getSimilar(numId, mediaType),
    ]).then(([det, cred, vids, prov, sim]) => {
      const detail  = det.status  === 'fulfilled' ? det.value.data  : null
      const credits = cred.status === 'fulfilled' ? cred.value.data : { cast: [], crew: [] }
      const videos  = vids.status === 'fulfilled' ? vids.value.data.results : []
      const wp      = prov.status === 'fulfilled' ? prov.value.data.results?.BR ?? null : null
      const similar = sim.status  === 'fulfilled' ? sim.value.data.results.slice(0, 12) : []

      const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
        ?? videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
        ?? null

      if (detail) {
        document.title = `${getTitle(detail)} — CineExplorer`
      }

      setState({
        detail, cast: credits.cast, crew: credits.crew,
        trailer, providers: wp, similar, loading: false, error: null,
      })
    })
  }, [numId, mediaType])

  useEffect(() => () => { document.title = 'CineExplorer' }, [])

  const { detail, cast, crew, trailer, providers, similar, loading, error } = state

  if (loading) return <DetailSkeleton />

  if (error || !detail) {
    return (
      <div className="detail-error">
        <p>Não foi possível carregar este título.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    )
  }

  const title       = getTitle(detail)
  const year        = getReleaseYear(detail)
  const poster      = posterUrl(detail.poster_path, 'w500')
  const backdrop    = backdropUrl(detail.backdrop_path, 'w1280')
  const score       = detail.vote_average
  const director    = crew.find(c => c.job === 'Director')
  const fav         = isFavorite(detail.id)
  const watched     = inWatchlist(detail.id)

  const movieObj: Movie = {
    id: detail.id, title: detail.title, name: detail.name,
    overview: detail.overview, poster_path: detail.poster_path,
    backdrop_path: detail.backdrop_path, vote_average: detail.vote_average,
    vote_count: detail.vote_count, release_date: detail.release_date,
    first_air_date: detail.first_air_date, popularity: detail.popularity,
    media_type: mediaType,
  }

  return (
    <div className="detail">
      {/* ── Backdrop ── */}
      {backdrop && (
        <div className="detail__backdrop-wrap" aria-hidden="true">
          <img src={backdrop} alt="" className="detail__backdrop" />
          <div className="detail__backdrop-overlay" />
        </div>
      )}

      <div className="detail__content container">
        {/* Back button */}
        <button className="detail__back" onClick={() => navigate(-1)} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Voltar
        </button>

        <div className="detail__main">
          {/* ── Poster ── */}
          <motion.div
            className="detail__poster-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {poster
              ? <img src={poster} alt={`Poster de ${title}`} className="detail__poster" />
              : <div className="detail__poster-placeholder" aria-label="Sem poster" />
            }
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            className="detail__info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="detail__tags">
              <span className="badge badge--accent">{mediaType === 'tv' ? 'Série' : 'Filme'}</span>
              {detail.genres?.map(g => (
                <Link
                  key={g.id}
                  to={`/?genre=${g.id}`}
                  className="badge badge--accent"
                  style={{ textDecoration: 'none' }}
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <h1 className="detail__title">{title}</h1>
            {detail.tagline && <p className="detail__tagline">"{detail.tagline}"</p>}

            <div className="detail__meta-row">
              {year && <span>{year}</span>}
              {formatRuntime(detail.runtime) && <span>{formatRuntime(detail.runtime)}</span>}
              {detail.original_language && <span>{detail.original_language.toUpperCase()}</span>}
            </div>

            {score > 0 && (
              <div className="detail__score">
                <span className={`detail__score-value ${scoreLabel(score)}`}>★ {score.toFixed(1)}</span>
                <span className="detail__score-count">{detail.vote_count?.toLocaleString()} votos</span>
              </div>
            )}

            <p className="detail__overview">{detail.overview || 'Sinopse não disponível.'}</p>

            {/* ── CTA buttons ── */}
            <div className="detail__ctas">
              {trailer && (
                <button
                  className="detail__btn detail__btn--primary"
                  onClick={() => setShowTrailer(t => !t)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                  {showTrailer ? 'Ocultar trailer' : 'Ver trailer'}
                </button>
              )}
              <button
                className={`detail__btn ${fav ? 'detail__btn--active-fav' : 'detail__btn--outline'}`}
                onClick={() => { toggleFav(movieObj); show(fav ? 'Removido dos favoritos' : 'Adicionado aos favoritos', fav ? 'info' : 'success') }}
                aria-pressed={fav}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
                </svg>
                {fav ? 'Favorito' : 'Favoritar'}
              </button>
              <button
                className={`detail__btn ${watched ? 'detail__btn--active-watch' : 'detail__btn--outline'}`}
                onClick={() => { toggleWatch(movieObj); show(watched ? 'Removido da lista' : 'Adicionado para assistir depois', watched ? 'info' : 'success') }}
                aria-pressed={watched}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M5 3l14 9-14 9V3z" fill={watched ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                {watched ? 'Na lista' : 'Assistir depois'}
              </button>
            </div>

            {/* ── Extra info ── */}
            <dl className="detail__facts">
              {director && (
                <>
                  <dt>Diretor</dt>
                  <dd>{director.name}</dd>
                </>
              )}
              {detail.status && (
                <>
                  <dt>Status</dt>
                  <dd>{detail.status}</dd>
                </>
              )}
              {detail.number_of_seasons && (
                <>
                  <dt>Temporadas</dt>
                  <dd>{detail.number_of_seasons}</dd>
                </>
              )}
              {formatMoney(detail.budget) && (
                <>
                  <dt>Orçamento</dt>
                  <dd>{formatMoney(detail.budget)}</dd>
                </>
              )}
              {formatMoney(detail.revenue) && (
                <>
                  <dt>Bilheteria</dt>
                  <dd>{formatMoney(detail.revenue)}</dd>
                </>
              )}
            </dl>
          </motion.div>
        </div>

        {/* ── Trailer ── */}
        {showTrailer && trailer && (
          <motion.div
            className="detail__trailer-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              className="detail__trailer"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={`Trailer oficial: ${title}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </motion.div>
        )}

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <section className="detail__section">
            <h2 className="detail__section-title">Elenco principal</h2>
            <CastRow cast={cast} />
          </section>
        )}

        {/* ── Where to watch ── */}
        <section className="detail__section">
          <h2 className="detail__section-title">Onde assistir</h2>
          <WatchProviders providers={providers} />
        </section>

        {/* ── Similar ── */}
        {similar.length > 0 && (
          <section className="detail__section">
            <h2 className="detail__section-title">Títulos semelhantes</h2>
            <div className="detail__similar-grid">
              {similar.map((m, i) => (
                <MovieCard key={m.id} movie={{ ...m, media_type: mediaType }} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="detail detail--loading">
      <div className="container" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
        <div className="detail__main">
          <div className="detail__poster-placeholder shimmer" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[180, 80, 120, 300, 300].map((w, i) => (
              <div key={i} className="shimmer" style={{ height: i === 0 ? 36 : 14, width: `${w}px`, maxWidth: '100%', borderRadius: 8, background: 'var(--skeleton-base)' }} />
            ))}
          </div>
        </div>
        <div className="detail__section">
          <div className="shimmer" style={{ height: 18, width: 160, borderRadius: 8, background: 'var(--skeleton-base)', marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
