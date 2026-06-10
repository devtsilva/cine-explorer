import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '../../context/ToastContext'
import './Toast.css'

const icons = {
  success: '✓',
  error: '✕',
  info: 'i',
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notificações">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={`toast toast--${t.type}`}
            initial={{ opacity: 0, x: 48, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.88 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <span className="toast__icon" aria-hidden="true">{icons[t.type]}</span>
            <span className="toast__msg">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
