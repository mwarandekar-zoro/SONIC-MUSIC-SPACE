import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  // Target coordinates (raw mouse event)
  const mouse = useRef({ x: -100, y: -100 })
  // Lerped coordinates for trailing ring
  const ring = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)

  useEffect(() => {
    // Only enable custom cursor if fine pointer (desktop mouse/trackpad)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mediaQuery.matches) return

    setIsEnabled(true)

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      if (!isVisible) setIsVisible(true)

      // Direct placement of the inner dot (instant response)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }

      // Check if hovering over clickable element
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

    // Smooth RAF loop for the trailing ring
    const render = () => {
      // Linear interpolation (lerp) with 0.18 factor for responsive yet fluid lag
      const factor = 0.18
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
  }, [isVisible])

  if (!isEnabled) return null

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
      <div ref={ringRef} className={styles.cursorRing} />
      <div ref={dotRef} className={styles.cursorDot} />
    </div>
  )
}
