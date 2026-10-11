import { useEffect } from 'react'
import { useVisualizerStore } from '../store/visualizerStore'
import { audioEngine } from '../audio/AudioEngine'
import { playNextTrack, playPrevTrack } from '../audio/loadTrack'
import { toggleFullscreen } from '../utils/fullscreen'
import { takeScreenshot } from '../utils/screenshot'
import { MODES } from '../constants/modes'

const SEEK_SECONDS = 5

const isTyping = (el) => {
  if (!el) return false
  if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true
  return el.tagName === 'INPUT' && el.type !== 'range' && el.type !== 'checkbox'
}

// Sliders handle arrow keys themselves; so do buttons for Space.
const ownsArrows = (el) => el?.getAttribute?.('role') === 'slider' || (el?.tagName === 'INPUT' && el.type === 'range')

/** Global shortcuts: Space, arrows, M, P, E, F, S, L, N, B, ?, Esc. */
export default function useKeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return
      const { stage, panel, togglePanel, closePanel, toggleEnvOpen, toggleMuted } = useVisualizerStore.getState()
      if (stage !== 'experience') return

      switch (e.key.toLowerCase()) {
        case ' ':
          if (e.target.tagName === 'BUTTON') return // the focused button handles Space itself
          audioEngine.toggle()
          break
        case 'arrowleft': if (ownsArrows(e.target)) return; audioEngine.seekBy(-SEEK_SECONDS); break
        case 'arrowright': if (ownsArrows(e.target)) return; audioEngine.seekBy(SEEK_SECONDS); break
        case 'm': toggleMuted(); break
        case 'p': takeScreenshot(); break
        case 's': togglePanel('settings'); break
        case 'l': togglePanel('library'); break
        case 'n': playNextTrack(false); break
        case 'b': playPrevTrack(); break
        case '?': togglePanel('help'); break
        case 'e': toggleEnvOpen(); break
        case 'f': toggleFullscreen(); break
        case 'escape': if (panel) closePanel(); break
        default: {
          const mode = MODES[Number(e.key) - 1] // keys 1-5
          if (!mode) return
          useVisualizerStore.getState().setMode(mode.id)
        }
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
