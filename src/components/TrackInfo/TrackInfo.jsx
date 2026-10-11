import { useRef } from 'react'
import { useVisualizerStore } from '../../store/visualizerStore'
import useAudioFrame from '../../hooks/useAudioFrame'
import { prefersReducedMotion } from '../../three/motion'
import styles from './TrackInfo.module.css'

export default function TrackInfo() {
  const track = useVisualizerStore((s) => s.track)
  const loading = useVisualizerStore((s) => s.loadingTrack)
  const title = useRef(null)

  // The title glows with each beat. Written straight to the DOM, so React does not re-render.
  useAudioFrame((data) => {
    const el = title.current
    if (!el) return
    el.style.textShadow = prefersReducedMotion() || data.beat < 0.03
      ? ''
      : `0 0 ${(data.beat * 22).toFixed(1)}px rgba(154, 134, 255, ${(0.2 + data.beat * 0.6).toFixed(2)})`
  })

  if (!track) {
    return (
      <div className={`${styles.info} ${styles.empty}`}>
        <p className={styles.title}>{loading ? 'Loading track…' : 'No track loaded'}</p>
      </div>
    )
  }

  const metaParts = [
    track.artist || 'Unknown artist',
    track.album || null,
    track.format || 'AUDIO',
    typeof track.sizeMB === 'number' ? `${track.sizeMB.toFixed(1)} MB` : (track.genre || null)
  ].filter(Boolean).join(' · ')

  return (
    <div className={styles.row}>
      {track.artworkUrl ? (
        <img className={styles.art} src={track.artworkUrl} alt={track.title || track.name} width="44" height="44" />
      ) : (
        <div className={styles.artFallback} aria-hidden="true">
          <span>♪</span>
        </div>
      )}
      <div className={styles.info}>
        <p ref={title} className={styles.title} title={track.fileName || track.name}>{track.title || track.name}</p>
        <p className={styles.meta}>{metaParts}</p>
      </div>
    </div>
  )
}
