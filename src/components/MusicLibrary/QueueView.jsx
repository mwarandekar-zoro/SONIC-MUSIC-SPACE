import { TrashIcon, PlayIcon, PauseIcon } from '../UI/Icons'
import styles from './MusicLibrary.module.css'

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function QueueView({
  queue,
  queueIndex,
  currentTrack,
  isPlaying,
  onPlayQueueItem,
  onRemoveFromQueue,
  onClearQueue,
}) {
  if (!queue || queue.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h3 className={styles.emptyTitle}>Your queue is empty</h3>
        <p className={styles.emptySub}>
          Browse the library and click the + icon on any song to add it to your playback queue.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.queueContainer}>
      <div className={styles.queueHeader}>
        <span className={styles.queueCount}>
          {queue.length} {queue.length === 1 ? 'track' : 'tracks'} in queue
        </span>
        <button
          className={styles.clearQueueBtn}
          onClick={onClearQueue}
          title="Clear all upcoming tracks"
        >
          <TrashIcon /> Clear Queue
        </button>
      </div>

      <div className={styles.queueList} role="list">
        {queue.map((track, idx) => {
          const isCurrent =
            idx === queueIndex ||
            currentTrack?.id === track.id ||
            (currentTrack?.title && currentTrack?.title === track.title)

          return (
            <div
              key={`${track.id}-${idx}`}
              className={`${styles.queueItem} ${isCurrent ? styles.queueItemCurrent : ''}`}
              onClick={() => onPlayQueueItem(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPlayQueueItem(idx)
                }
              }}
            >
              <span className={styles.queueIndex}>
                {isCurrent && isPlaying ? '▶' : idx + 1}
              </span>

              <div className={styles.queueArtWrap}>
                {track.artwork || track.artworkUrl ? (
                  <img
                    src={track.artwork || track.artworkUrl}
                    alt=""
                    className={styles.queueArt}
                  />
                ) : (
                  <div className={styles.queueArtFallback}>♪</div>
                )}
              </div>

              <div className={styles.queueInfo}>
                <div className={styles.queueTitleRow}>
                  <h4 className={styles.queueTitle}>{track.title || track.name}</h4>
                  {isCurrent && <span className={styles.nowPlayingBadge}>Now Playing</span>}
                </div>
                <p className={styles.queueArtist}>{track.artist || 'Unknown Artist'}</p>
              </div>

              <span className={styles.queueDuration}>
                {formatDuration(track.duration)}
              </span>

              <button
                className={styles.queueRemoveBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromQueue(idx)
                }}
                aria-label={`Remove ${track.title || track.name} from queue`}
                title="Remove from queue"
              >
                <TrashIcon />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
