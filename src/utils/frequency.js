import { clamp } from './math'

/**
 * Frequency bands in Hz. This is the single place to tune the analysis.
 * `floor` is the raw level treated as silence for that band and `gain` boosts quiet bands,
 * so bass, mids and treble all land in a similar 0..1 range for typical music.
 */
export const FREQUENCY_BANDS = {
  bass: { min: 20, max: 250, floor: 0.35, gain: 1 },
  lowMid: { min: 250, max: 500, floor: 0.3, gain: 1.05 },
  mid: { min: 500, max: 2000, floor: 0.25, gain: 1.15 },
  highMid: { min: 2000, max: 6000, floor: 0.15, gain: 1.3 },
  treble: { min: 6000, max: 16000, floor: 0.05, gain: 1.6 },
}

export const BAND_NAMES = Object.keys(FREQUENCY_BANDS)

/** Converts a band in Hz to an inclusive [lo, hi] range of FFT bins. */
export function getBinRange(band, sampleRate, fftSize) {
  const binCount = fftSize / 2
  const hzPerBin = sampleRate / fftSize
  const lo = clamp(Math.round(band.min / hzPerBin), 1, binCount - 2)
  const hi = clamp(Math.round(band.max / hzPerBin), lo + 1, binCount - 1)
  return [lo, hi]
}

/** Mean of a bin range, from byte data (0..255) to 0..1. */
export function averageBins(data, lo, hi) {
  let sum = 0
  for (let i = lo; i <= hi; i++) sum += data[i]
  return sum / ((hi - lo + 1) * 255)
}

/** Removes the noise floor and applies the band gain. Result is 0..1. */
export const shapeBand = (raw, band) => clamp(((raw - band.floor) / (1 - band.floor)) * band.gain)
