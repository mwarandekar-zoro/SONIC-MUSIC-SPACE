import { useEffect } from 'react'
import { audioEngine } from '../audio/AudioEngine'
import { useVisualizerStore } from '../store/visualizerStore'

/** Connects the AudioEngine to the UI store: volume goes in, playback state and errors come out. */
export default function useAudio() {
  const volume = useVisualizerStore((s) => s.volume)
  const muted = useVisualizerStore((s) => s.muted)

  useEffect(() => {
    audioEngine.setVolume(muted ? 0 : volume)
  }, [volume, muted])

  useEffect(() => {
    const offState = audioEngine.on('state', ({ isPlaying, duration }) => useVisualizerStore.setState({ isPlaying, duration }))
    const offError = audioEngine.on('error', (message) => useVisualizerStore.getState().pushToast(message, 'error'))
    return () => { offState(); offError() }
  }, [])
}
