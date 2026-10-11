import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import useDialogFocus from '../../hooks/useDialogFocus'
import { CloseIcon } from '../UI/Icons'
import styles from './ShortcutsHelp.module.css'

const SHORTCUTS = [
  ['Space', 'Play or pause'],
  ['N / B', 'Next / Previous track'],
  ['← →', 'Seek 5 seconds'],
  ['L', 'Open music library'],
  ['M', 'Mute audio'],
  ['1 – 5', 'Visualizer mode'],
  ['S', 'Open settings'],
  ['E', 'Show or hide environments'],
  ['F', 'Fullscreen'],
  ['P', 'Take screenshot'],
  ['?', 'Show this list'],
  ['Esc', 'Close panels'],
]

export default function ShortcutsHelp() {
  const ref = useRef(null)
  const closePanel = useVisualizerStore((s) => s.closePanel)
  useDialogFocus(ref)

  return (
    <motion.div className={styles.wrap} onClick={closePanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div
        ref={ref}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 16, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 8, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.head}>
          <h2 className={styles.title}>Shortcuts</h2>
          <button className={styles.close} onClick={closePanel} aria-label="Close shortcuts"><CloseIcon /></button>
        </div>
        <ul className={styles.list}>
          {SHORTCUTS.map(([key, action]) => (
            <li key={key} className={styles.item}>
              <span>{action}</span>
              <kbd className={styles.key}>{key}</kbd>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}
