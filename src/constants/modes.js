// Visualizer modes. Every mode uses the same audio data and only changes what is emphasised.
// orb / particles scale the central object and the particle field; terrain / spectrum
// are the minimum visibility of those layers (the active world can add more).
export const MODES = [
  { id: 'orbit', label: 'Orbit', look: { orb: 1, particles: 1, terrain: 0, spectrum: 0 } },
  { id: 'terrain', label: 'Terrain', look: { orb: 0.6, particles: 0.7, terrain: 1, spectrum: 0 } },
  { id: 'pulse', label: 'Pulse', look: { orb: 1.3, particles: 0.8, terrain: 0, spectrum: 0 } },
  { id: 'spectrum', label: 'Spectrum', look: { orb: 0.65, particles: 0.8, terrain: 0, spectrum: 1 } },
  { id: 'particles', label: 'Particles', look: { orb: 0.5, particles: 1.7, terrain: 0, spectrum: 0 } },
]

export const DEFAULT_MODE = 'orbit'

export const getMode = (id) => MODES.find((mode) => mode.id === id) ?? MODES[0]
