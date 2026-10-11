import { audioEngine } from './AudioEngine'
import { readMetadata } from './metadata'
import { useVisualizerStore } from '../store/visualizerStore'
import { ACCEPT_ATTR, describeFile, validateAudioFile } from '../utils/audioFile'

/**
 * Loads a built-in library track into AudioEngine, registers it in store,
 * and starts playback immediately.
 */
export async function loadBuiltInTrack(track) {
  const store = useVisualizerStore.getState()
  store.setLoadingTrack(true)

  try {
    // Runs inside the user's click gesture, unlocking the AudioContext
    await audioEngine.load(track.src)
  } catch (error) {
    if (error.name !== 'SupersededError') {
      store.pushToast(error.message, 'error')
    }
    useVisualizerStore.getState().setLoadingTrack(false)
    return false
  }

  const previous = useVisualizerStore.getState().track
  if (previous?.artworkUrl && previous?.isLocal) {
    URL.revokeObjectURL(previous.artworkUrl)
  }

  const normalizedTrack = {
    id: track.id,
    name: track.title,
    title: track.title,
    artist: track.artist || 'Unknown Artist',
    album: track.album || null,
    genre: track.genre || null,
    format: (track.src.split('.').pop() || 'AUDIO').toUpperCase(),
    duration: audioEngine.duration || track.duration || 0,
    artworkUrl: track.artwork || null,
    src: track.src,
    isBuiltIn: true,
    isLocal: false,
  }

  const s = useVisualizerStore.getState()
  s.setTrack(normalizedTrack)
  s.setLoadingTrack(false)
  s.syncQueueWithTrack(normalizedTrack)

  audioEngine.play()
  return true
}

/**
 * Entry point for user-uploaded music (file picker and drag and drop).
 * Validates, loads into the engine, publishes the track, starts playback,
 * then fills in metadata when it is available.
 */
export async function loadTrackFile(file) {
  const store = useVisualizerStore.getState()
  const check = validateAudioFile(file)
  if (!check.ok) return store.pushToast(check.message, 'error')

  store.setLoadingTrack(true)
  try {
    // Runs synchronously inside user gesture, unlocking AudioContext
    await audioEngine.load(file)
  } catch (error) {
    if (error.name !== 'SupersededError') store.pushToast(error.message, 'error')
    useVisualizerStore.getState().setLoadingTrack(false)
    return false
  }

  const previous = useVisualizerStore.getState().track
  if (previous?.artworkUrl && previous?.isLocal) {
    URL.revokeObjectURL(previous.artworkUrl)
  }

  const track = {
    ...describeFile(file),
    id: `upload-${Date.now()}`,
    title: file.name.replace(/\.[^.]+$/, '') || file.name,
    duration: audioEngine.duration,
    isBuiltIn: false,
    isLocal: true,
  }

  const s = useVisualizerStore.getState()
  s.setTrack(track)
  s.setLoadingTrack(false)
  s.syncQueueWithTrack(track)

  audioEngine.play()

  // Read metadata asynchronously
  readMetadata(file).then((meta) => {
    if (!meta || useVisualizerStore.getState().track?.file !== file) return
    const artworkUrl = meta.artwork ? URL.createObjectURL(meta.artwork) : null
    useVisualizerStore.getState().setTrack({
      ...useVisualizerStore.getState().track,
      name: meta.title || track.name,
      title: meta.title || track.name,
      artist: meta.artist || null,
      album: meta.album || null,
      artworkUrl,
    })
  })

  return true
}

/** Opens the system file picker. Must be called from a click handler. */
export function openFilePicker() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = ACCEPT_ATTR
  input.addEventListener('change', () => input.files?.[0] && loadTrackFile(input.files[0]))
  input.click()
}

/** Advances to the next track respecting queue, repeatMode, and shuffle */
export async function playNextTrack(autoAdvance = false) {
  const s = useVisualizerStore.getState()
  const queue = s.queue
  if (!queue || queue.length === 0) return

  if (s.repeatMode === 'one' && autoAdvance) {
    audioEngine.seek(0)
    audioEngine.play()
    return
  }

  let nextIdx
  if (s.shuffle && queue.length > 1) {
    let rand = Math.floor(Math.random() * queue.length)
    if (rand === s.queueIndex) rand = (rand + 1) % queue.length
    nextIdx = rand
  } else {
    nextIdx = s.queueIndex + 1
    if (nextIdx >= queue.length) {
      if (s.repeatMode === 'off' && autoAdvance) {
        audioEngine.pause()
        return
      }
      nextIdx = 0
    }
  }

  const nextTrack = queue[nextIdx]
  if (!nextTrack) return

  if (nextTrack.file) {
    await loadTrackFile(nextTrack.file)
  } else {
    await loadBuiltInTrack(nextTrack)
  }
}

/** Moves to previous track or seeks to beginning if > 3s played */
export async function playPrevTrack() {
  const s = useVisualizerStore.getState()
  if (audioEngine.currentTime > 3) {
    audioEngine.seek(0)
    return
  }

  const queue = s.queue
  if (!queue || queue.length === 0) return

  let prevIdx = s.queueIndex - 1
  if (prevIdx < 0) {
    prevIdx = s.repeatMode === 'all' ? queue.length - 1 : 0
  }

  const prevTrack = queue[prevIdx]
  if (!prevTrack) return

  if (prevTrack.file) {
    await loadTrackFile(prevTrack.file)
  } else {
    await loadBuiltInTrack(prevTrack)
  }
}

/** Plays specific track from queue by index */
export async function playTrackFromQueue(index) {
  const s = useVisualizerStore.getState()
  const track = s.queue[index]
  if (!track) return

  if (track.file) {
    await loadTrackFile(track.file)
  } else {
    await loadBuiltInTrack(track)
  }
}

/** Plays built-in track by ID */
export async function playBuiltInTrackById(id) {
  const s = useVisualizerStore.getState()
  const track = s.library.find((t) => t.id === id)
  if (!track) return
  return loadBuiltInTrack(track)
}

