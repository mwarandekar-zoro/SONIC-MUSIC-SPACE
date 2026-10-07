import { motion } from 'framer-motion'
import { MODES } from '../../constants/modes'
import { useVisualizerStore } from '../../store/visualizerStore'
import styles from './VisualizerControls.module.css'

/** Segmented switch for the visualizer mode. Keys 1-5 do the same. */
export default function VisualizerControls({ hidden = false }) {
  const mode = useVisualizerStore((s) => s.mode)
  const setMode = useVisualizerStore((s) => s.setMode)
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))

  return (
    <div className={`${styles.wrap} ${hasTrack ? styles.withTrack : styles.noTrack} ${hidden ? styles.hidden : ''}`} role="group" aria-label="Visualizer mode">
      {MODES.map((m, i) => {
        const active = m.id === mode
        return (
          <button key={m.id} className={`${styles.btn} ${active ? styles.active : ''}`} onClick={() => setMode(m.id)} aria-pressed={active} title={`${m.label} (${i + 1})`}>
            {active && <motion.span layoutId="mode-pill" className={styles.pill} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            <span className={styles.label}>{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
