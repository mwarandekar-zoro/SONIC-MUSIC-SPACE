import { useCallback, useEffect, useState } from 'react'

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const MIN_MS = REDUCED ? 300 : 1600 // long enough to read, short enough not to annoy
const MAX_MS = 5000 // never trap the user behind the loader

/** Ready when the 3D canvas exists, fonts are loaded and the minimum time has passed. */
export default function useBoot() {
  const [sceneReady, setSceneReady] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const min = setTimeout(() => setMinElapsed(true), MIN_MS)
    const max = setTimeout(() => setTimedOut(true), MAX_MS)
    const fonts = document.fonts?.ready ?? Promise.resolve()
    fonts.then(() => setFontsReady(true)).catch(() => setFontsReady(true))
    return () => { clearTimeout(min); clearTimeout(max) }
  }, [])

  const onSceneReady = useCallback(() => setSceneReady(true), [])
  return { booted: (sceneReady && fontsReady && minElapsed) || timedOut, onSceneReady }
}
