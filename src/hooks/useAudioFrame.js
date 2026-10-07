import { useEffect, useRef } from 'react'
import { audioData } from '../audio/audioData'

/**
 * Runs `callback(audioData)` every animation frame, outside React's render cycle.
 * Use it for DOM visuals (meters, glowing text) that follow the music, so React never re-renders.
 */
export default function useAudioFrame(callback) {
  const latest = useRef(callback)
  useEffect(() => { latest.current = callback })

  useEffect(() => {
    let frame
    const loop = () => {
      latest.current(audioData)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])
}
