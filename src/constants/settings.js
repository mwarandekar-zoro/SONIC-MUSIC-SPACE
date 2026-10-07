// Visualizer settings. The 3D and audio code read these from Phase 6 onwards.
export const SETTING_DEFS = [
  { key: 'sensitivity', label: 'Sensitivity', hint: 'How strongly the world reacts to sound', min: 0.2, max: 2, step: 0.05 },
  { key: 'beatResponse', label: 'Beat response', hint: 'Strength of pulses on each beat', min: 0, max: 2, step: 0.05 },
  { key: 'particleIntensity', label: 'Particles', hint: 'Amount and energy of particles', min: 0, max: 1.5, step: 0.05 },
  { key: 'terrainIntensity', label: 'Terrain', hint: 'Height of the waveform terrain', min: 0, max: 2, step: 0.05 },
  { key: 'bloom', label: 'Bloom', hint: 'Glow around bright areas', min: 0, max: 2, step: 0.05 },
  { key: 'cameraMovement', label: 'Camera movement', hint: 'How much the camera drifts and pulses', min: 0, max: 1.5, step: 0.05 },
]

export const DEFAULT_SETTINGS = {
  sensitivity: 1,
  beatResponse: 1,
  particleIntensity: 1,
  terrainIntensity: 1,
  bloom: 1,
  cameraMovement: 1,
  performanceMode: false,
}
