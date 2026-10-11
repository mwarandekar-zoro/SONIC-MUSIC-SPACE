import { PlayIcon, PauseIcon, PlusIcon } from '../UI/Icons'
import styles from './MusicLibrary.module.css'

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function TrackCard({
  track,
  isCurrent,
  isPlaying,
  onPlay,
  onAddToQueue,
}) {
  return (
    <div
      className={`${styles.trackCard} ${isCurrent ? styles.trackCardCurrent : ''}`}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPlay()
        }
      }}
      aria-label={`Play ${track.title || track.name} by ${track.artist || 'Unknown'}`}
    >
      {/* Artwork container */}
      <div className={styles.cardArtWrapper}>
        {track.artwork || track.artworkUrl ? (
          <img
            src={track.artwork || track.artworkUrl}
            alt=""
            className={styles.cardArt}
            loading="lazy"
          />
        ) : (
          <div className={styles.cardArtFallback}>
            <span>♪</span>
          </div>
        )}

        {/* Play/Pause overlay */}
        <div className={styles.cardPlayOverlay}>
          {isCurrent && isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>

        {/* Dynamic audio waves indicator when active & playing */}
        {isCurrent && (
          <div className={`${styles.cardSoundWaves} ${isPlaying ? styles.soundWavesActive : ''}`}>
            <span className={styles.waveBar} />
            <span className={styles.waveBar} />
            <span className={styles.waveBar} />
          </div>
        )}
      </div>

      {/* Track Details */}
      <div className={styles.cardInfo}>
        <div className={styles.cardTitleRow}>
          <h4 className={styles.cardTitle}>{track.title || track.name}</h4>
          {track.genre && <span className={styles.cardGenre}>{track.genre}</span>}
        </div>
        <p className={styles.cardArtist}>{track.artist || 'Unknown Artist'}</p>
        {track.description && (
          <p className={styles.cardDescription}>{track.description}</p>
        )}
      </div>

      {/* Meta & Actions */}
      <div className={styles.cardActions}>
        <span className={styles.cardDuration}>
          {formatDuration(track.duration)}
        </span>

        {onAddToQueue && (
          <button
            className={styles.cardQueueBtn}
            onClick={(e) => {
              e.stopPropagation()
              onAddToQueue(track)
            }}
            aria-label={`Add ${track.title || track.name} to queue`}
            title="Add to Queue"
          >
            <PlusIcon />
          </button>
        )}
      </div>
    </div>
  )
}
