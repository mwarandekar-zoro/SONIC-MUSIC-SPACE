import { useEffect } from 'react'
import { useVisualizerStore } from '../store/visualizerStore'

/** Keeps `isFullscreen` in the store in sync with the browser (including when the user presses ESC). */
export default function useFullscreenSync() {
  const setFullscreen = useVisualizerStore((s) => s.setFullscreen)

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [setFullscreen])
}
