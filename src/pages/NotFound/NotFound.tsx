import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './NotFound.css'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <main className="not-found page-wrapper">
      <motion.div
        className="not-found__content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="not-found__code" aria-hidden="true">404</div>
        <h1 className="not-found__title">Página não encontrada</h1>
        <p className="not-found__sub">A página que você está procurando não existe ou foi removida.</p>
        <div className="not-found__ctas">
          <button className="not-found__btn not-found__btn--outline" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <Link to="/" className="not-found__btn not-found__btn--primary">
            Ir para o início
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
