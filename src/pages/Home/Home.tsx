import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { MovieGrid } from '../../components/MovieGrid/MovieGrid'
import { GenreFilter } from '../../components/GenreFilter/GenreFilter'
import { MoodPicker } from './MoodPicker'
import { tmdb, backdropUrl, getTitle } from '../../services/tmdb'
import { useDebounce } from '../../hooks/useDebounce'
import type { Movie } from '../../types/tmdb'
import './Home.css'

const MOOD_GENRES: Record<string, number[]> = {
  '😄 Animado':    [35, 16, 10751],
  '😢 Triste':     [18, 10749],
  '🤔 Reflexivo':  [18, 99, 36],
  '😰 Tenso':      [53, 27, 80],
  '💪 Motivado':   [28, 12, 36],
  '❤️ Romântico':  [10749, 35],
}

export function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('trending')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hero, setHero] = useState<Movie | null>(null)
  const [showMood, setShowMood] = useState(false)
  const pageRef = useRef(1)

  const debouncedQuery = useDebounce(query, 420)

  /* ── Fetch function ── */
  const fetchPage = useCallback(async (
    q: string, cat: string, pg: number, append: boolean
  ) => {
    if (pg === 1 && !append) setLoading(true)
    else setLoadingMore(true)

    try {
      let results: Movie[] = []
      let total = 1

      if (q.trim()) {
        const res = await tmdb.searchMulti(q, pg)
        results = res.data.results.filter(m =>
          (m.media_type as string) !== 'person' && m.poster_path
        )
        total = res.data.total_pages
      } else {
        const genreId = Number(cat)
        if (!isNaN(genreId) && genreId > 0) {
          const res = await tmdb.discoverMovies({ with_genres: genreId, sort_by: 'popularity.desc', page: pg })
          results = res.data.results
          total = res.data.total_pages
        } else if (cat === 'trending')    { const r = await tmdb.getTrending(pg);     results = r.data.results; total = r.data.total_pages }
        else if (cat === 'popular')       { const r = await tmdb.getPopularMovies(pg); results = r.data.results; total = r.data.total_pages }
        else if (cat === 'top_rated')     { const r = await tmdb.getTopRated(pg);      results = r.data.results; total = r.data.total_pages }
        else if (cat === 'now_playing')   { const r = await tmdb.getNowPlaying(pg);   results = r.data.results; total = r.data.total_pages }
        else if (cat === 'upcoming')      { const r = await tmdb.getUpcoming(pg);     results = r.data.results; total = r.data.total_pages }
      }

      if (pg === 1 && results[0]?.backdrop_path && !q) {
        setHero(results[Math.floor(Math.random() * Math.min(5, results.length))])
      }

      setMovies(prev => append ? [...prev, ...results] : results)
      setTotalPages(total)
      setPage(pg)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  /* ── Reset on query/category change ── */
  useEffect(() => {
    pageRef.current = 1
    if (category === 'mood') { setShowMood(true); return }
    setShowMood(false)
    fetchPage(debouncedQuery, category, 1, false)
  }, [debouncedQuery, category, fetchPage])

  const handleLoadMore = useCallback(() => {
    const next = pageRef.current + 1
    if (next > totalPages) return
    pageRef.current = next
    fetchPage(debouncedQuery, category, next, true)
  }, [debouncedQuery, category, totalPages, fetchPage])

  function handleMood(mood: string) {
    const genres = MOOD_GENRES[mood]
    if (!genres) return
    setShowMood(false)
    const genreId = genres[0]
    setCategory(String(genreId))
  }

  const heroBackdrop = hero ? backdropUrl(hero.backdrop_path, 'w1280') : null

  return (
    <main className="home">
      {/* ── Hero ── */}
      <AnimatePresence mode="wait">
        {heroBackdrop && (
          <motion.div
            key={heroBackdrop}
            className="home__hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          >
            <img src={heroBackdrop} alt="" className="home__hero-img" />
            <div className="home__hero-overlay" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search header ── */}
      <div className="home__search-section">
        <div className="container">
          <motion.h1
            className="home__title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {hero && !query ? (
              <span className="home__title-featured">
                <span className="home__title-label">Em destaque</span>
                {getTitle(hero)}
              </span>
            ) : 'Explore filmes e séries'}
          </motion.h1>

          <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="home__categories">
        <div className="container">
          <GenreFilter selected={category} onChange={cat => { setCategory(cat); setQuery('') }} />
        </div>
      </div>

      {/* ── Mood picker ── */}
      <AnimatePresence>
        {showMood && (
          <motion.div
            className="home__mood"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container">
              <MoodPicker moods={Object.keys(MOOD_GENRES)} onSelect={handleMood} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      {!showMood && (
        <div className="home__grid">
          <div className="container">
            {query && (
              <p className="home__results-label" role="status">
                Resultados para "<strong>{query}</strong>"
              </p>
            )}
            <MovieGrid
              movies={movies}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={page < totalPages}
              onLoadMore={handleLoadMore}
              emptyMessage="Nenhum resultado para essa busca."
            />
          </div>
        </div>
      )}
    </main>
  )
}
