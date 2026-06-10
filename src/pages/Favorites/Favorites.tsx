import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavoritesContext } from '../../context/FavoritesContext'
import { MovieGrid } from '../../components/MovieGrid/MovieGrid'
import './Favorites.css'

export function Favorites() {
  const { favorites } = useFavoritesContext()

  return (
    <main className="favorites page-wrapper">
      <div className="container">
        <motion.div
          className="favorites__header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="favorites__title">Meus favoritos</h1>
          {favorites.length > 0 && (
            <span className="favorites__count">{favorites.length} título{favorites.length !== 1 ? 's' : ''}</span>
          )}
        </motion.div>

        {favorites.length === 0 ? (
          <div className="favorites__empty">
            <span className="favorites__empty-icon" aria-hidden="true">💔</span>
            <p>Você ainda não tem favoritos.</p>
            <p className="favorites__empty-sub">Clique no ❤ para salvar títulos que você ama.</p>
            <Link to="/" className="favorites__cta">Explorar títulos</Link>
          </div>
        ) : (
          <MovieGrid
            movies={favorites}
            loading={false}
            emptyMessage=""
          />
        )}
      </div>
    </main>
  )
}
