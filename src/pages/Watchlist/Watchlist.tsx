import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWatchlistContext } from '../../context/WatchlistContext'
import { MovieGrid } from '../../components/MovieGrid/MovieGrid'
import './Watchlist.css'

export function Watchlist() {
  const { watchlist } = useWatchlistContext()

  return (
    <main className="watchlist page-wrapper">
      <div className="container">
        <motion.div
          className="watchlist__header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="watchlist__title">Assistir depois</h1>
          {watchlist.length > 0 && (
            <span className="watchlist__count">{watchlist.length} título{watchlist.length !== 1 ? 's' : ''}</span>
          )}
        </motion.div>

        {watchlist.length === 0 ? (
          <div className="watchlist__empty">
            <span className="watchlist__empty-icon" aria-hidden="true">📋</span>
            <p>Sua lista está vazia.</p>
            <p className="watchlist__empty-sub">Adicione filmes e séries para assistir mais tarde.</p>
            <Link to="/" className="watchlist__cta">Explorar títulos</Link>
          </div>
        ) : (
          <MovieGrid
            movies={watchlist}
            loading={false}
            emptyMessage=""
          />
        )}
      </div>
    </main>
  )
}
