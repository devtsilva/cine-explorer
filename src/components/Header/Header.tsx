import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFavoritesContext } from '../../context/FavoritesContext'
import { useWatchlistContext } from '../../context/WatchlistContext'
import './Header.css'

interface Props {
  onThemeToggle: () => void
  isDark: boolean
}

export function Header({ onThemeToggle, isDark }: Props) {
  const { favorites } = useFavoritesContext()
  const { watchlist } = useWatchlistContext()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} role="banner">
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="CineExplorer — início">
          <svg viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">
            <rect width="36" height="36" rx="10" fill="#6366f1" />
            <path d="M9 25L15 11l5 9 3.5-6L29 25" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="header__logo-text">Cine<span>Explorer</span></span>
        </Link>

        <nav className="header__nav" aria-label="Navegação principal">
          <NavLink to="/" className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`} end>
            Início
          </NavLink>
          <NavLink to="/favoritos" className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`}>
            Favoritos
            {favorites.length > 0 && <span className="header__badge">{favorites.length}</span>}
          </NavLink>
          <NavLink to="/assistir-depois" className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`}>
            Assistir depois
            {watchlist.length > 0 && <span className="header__badge">{watchlist.length}</span>}
          </NavLink>
        </nav>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            onClick={onThemeToggle}
            aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDark
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>

          <button
            className="header__icon-btn header__menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
              {menuOpen
                ? <path d="M18 6L6 18M6 6l12 12"/>
                : <path d="M3 12h18M3 6h18M3 18h18"/>
              }
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            role="navigation"
            aria-label="Menu mobile"
          >
            <NavLink to="/" className={({ isActive }) => `header__mobile-link ${isActive ? 'active' : ''}`} end>Início</NavLink>
            <NavLink to="/favoritos" className={({ isActive }) => `header__mobile-link ${isActive ? 'active' : ''}`}>
              Favoritos {favorites.length > 0 && <span className="header__badge">{favorites.length}</span>}
            </NavLink>
            <NavLink to="/assistir-depois" className={({ isActive }) => `header__mobile-link ${isActive ? 'active' : ''}`}>
              Assistir depois {watchlist.length > 0 && <span className="header__badge">{watchlist.length}</span>}
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
