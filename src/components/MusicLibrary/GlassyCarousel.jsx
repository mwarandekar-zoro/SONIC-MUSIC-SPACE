import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, PlusIcon } from '../UI/Icons'
import styles from './GlassyCarousel.module.css'

export default function GlassyCarousel({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onAddToQueue,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)

  // Sync active index with current playing track initially
  useEffect(() => {
    if (!currentTrack || !tracks.length) return
    const idx = tracks.findIndex(
      (t) => t.id === currentTrack.id || (t.title && t.title === currentTrack.title)
    )
    if (idx !== -1) setActiveIndex(idx)
  }, [currentTrack, tracks])

  if (!tracks || tracks.length === 0) return null

  const activeTrack = tracks[activeIndex] || tracks[0]
  const count = tracks.length

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count)
  }

  // Pointer drag for smooth swipe
  const handlePointerDown = (e) => {
    isDragging.current = true
    dragStartX.current = e.clientX
  }

  const handlePointerUp = (e) => {
    if (!isDragging.current) return
    isDragging.current = false
    const deltaX = e.clientX - dragStartX.current
    if (deltaX > 45) {
      handlePrev()
    } else if (deltaX < -45) {
      handleNext()
    }
  }

  return (
    <div
      className={styles.carouselContainer}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }}
      aria-label="3D Music Carousel"
    >
      {/* Dynamic Ambient Glow behind the active card */}
      <div
        className={styles.ambientGlow}
        style={{
          background: `radial-gradient(circle, ${activeTrack.accentColor || '#ff2a85'} 0%, transparent 65%)`,
        }}
      />

      {/* 3D Cards Stage */}
      <div className={styles.stage}>
        {tracks.map((track, i) => {
          let diff = i - activeIndex

          // Normalize diff to shortest distance in a loop
          if (diff > count / 2) diff -= count
          if (diff < -count / 2) diff += count

          const absDiff = Math.abs(diff)
          const isCenter = diff === 0
          const isPlayingThis =
            (currentTrack?.id === track.id || currentTrack?.title === track.title) && isPlaying

          // Transform calculation for 3D glassy coverflow
          const translateX = diff * 215 // px offset
          const translateZ = isCenter ? 80 : -absDiff * 95 // depth
          const rotateY = diff * -28 // 3D tilt
          const scale = isCenter ? 1.08 : Math.max(0.68, 0.88 - absDiff * 0.1)
          const opacity = isCenter ? 1 : Math.max(0.15, 0.7 - absDiff * 0.28)
          const zIndex = 30 - absDiff

          // Don't render cards that are too far away
          if (absDiff > 3) return null

          return (
            <div
              key={track.id}
              className={`${styles.card} ${isCenter ? styles.cardActive : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
              }}
              onClick={() => {
                if (!isCenter) {
                  setActiveIndex(i)
                } else {
                  onPlayTrack(track)
                }
              }}
              role="button"
              tabIndex={isCenter ? 0 : -1}
              aria-label={`${track.title} by ${track.artist}`}
            >
              {/* Artwork Poster */}
              <div className={styles.cardArtWrapper}>
                <img
                  src={track.artwork}
                  alt={track.title}
                  className={styles.cardArt}
                  loading="lazy"
                  draggable={false}
                />
                <div className={styles.cardGradient} />

                {/* Top Badge (e.g. 4K HDR • LOSSLESS) */}
                <div className={styles.topBadge}>
                  <span className={styles.badgeDot} />
                  <span>{track.badge || `${track.genre} • LOSSLESS`}</span>
                </div>

                {/* Central Glassy "Play Track" Button */}
                <div className={`${styles.centerPlayBtnWrap} ${isCenter ? styles.centerPlayVisible : ''}`}>
                  <button
                    className={styles.playActionBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlayTrack(track)
                    }}
                    aria-label={`Play ${track.title}`}
                  >
                    <span className={styles.playIconCircle}>
                      {isPlayingThis ? <PauseIcon /> : <PlayIcon />}
                    </span>
                    <span className={styles.playBtnLabel}>
                      {isPlayingThis ? 'Pause Track' : 'Play Track'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Frosted Info Plate */}
              <div className={styles.cardFooter}>
                <div className={styles.footerLeft}>
                  <h3 className={styles.footerTitle}>{track.title}</h3>
                  <p className={styles.footerSubtitle}>
                    {track.director ? `Directed by ${track.director}` : `By ${track.artist}`}
                  </p>
                </div>

                <div className={styles.footerPill}>
                  <span>{track.year || '2024'}</span>
                  <span className={styles.pillDot}>•</span>
                  <span>{track.genre}</span>
                  {track.rating && (
                    <>
                      <span className={styles.pillDot}>•</span>
                      <span className={styles.rating}>★ {track.rating}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Navigation Chevrons */}
      <button
        className={`${styles.navBtn} ${styles.prevBtn}`}
        onClick={handlePrev}
        aria-label="Previous card"
        title="Previous Card (←)"
      >
        ‹
      </button>
      <button
        className={`${styles.navBtn} ${styles.nextBtn}`}
        onClick={handleNext}
        aria-label="Next card"
        title="Next Card (→)"
      >
        ›
      </button>

      {/* Bottom Floating Glassy Player Pill Bar (Just like the video!) */}
      <div className={styles.bottomPillBar}>
        {/* Playback Controls */}
        <div className={styles.pillControls}>
          <button
            className={styles.pillBtn}
            onClick={handlePrev}
            aria-label="Previous track"
            title="Previous"
          >
            <PrevIcon />
          </button>
          <button
            className={`${styles.pillBtn} ${styles.pillPlayBtn}`}
            onClick={() => onPlayTrack(activeTrack)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title="Play / Pause"
          >
            {isPlaying && (currentTrack?.id === activeTrack.id || currentTrack?.title === activeTrack.title) ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>
          <button
            className={styles.pillBtn}
            onClick={handleNext}
            aria-label="Next track"
            title="Next"
          >
            <NextIcon />
          </button>
        </div>

        {/* Active Track Highlight Pill */}
        <div className={styles.pillTrackInfo}>
          <img
            src={activeTrack.artwork}
            alt=""
            className={styles.pillThumb}
          />
          <div className={styles.pillText}>
            <span className={styles.pillTitle}>{activeTrack.title}</span>
            <span className={styles.pillArtist}>{activeTrack.artist}</span>
          </div>

          {/* Equalizer animation */}
          <div className={styles.pillWave}>
            <span className={styles.pillBar} />
            <span className={styles.pillBar} />
            <span className={styles.pillBar} />
          </div>

          {/* Add to Queue Button */}
          {onAddToQueue && (
            <button
              className={styles.pillQueueBtn}
              onClick={() => onAddToQueue(activeTrack)}
              aria-label="Add to Queue"
              title="Add to Queue"
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
