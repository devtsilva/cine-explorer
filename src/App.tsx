import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Favorites } from './pages/Favorites/Favorites'
import { Watchlist } from './pages/Watchlist/Watchlist'
import { MovieDetail } from './pages/MovieDetail/MovieDetail'
import { NotFound } from './pages/NotFound/NotFound'
import { FavoritesProvider } from './context/FavoritesContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/Toast/Toast'

function getInitialTheme(): boolean {
  const saved = localStorage.getItem('cine-theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18 }}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/"                    element={<Home />} />
          <Route path="/favoritos"           element={<Favorites />} />
          <Route path="/assistir-depois"     element={<Watchlist />} />
          <Route path="/titulo/:type/:id"    element={<MovieDetail />} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('cine-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <BrowserRouter>
      <ToastProvider>
        <FavoritesProvider>
          <WatchlistProvider>
            <Header onThemeToggle={() => setIsDark(d => !d)} isDark={isDark} />
            <AnimatedRoutes />
            <ToastContainer />
          </WatchlistProvider>
        </FavoritesProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
