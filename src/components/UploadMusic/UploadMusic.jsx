import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import { loadTrackFile, openFilePicker } from '../../audio/loadTrack'
import { UploadIcon } from '../UI/Icons'
import styles from './UploadMusic.module.css'

const hasFiles = (e) => Array.from(e.dataTransfer?.types ?? []).includes('Files')

/** Shows the hero empty-state card in the center until a track is loaded. Drag & drop works globally. */
export default function UploadMusic() {
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))
  const loading = useVisualizerStore((s) => s.loadingTrack)
  const [dragging, setDragging] = useState(false)

  // Whole-window drag and drop.
  useEffect(() => {
    let depth = 0
    const enter = (e) => { if (hasFiles(e)) { e.preventDefault(); depth++; setDragging(true) } }
    const over = (e) => { if (hasFiles(e)) e.preventDefault() }
    const leave = (e) => { if (hasFiles(e)) { depth = Math.max(0, depth - 1); if (!depth) setDragging(false) } }
    const drop = (e) => {
      if (!hasFiles(e)) return
      e.preventDefault(); depth = 0; setDragging(false)
      loadTrackFile(e.dataTransfer.files[0])
    }
    window.addEventListener('dragenter', enter)
    window.addEventListener('dragover', over)
    window.addEventListener('dragleave', leave)
    window.addEventListener('drop', drop)
    return () => {
      window.removeEventListener('dragenter', enter)
      window.removeEventListener('dragover', over)
      window.removeEventListener('dragleave', leave)
      window.removeEventListener('drop', drop)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {!hasTrack && (
          <motion.div
            key="panel"
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.title}>Give the space a sound</h2>
            <p className={styles.hint}>Drop an audio file anywhere, or choose from your device.</p>
            <button className={styles.pick} onClick={openFilePicker} disabled={loading}>
              <UploadIcon /> {loading ? 'Loading track…' : 'Choose a song'}
            </button>
            <p className={styles.formats}>Supports MP3, WAV, OGG, FLAC & AAC. Processed 100% locally.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dragging && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className={styles.ring}>Release to load track</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
