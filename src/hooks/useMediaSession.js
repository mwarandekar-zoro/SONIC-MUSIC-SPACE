import { useEffect } from 'react'
import { useVisualizerStore } from '../store/visualizerStore'
import { audioEngine } from '../audio/AudioEngine'
import { playNextTrack, playPrevTrack } from '../audio/loadTrack'

/**
 * Sets up the MediaSession API so the browser's lock screen / notification shade
 * shows the song title, artist, artwork, progress scrubbing, and play/pause/skip controls.
 * Works on Android Chrome and modern browsers.
 */
export default function useMediaSession() {
  const track = useVisualizerStore((s) => s.track)
  const isPlaying = useVisualizerStore((s) => s.isPlaying)

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    if (!track) return

    const resolveUrl = (path) => {
      try {
        return new URL(path, window.location.origin).href
      } catch {
        return path
      }
    }

    // Set metadata — shows on lock screen / notification shade
    const artwork = track.artworkUrl
      ? [
          { src: resolveUrl(track.artworkUrl), sizes: '512x512', type: 'image/jpeg' },
          { src: resolveUrl(track.artworkUrl), sizes: '192x192', type: 'image/jpeg' },
        ]
      : [
          { src: resolveUrl('/icon-512.svg'), sizes: '512x512', type: 'image/svg+xml' },
        ]

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || track.name || 'Unknown Track',
      artist: track.artist || 'SONIC//SPACE',
      album: track.album || 'SONIC//SPACE',
      artwork,
    })

    // Update position state if available
    if ('setPositionState' in navigator.mediaSession && track.duration) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, track.duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, audioEngine.currentTime || 0), track.duration),
        })
      } catch {
        // Ignore edge cases where position > duration
      }
    }
  }, [track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    // Sync playback state
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'

    if ('setPositionState' in navigator.mediaSession && track?.duration) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, track.duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, audioEngine.currentTime || 0), track.duration),
        })
      } catch {}
    }
  }, [isPlaying, track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    // Register action handlers for hardware buttons / lock screen controls
    navigator.mediaSession.setActionHandler('play', () => audioEngine.play())
    navigator.mediaSession.setActionHandler('pause', () => audioEngine.pause())
    navigator.mediaSession.setActionHandler('stop', () => audioEngine.pause())
    navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack(false))
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrevTrack())
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      audioEngine.seekBy(-(details.seekOffset ?? 10))
    })
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      audioEngine.seekBy(details.seekOffset ?? 10)
    })
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) {
        audioEngine.seek(details.seekTime)
      }
    })

    return () => {
      ;['play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekbackward', 'seekforward', 'seekto'].forEach(
        (action) => {
          try {
            navigator.mediaSession.setActionHandler(action, null)
          } catch {}
        }
      )
    }
  }, [])
}
