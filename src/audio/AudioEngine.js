import { AudioAnalyzer } from './AudioAnalyzer'
import { clamp } from '../utils/math'

const LOAD_TIMEOUT_MS = 20000

const MEDIA_ERROR_MESSAGES = {
  2: 'The file could not be read. Try choosing it again.',
  3: 'This file looks corrupted or cannot be decoded.',
  4: 'Your browser cannot play this audio format. Try MP3, WAV or OGG.',
}

/**
 * Owns the audio pipeline:
 * File -> HTMLAudioElement -> MediaElementSource -> AnalyserNode -> GainNode -> speakers.
 * The analyser sits before the gain, so muting does not flatten the visuals.
 * Audio never leaves the browser.
 */
class AudioEngine {
  constructor() {
    this.listeners = { state: new Set(), error: new Set(), ended: new Set() }
    this.context = null
    this.audio = null
    this.gain = null
    this.analyzer = null
    this.objectUrl = null
    this.loadToken = 0
    this.volume = 0.8
  }

  on(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = new Set()
    this.listeners[event].add(handler)
    return () => this.listeners[event].delete(handler)
  }

  emit(event, payload) {
    this.listeners[event]?.forEach((handler) => handler(payload))
  }

  emitState() {
    this.emit('state', { isPlaying: this.isPlaying, duration: this.duration })
  }

  /** Builds the audio graph once. Must run from a user gesture so the browser allows audio. */
  init() {
    if (this.context) return
    const Context = window.AudioContext || window.webkitAudioContext
    if (!Context) throw new Error('This browser does not support the Web Audio API.')

    try {
      this.context = new Context()
      this.audio = new Audio()
      this.audio.preload = 'auto'
      this.audio.crossOrigin = 'anonymous'

      const source = this.context.createMediaElementSource(this.audio)
      this.analyzer = new AudioAnalyzer(this.context)
      this.gain = this.context.createGain()
      this.gain.gain.value = this.volume ** 2
      source.connect(this.analyzer.node)
      this.analyzer.node.connect(this.gain)
      this.gain.connect(this.context.destination)

      for (const type of ['play', 'pause', 'durationchange']) {
        this.audio.addEventListener(type, () => this.emitState())
      }
      this.audio.addEventListener('ended', () => {
        this.emitState()
        this.emit('ended')
      })
    } catch (error) {
      this.dispose()
      throw new Error('The audio engine could not start in this browser.')
    }
  }

  get hasSource() { return Boolean(this.audio?.src) }
  get isPlaying() { return Boolean(this.audio && !this.audio.paused && !this.audio.ended) }
  get currentTime() { return this.audio?.currentTime ?? 0 }
  get duration() { return Number.isFinite(this.audio?.duration) ? this.audio.duration : 0 }

  async resume() {
    if (this.context?.state === 'suspended') {
      try { await this.context.resume() } catch { /* handled when play() fails */ }
    }
  }

  /** Resolves once metadata is ready. Rejects with a user-friendly message. Supports File, Blob, or URL string. */
  async load(source) {
    this.init()
    const token = ++this.loadToken
    await this.resume()

    this.audio.pause()
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl)
      this.objectUrl = null
    }

    let targetSrc = ''
    if (typeof source === 'string') {
      targetSrc = source
    } else if (source instanceof Blob || source instanceof File) {
      this.objectUrl = URL.createObjectURL(source)
      targetSrc = this.objectUrl
    } else {
      throw new Error('Unsupported audio source format.')
    }

    this.analyzer.reset()

    const audio = this.audio
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer)
        audio.removeEventListener('loadedmetadata', onReady)
        audio.removeEventListener('error', onError)
      }
      const onReady = () => { cleanup(); resolve() }
      const onError = () => {
        cleanup()
        const isUrl = typeof source === 'string'
        const customMsg = isUrl
          ? `Could not load track from "${source}". Please check if the file is in public/music/.`
          : (MEDIA_ERROR_MESSAGES[audio.error?.code] ?? 'This audio file could not be loaded.')
        reject(new Error(customMsg))
      }
      const timer = setTimeout(() => { cleanup(); reject(new Error('Loading audio took too long.')) }, LOAD_TIMEOUT_MS)
      audio.addEventListener('loadedmetadata', onReady)
      audio.addEventListener('error', onError)
      audio.src = targetSrc
      audio.load()
    })

    if (token !== this.loadToken) {
      const error = new Error('Superseded by a newer track.')
      error.name = 'SupersededError'
      throw error
    }
    this.emitState()
  }

  async play() {
    if (!this.hasSource) return
    await this.resume()
    try {
      await this.audio.play()
    } catch (error) {
      if (error.name === 'AbortError') return
      this.emit('error', error.name === 'NotAllowedError'
        ? 'Your browser blocked autoplay. Press play to start.'
        : 'Playback could not start.')
    }
  }

  pause() { this.audio?.pause() }

  toggle() {
    if (!this.hasSource) return
    return this.isPlaying ? this.pause() : this.play()
  }

  seek(seconds) {
    if (!this.hasSource) return
    this.audio.currentTime = clamp(seconds, 0, this.duration || 0)
  }

  seekBy(delta) { this.seek(this.currentTime + delta) }

  /** Smooth, perceptual volume (0..1) with no clicks. */
  setVolume(volume) {
    this.volume = clamp(volume)
    if (this.gain) this.gain.gain.setTargetAtTime(this.volume ** 2, this.context.currentTime, 0.03)
  }

  /** Called once per frame by the 3D loop. */
  update(dt, sensitivity) {
    this.analyzer?.update(dt, sensitivity)
  }

  dispose() {
    this.audio?.pause()
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl)
    this.objectUrl = null
    this.context?.close().catch(() => {})
    this.context = this.audio = this.gain = this.analyzer = null
  }
}

export const audioEngine = new AudioEngine()
