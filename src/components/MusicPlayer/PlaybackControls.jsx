import { AnimatePresence, motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import { audioEngine } from '../../audio/AudioEngine'
import { PauseIcon, PlayIcon, SeekBackIcon, SeekForwardIcon } from '../UI/Icons'
import styles from './MusicPlayer.module.css'

const SKIP_SECONDS = 10

export default function PlaybackControls() {
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))
  const isPlaying = useVisualizerStore((s) => s.isPlaying)

  return (
    <div className={styles.controls}>
      <button className={styles.btn} disabled={!hasTrack} onClick={() => audioEngine.seekBy(-SKIP_SECONDS)} aria-label={`Back ${SKIP_SECONDS} seconds`} title={`Back ${SKIP_SECONDS}s (←)`}>
        <SeekBackIcon />
      </button>
      <button className={`${styles.btn} ${styles.play}`} disabled={!hasTrack} onClick={() => audioEngine.toggle()} aria-label={isPlaying ? 'Pause' : 'Play'} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={isPlaying ? 'pause' : 'play'} className={styles.icon} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.14 }}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.span>
        </AnimatePresence>
      </button>
      <button className={styles.btn} disabled={!hasTrack} onClick={() => audioEngine.seekBy(SKIP_SECONDS)} aria-label={`Forward ${SKIP_SECONDS} seconds`} title={`Forward ${SKIP_SECONDS}s (→)`}>
        <SeekForwardIcon />
      </button>
    </div>
  )
}
