import { useEffect, useRef, useState } from 'react'
import { useVisualizerStore } from '../../store/visualizerStore'
import useAudioFrame from '../../hooks/useAudioFrame'
import styles from './CustomCursor.module.css'

const INSTRUMENT_STYLES = ['guitar', 'note', 'sax']

export default function CustomCursor() {
  const cursorStyle = useVisualizerStore((s) => s.cursorStyle)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  // Instrument cursors: outer wrapper (position) and inner wrapper (audio scale/glow)
  const posRef = useRef(null)
  const instRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  // Target coordinates
  const mouse = useRef({ x: -100, y: -100 })
  // Lerped coordinates for trailing effect
  const ring = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)

  // Instrument cursors pulse with audio — only touches instRef (inner wrapper)
  useAudioFrame((data) => {
    if (!INSTRUMENT_STYLES.includes(cursorStyle)) return
    const el = instRef.current
    if (!el) return
    const bass = data.bass ?? 0
    const beat = data.beat ?? 0
    const treble = data.treble ?? 0

    if (cursorStyle === 'guitar') {
      const glow = 8 + bass * 28 + beat * 18
      const scale = 1 + bass * 0.3 + beat * 0.2
      el.style.filter = `drop-shadow(0 0 ${glow.toFixed(1)}px #ff4fa3) drop-shadow(0 0 ${(glow * 0.6).toFixed(1)}px #9a86ff)`
      el.style.transform = `scale(${scale.toFixed(3)})`
    } else if (cursorStyle === 'note') {
      const glow = 6 + beat * 24 + bass * 12
      const scale = 1 + beat * 0.35
      el.style.filter = `drop-shadow(0 0 ${glow.toFixed(1)}px #05d5ff) drop-shadow(0 0 ${(glow * 0.5).toFixed(1)}px #9a86ff)`
      el.style.transform = `scale(${scale.toFixed(3)})`
    } else if (cursorStyle === 'sax') {
      const glow = 6 + treble * 22 + beat * 14
      const scale = 1 + treble * 0.25 + beat * 0.15
      el.style.filter = `drop-shadow(0 0 ${glow.toFixed(1)}px #ffd32a) drop-shadow(0 0 ${(glow * 0.5).toFixed(1)}px #ff9f43)`
      el.style.transform = `scale(${scale.toFixed(3)})`
    }
  })

  // Manage class on body to hide/show native OS cursor
  useEffect(() => {
    if (cursorStyle === 'default' || !isEnabled) {
      document.body.classList.remove('custom-cursor-enabled')
    } else {
      document.body.classList.add('custom-cursor-enabled')
    }
    return () => {
      document.body.classList.remove('custom-cursor-enabled')
    }
  }, [cursorStyle, isEnabled])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mediaQuery.matches) return

    setIsEnabled(true)

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      if (!isVisible) setIsVisible(true)

      if (INSTRUMENT_STYLES.includes(cursorStyle)) {
        // Instrument cursors: position the outer wrapper via top/left
        // Audio-driven scale/glow goes on instRef (inner), not here
        if (posRef.current) {
          posRef.current.style.left = `${e.clientX}px`
          posRef.current.style.top = `${e.clientY}px`
        }
      } else {
        // Non-instrument cursors: position dot via transform
        if (dotRef.current) {
          const isArrowLike = cursorStyle === 'arrow'
          if (isArrowLike) {
            dotRef.current.style.top = `${e.clientY}px`
            dotRef.current.style.left = `${e.clientX}px`
          } else {
            dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
          }
        }
      }

      // Check if hovering clickable element
      const target = e.target
      if (target && target.closest) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], [role="tab"], [role="slider"], .clickable, label')
        )
        setIsHovering(isClickable)
      }
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)
    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => {
      setIsVisible(false)
      setIsHovering(false)
      setIsClicking(false)
    }

    // Smooth RAF loop for trailing elements (non-instrument only)
    const render = () => {
      const factor = cursorStyle === 'orb' ? 0.22 : 0.18
      ring.current.x += (mouse.current.x - ring.current.x) * factor
      ring.current.y += (mouse.current.y - ring.current.y) * factor

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      }

      rafId.current = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)

    rafId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [cursorStyle, isVisible])

  // Don't render custom UI if user prefers default OS cursor or on mobile
  if (!isEnabled || cursorStyle === 'default') return null

  const containerClasses = [
    styles.cursorContainer,
    isHovering ? styles.hovering : '',
    isClicking ? styles.clicking : '',
    !isVisible ? styles.hidden : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses} aria-hidden="true">
      {/* 1. Cyber Ring: Dot + Trailing Ring */}
      {cursorStyle === 'cyber' && (
        <>
          <div ref={ringRef} className={styles.cyberRing} />
          <div ref={dotRef} className={styles.cyberDot} />
        </>
      )}

      {/* 2. HUD Reticle / Crosshair */}
      {cursorStyle === 'crosshair' && (
        <>
          <div ref={ringRef} className={styles.crosshairReticle}>
            <span className={`${styles.crosshairCorner} ${styles.tl}`} />
            <span className={`${styles.crosshairCorner} ${styles.tr}`} />
            <span className={`${styles.crosshairCorner} ${styles.bl}`} />
            <span className={`${styles.crosshairCorner} ${styles.br}`} />
          </div>
          <div ref={dotRef} className={styles.crosshairDot} />
        </>
      )}

      {/* 3. Pulse Orb */}
      {cursorStyle === 'orb' && (
        <div ref={ringRef} className={styles.pulseOrb} />
      )}

      {/* 4. Cyber Arrow */}
      {cursorStyle === 'arrow' && (
        <div ref={dotRef} className={styles.cyberArrow}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 3L11.5 25L15.5 15.5L25 11.5L3 3Z"
              fill="rgba(14, 12, 26, 0.85)"
              stroke="#05d5ff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M10 11L18 19"
              stroke="#9a86ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* 5. Guitar Cursor — bass reactive */}
      {cursorStyle === 'guitar' && (
        <div ref={posRef} className={styles.instPos}>
          <div ref={instRef} className={styles.guitarCursor}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Neck */}
              <line x1="6" y1="6" x2="22" y2="22" stroke="#9a86ff" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Tuner pegs */}
              <circle cx="5" cy="7" r="2" fill="#9a86ff" opacity="0.8"/>
              <circle cx="8" cy="4" r="2" fill="#9a86ff" opacity="0.8"/>
              {/* Body */}
              <ellipse cx="27" cy="27" rx="6.5" ry="6" fill="rgba(14,12,26,0.85)" stroke="#ff4fa3" strokeWidth="1.8"/>
              {/* Sound hole */}
              <circle cx="27" cy="27" r="2.5" fill="none" stroke="#9a86ff" strokeWidth="1.2"/>
              {/* Bridge */}
              <line x1="22" y1="30" x2="32" y2="30" stroke="#ff4fa3" strokeWidth="1.2" strokeLinecap="round"/>
              {/* Strings */}
              <line x1="8" y1="6" x2="23" y2="24" stroke="#05d5ff" strokeWidth="0.8" opacity="0.7"/>
              <line x1="6" y1="8" x2="22" y2="26" stroke="#05d5ff" strokeWidth="0.8" opacity="0.5"/>
            </svg>
          </div>
        </div>
      )}

      {/* 6. Music Note Cursor — beat reactive */}
      {cursorStyle === 'note' && (
        <div ref={posRef} className={styles.instPos}>
          <div ref={instRef} className={styles.noteCursor}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Note stem */}
              <line x1="20" y1="4" x2="20" y2="22" stroke="#05d5ff" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Note flag */}
              <path d="M20 4 Q28 8 24 14" stroke="#05d5ff" strokeWidth="2" strokeLinecap="round" fill="none"/>
              {/* Note head */}
              <ellipse cx="16" cy="23" rx="5" ry="3.5" fill="#05d5ff" transform="rotate(-15 16 23)"/>
              {/* Shimmer dots */}
              <circle cx="6" cy="10" r="1.5" fill="#9a86ff" opacity="0.7"/>
              <circle cx="27" cy="20" r="1" fill="#9a86ff" opacity="0.5"/>
              <circle cx="10" cy="28" r="1.2" fill="#9a86ff" opacity="0.4"/>
            </svg>
          </div>
        </div>
      )}

      {/* 7. Saxophone Cursor — treble reactive */}
      {cursorStyle === 'sax' && (
        <div ref={posRef} className={styles.instPos}>
          <div ref={instRef} className={styles.saxCursor}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main tube body — curved S shape */}
              <path d="M12 4 Q12 12 18 16 Q26 20 26 28 Q26 33 20 33" stroke="#ffd32a" strokeWidth="3" strokeLinecap="round" fill="none"/>
              {/* Bell flare */}
              <path d="M20 33 Q14 36 10 32 Q8 28 12 26" stroke="#ffd32a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* Mouthpiece */}
              <line x1="12" y1="4" x2="8" y2="2" stroke="#ff9f43" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Keys/holes */}
              <circle cx="18" cy="14" r="1.5" fill="#ff9f43"/>
              <circle cx="21" cy="19" r="1.5" fill="#ff9f43"/>
              <circle cx="24" cy="24" r="1.5" fill="#ff9f43"/>
              <circle cx="23" cy="29" r="1.2" fill="#ff9f43"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
