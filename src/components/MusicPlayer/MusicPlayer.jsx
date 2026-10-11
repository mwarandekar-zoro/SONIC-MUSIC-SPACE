import { AnimatePresence, motion } from 'framer-motion'
import TrackInfo from '../TrackInfo/TrackInfo'
import PlaybackControls from './PlaybackControls'
import ProgressBar from './ProgressBar'
import VolumeControl from './VolumeControl'
import { openFilePicker } from '../../audio/loadTrack'
import { LibraryIcon, UploadIcon } from '../UI/Icons'
import { useVisualizerStore } from '../../store/visualizerStore'
import styles from './MusicPlayer.module.css'

export default function MusicPlayer() {
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))
  const panel = useVisualizerStore((s) => s.panel)
  const togglePanel = useVisualizerStore((s) => s.togglePanel)

  return (
    <AnimatePresence>
      {hasTrack && (
        <motion.section
          key="player"
          className={styles.player}
          aria-label="Music player"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <TrackInfo />
          <PlaybackControls />
          <div className={styles.side}>
            <button
              className={`${styles.btn} ${panel === 'library' ? styles.btnActive : ''}`}
              onClick={() => togglePanel('library')}
              aria-label="Open music library"
              title="Music Library (L)"
            >
              <LibraryIcon />
            </button>
            <button className={styles.btn} onClick={openFilePicker} aria-label="Upload your own song" title="Upload Audio File">
              <UploadIcon />
            </button>
            <VolumeControl />
          </div>
          <ProgressBar />
        </motion.section>
      )}
    </AnimatePresence>
  )
}
