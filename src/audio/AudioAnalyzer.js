import { FFT_SIZE, audioData, resetAudioData } from './audioData'
import { BeatDetector } from './beatDetection'
import { BAND_NAMES, FREQUENCY_BANDS, averageBins, getBinRange, shapeBand } from '../utils/frequency'
import { clamp, damp } from '../utils/math'

const ATTACK_RATE = 28 // levels rise quickly...
const RELEASE_RATE = 7 // ...and fall gently, which avoids jitter
const BEAT_DECAY_RATE = 6
const VOLUME_GAIN = 2.6

const smooth = (current, target, dt) => damp(current, target, target > current ? ATTACK_RATE : RELEASE_RATE, dt)

/**
 * Wraps an AnalyserNode. Each frame, update() reads the FFT, turns it into
 * smoothed band levels and a beat signal, and writes them into `audioData`.
 */
export class AudioAnalyzer {
  constructor(context) {
    this.node = context.createAnalyser()
    this.node.fftSize = FFT_SIZE
    this.node.smoothingTimeConstant = 0.78
    this.node.minDecibels = -85
    this.node.maxDecibels = -10

    this.beatDetector = new BeatDetector()
    this.ranges = BAND_NAMES.map((name) => ({
      name,
      band: FREQUENCY_BANDS[name],
      range: getBinRange(FREQUENCY_BANDS[name], context.sampleRate, FFT_SIZE),
    }))
  }

  update(dt, sensitivity = 1, now = performance.now()) {
    const { spectrum, waveform } = audioData
    this.node.getByteFrequencyData(spectrum)
    this.node.getByteTimeDomainData(waveform)

    let bassRaw = 0
    for (const { name, band, range } of this.ranges) {
      const shaped = shapeBand(averageBins(spectrum, range[0], range[1]), band)
      if (name === 'bass') bassRaw = shaped
      audioData[name] = smooth(audioData[name], clamp(shaped * sensitivity), dt)
    }

    audioData.average = smooth(audioData.average, clamp(averageBins(spectrum, 1, spectrum.length - 1) * 2.2 * sensitivity), dt)

    let squares = 0
    for (let i = 0; i < waveform.length; i++) {
      const v = (waveform[i] - 128) / 128
      squares += v * v
    }
    const rms = Math.sqrt(squares / waveform.length)
    audioData.volume = smooth(audioData.volume, clamp(rms * VOLUME_GAIN * sensitivity), dt)

    // Beats use the un-boosted bass so the sensitivity slider does not change what counts as a beat.
    const { hit, strength } = this.beatDetector.update(bassRaw, now)
    if (hit) {
      audioData.beat = Math.max(audioData.beat, 0.6 + 0.4 * strength)
      audioData.beatCount++
    } else {
      audioData.beat = damp(audioData.beat, 0, BEAT_DECAY_RATE, dt)
    }
  }

  reset() {
    this.beatDetector.reset()
    resetAudioData()
  }

  getBass = () => audioData.bass
  getLowMid = () => audioData.lowMid
  getMid = () => audioData.mid
  getHighMid = () => audioData.highMid
  getTreble = () => audioData.treble
  getAverageFrequency = () => audioData.average
  getWaveformData = () => audioData.waveform
  getSpectrumData = () => audioData.spectrum
}
