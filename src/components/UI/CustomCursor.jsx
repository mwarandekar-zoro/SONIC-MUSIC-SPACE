import { useEffect, useRef, useState } from 'react'
import { useVisualizerStore } from '../../store/visualizerStore'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const cursorStyle = useVisualizerStore((s) => s.cursorStyle)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  // Target coordinates
  const mouse = useRef({ x: -100, y: -100 })
  // Lerped coordinates for trailing effect
  const ring = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)

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

      // Direct placement of leading point
      if (dotRef.current) {
        if (cursorStyle === 'arrow') {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        } else {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
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

    // Smooth RAF loop for trailing elements
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
    </div>
  )
}
