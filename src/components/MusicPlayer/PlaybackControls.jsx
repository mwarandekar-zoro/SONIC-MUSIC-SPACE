import { AnimatePresence, motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import { audioEngine } from '../../audio/AudioEngine'
import { playNextTrack, playPrevTrack } from '../../audio/loadTrack'
import {
  PauseIcon,
  PlayIcon,
  PrevIcon,
  NextIcon,
  SeekBackIcon,
  SeekForwardIcon,
  ShuffleIcon,
  RepeatIcon,
  RepeatOneIcon,
} from '../UI/Icons'
import styles from './MusicPlayer.module.css'

const SKIP_SECONDS = 10

export default function PlaybackControls() {
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))
  const isPlaying = useVisualizerStore((s) => s.isPlaying)
  const shuffle = useVisualizerStore((s) => s.shuffle)
  const toggleShuffle = useVisualizerStore((s) => s.toggleShuffle)
  const repeatMode = useVisualizerStore((s) => s.repeatMode)
  const cycleRepeat = useVisualizerStore((s) => s.cycleRepeat)

  return (
    <div className={styles.controls}>
      {/* Shuffle */}
      <button
        className={`${styles.btn} ${styles.subBtn} ${shuffle ? styles.btnActive : ''}`}
        onClick={toggleShuffle}
        aria-label={shuffle ? 'Shuffle on' : 'Shuffle off'}
        title={shuffle ? 'Shuffle On' : 'Shuffle Off'}
      >
        <ShuffleIcon />
      </button>

      {/* Previous Track */}
      <button
        className={styles.btn}
        disabled={!hasTrack}
        onClick={() => playPrevTrack()}
        aria-label="Previous track"
        title="Previous Track (B)"
      >
        <PrevIcon />
      </button>

      {/* Seek Back 10s */}
      <button
        className={`${styles.btn} ${styles.seekBtn}`}
        disabled={!hasTrack}
        onClick={() => audioEngine.seekBy(-SKIP_SECONDS)}
        aria-label={`Back ${SKIP_SECONDS} seconds`}
        title={`Back ${SKIP_SECONDS}s (←)`}
      >
        <SeekBackIcon />
      </button>

      {/* Play / Pause */}
      <button
        className={`${styles.btn} ${styles.play}`}
        disabled={!hasTrack}
        onClick={() => audioEngine.toggle()}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isPlaying ? 'pause' : 'play'}
            className={styles.icon}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Seek Forward 10s */}
      <button
        className={`${styles.btn} ${styles.seekBtn}`}
        disabled={!hasTrack}
        onClick={() => audioEngine.seekBy(SKIP_SECONDS)}
        aria-label={`Forward ${SKIP_SECONDS} seconds`}
        title={`Forward ${SKIP_SECONDS}s (→)`}
      >
        <SeekForwardIcon />
      </button>

      {/* Next Track */}
      <button
        className={styles.btn}
        disabled={!hasTrack}
        onClick={() => playNextTrack(false)}
        aria-label="Next track"
        title="Next Track (N)"
      >
        <NextIcon />
      </button>

      {/* Repeat Mode */}
      <button
        className={`${styles.btn} ${styles.subBtn} ${repeatMode !== 'off' ? styles.btnActive : ''}`}
        onClick={cycleRepeat}
        aria-label={`Repeat: ${repeatMode}`}
        title={`Repeat: ${repeatMode.toUpperCase()} (Click to cycle)`}
      >
        {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
      </button>
    </div>
  )
}
