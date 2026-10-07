import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import styles from './Toast.module.css'

const AUTO_DISMISS_MS = 4500

function ToastItem({ toast }) {
  const dismiss = useVisualizerStore((s) => s.dismissToast)

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [toast.id, dismiss])

  return (
    <motion.div
      layout
      className={`${styles.toast} ${toast.tone === 'error' ? styles.error : ''}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <span className={styles.dot} />
      <span>{toast.message}</span>
      <button className={styles.close} onClick={() => dismiss(toast.id)} aria-label="Dismiss message">×</button>
    </motion.div>
  )
}

export default function ToastHost() {
  const toasts = useVisualizerStore((s) => s.toasts)
  return (
    <div className={styles.host} role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
      </AnimatePresence>
    </div>
  )
}
