import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import useAudioFrame from '../../hooks/useAudioFrame'
import styles from './EnergyMeter.module.css'

const CHANNELS = [
  { key: 'bass', label: 'Bass' },
  { key: 'mid', label: 'Mid' },
  { key: 'treble', label: 'Treble' },
  { key: 'volume', label: 'Energy' },
]

/** Four small bars showing what the visualizer is hearing. Decorative, so hidden from screen readers. */
export default function EnergyMeter({ hidden = false }) {
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))
  const fills = useRef([])

  useAudioFrame((data) => {
    CHANNELS.forEach(({ key }, i) => {
      const fill = fills.current[i]
      if (fill) fill.style.transform = `scaleY(${Math.min(1, data[key]).toFixed(3)})`
    })
  })

  if (!hasTrack) return null
  return (
    <motion.div className={`${styles.meter} ${hidden ? styles.hidden : ''}`} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
      {CHANNELS.map(({ key, label }, i) => (
        <div key={key} className={styles.channel}>
          <div className={styles.track}>
            <div ref={(el) => { fills.current[i] = el }} className={styles.fill} />
          </div>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </motion.div>
  )
}
