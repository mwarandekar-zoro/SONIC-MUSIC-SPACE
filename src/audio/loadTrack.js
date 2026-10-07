import { audioEngine } from './AudioEngine'
import { readMetadata } from './metadata'
import { useVisualizerStore } from '../store/visualizerStore'
import { ACCEPT_ATTR, describeFile, validateAudioFile } from '../utils/audioFile'

/**
 * The one entry point for new music (file picker and drag and drop).
 * Validates, loads into the engine, publishes the track, starts playback,
 * then fills in metadata when it is available.
 */
export async function loadTrackFile(file) {
  const store = useVisualizerStore.getState()
  const check = validateAudioFile(file)
  if (!check.ok) return store.pushToast(check.message, 'error')

  store.setLoadingTrack(true)
  try {
    // Runs synchronously inside the user's gesture, which unlocks the AudioContext.
    await audioEngine.load(file)
  } catch (error) {
    if (error.name !== 'SupersededError') store.pushToast(error.message, 'error')
    useVisualizerStore.getState().setLoadingTrack(false)
    return
  }

  const previous = useVisualizerStore.getState().track
  if (previous?.artworkUrl) URL.revokeObjectURL(previous.artworkUrl)

  const track = { ...describeFile(file), duration: audioEngine.duration }
  useVisualizerStore.getState().setTrack(track)
  useVisualizerStore.getState().setLoadingTrack(false)
  audioEngine.play()

  const meta = await readMetadata(file)
  if (!meta || useVisualizerStore.getState().track?.file !== file) return
  const artworkUrl = meta.artwork ? URL.createObjectURL(meta.artwork) : null
  useVisualizerStore.getState().setTrack({
    ...useVisualizerStore.getState().track,
    name: meta.title || track.name,
    artist: meta.artist || null,
    album: meta.album || null,
    artworkUrl,
  })
}

/** Opens the system file picker. Must be called from a click handler. */
export function openFilePicker() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = ACCEPT_ATTR
  input.addEventListener('change', () => input.files?.[0] && loadTrackFile(input.files[0]))
  input.click()
}
