export const MAX_FILE_BYTES = 200 * 1024 * 1024 // 200 MB
export const ACCEPT_ATTR = 'audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.opus,.weba'

const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus', 'weba', 'webm']

const getExtension = (name) => (name.includes('.') ? name.split('.').pop().toLowerCase() : '')

/** Quick, synchronous checks. Whether the browser can really decode it is checked in Phase 4. */
export function validateAudioFile(file) {
  if (!file) return { ok: false, message: 'No file was selected.' }
  if (file.size === 0) return { ok: false, message: 'That file is empty. Try a different track.' }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, message: 'That file is over 200 MB. Try a smaller or compressed version.' }
  }
  const looksLikeAudio = file.type.startsWith('audio/') || AUDIO_EXTENSIONS.includes(getExtension(file.name))
  if (!looksLikeAudio) {
    return { ok: false, message: 'That does not look like an audio file. Try MP3, WAV or OGG.' }
  }
  return { ok: true }
}

/** Plain object stored in state. The File itself is kept so Phase 4 can play it. */
export function describeFile(file) {
  const ext = getExtension(file.name)
  return {
    file,
    fileName: file.name,
    name: file.name.replace(/\.[^.]+$/, '') || file.name,
    artist: null, // filled from metadata in Phase 4
    format: (ext || file.type.split('/')[1] || 'audio').toUpperCase(),
    sizeMB: file.size / (1024 * 1024),
  }
}
