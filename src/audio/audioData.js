export const FFT_SIZE = 2048

/**
 * Live audio values, shared by every 3D component.
 * Mutated in place every frame by AudioAnalyzer. It is a plain object and never React state,
 * so reading it from useFrame costs nothing and triggers no re-renders.
 *
 * All levels are smoothed and normalised to 0..1.
 */
export const audioData = {
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  treble: 0,
  average: 0, // mean level across the whole spectrum
  volume: 0, // overall loudness (RMS)
  beat: 0, // spikes to ~1 on a beat, then decays
  beatCount: 0, // increases by one on every beat, handy for "did a beat just happen?" checks
  spectrum: new Uint8Array(FFT_SIZE / 2), // raw frequency bins, 0..255
  waveform: new Uint8Array(FFT_SIZE), // raw time-domain samples, 128 is the centre line
}

const LEVEL_KEYS = ['bass', 'lowMid', 'mid', 'highMid', 'treble', 'average', 'volume', 'beat']

export function resetAudioData() {
  for (const key of LEVEL_KEYS) audioData[key] = 0
  audioData.beatCount = 0
  audioData.spectrum.fill(0)
  audioData.waveform.fill(128)
}
