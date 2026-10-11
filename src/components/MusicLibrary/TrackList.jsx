import TrackCard from './TrackCard'
import { UploadIcon } from '../UI/Icons'
import styles from './MusicLibrary.module.css'

export default function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onAddToQueue,
  onUploadClick,
}) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎵</div>
        <h3 className={styles.emptyTitle}>No tracks found</h3>
        <p className={styles.emptySub}>
          Try searching for another artist or title, or upload your own audio file.
        </p>
        {onUploadClick && (
          <button className={styles.emptyUploadBtn} onClick={onUploadClick}>
            <UploadIcon /> Upload audio file
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.trackGrid} role="list">
      {tracks.map((track) => {
        const isCurrent =
          currentTrack?.id === track.id ||
          (currentTrack?.title && currentTrack?.title === track.title)

        return (
          <TrackCard
            key={track.id}
            track={track}
            isCurrent={isCurrent}
            isPlaying={isPlaying}
            onPlay={() => onPlayTrack(track)}
            onAddToQueue={onAddToQueue}
          />
        )
      })}
    </div>
  )
}
