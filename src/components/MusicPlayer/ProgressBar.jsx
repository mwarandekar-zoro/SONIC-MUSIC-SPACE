import { useEffect, useRef, useState } from 'react'
import { useVisualizerStore } from '../../store/visualizerStore'
import { audioEngine } from '../../audio/AudioEngine'
import { clamp } from '../../utils/math'
import { formatTime } from '../../utils/formatTime'
import styles from './MusicPlayer.module.css'

const KEY_SEEK_SECONDS = 5

/**
 * Seekable progress bar. The fill is moved straight on the DOM node every frame, and React only
 * re-renders when the displayed second changes.
 */
export default function ProgressBar() {
  const duration = useVisualizerStore((s) => s.duration)
  const hasTrack = useVisualizerStore((s) => Boolean(s.track))
  const [second, setSecond] = useState(0)
  const bar = useRef(null)
  const fill = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    let frame
    let lastSecond = -1
    const tick = () => {
      const time = audioEngine.currentTime
      const total = audioEngine.duration
      if (fill.current) fill.current.style.width = `${total ? (time / total) * 100 : 0}%`
      const whole = Math.floor(time)
      if (whole !== lastSecond) { lastSecond = whole; setSecond(whole) }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const seekFromPointer = (e) => {
    const rect = bar.current.getBoundingClientRect()
    audioEngine.seek(clamp((e.clientX - rect.left) / rect.width) * duration)
  }

  const onKeyDown = (e) => {
    const step = { ArrowLeft: -KEY_SEEK_SECONDS, ArrowRight: KEY_SEEK_SECONDS }[e.key]
    if (step !== undefined) audioEngine.seekBy(step)
    else if (e.key === 'Home') audioEngine.seek(0)
    else if (e.key === 'End') audioEngine.seek(duration)
    else return
    e.preventDefault()
  }

  return (
    <div className={styles.progress}>
      <span>{formatTime(second)}</span>
      <div
        ref={bar}
        className={styles.barHit}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={second}
        aria-valuetext={`${formatTime(second)} of ${formatTime(duration)}`}
        aria-disabled={!hasTrack}
        tabIndex={hasTrack ? 0 : -1}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          if (!hasTrack) return
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          seekFromPointer(e)
        }}
        onPointerMove={(e) => dragging.current && seekFromPointer(e)}
        onPointerUp={() => { dragging.current = false }}
        onPointerCancel={() => { dragging.current = false }}
      >
        <div className={styles.bar}>
          <div ref={fill} className={styles.fill} />
        </div>
      </div>
      <span>{formatTime(duration)}</span>
    </div>
  )
}
