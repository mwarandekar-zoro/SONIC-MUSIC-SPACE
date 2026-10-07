// The four worlds. `color` is the main accent (also used by the UI).
// The 3D scene blends towards these values when the environment changes.
// `look` is how visible the terrain and the spectrum ring are by default in that world.
export const ENVIRONMENTS = [
  { id: 'nebula', label: 'Nebula', tagline: 'Drifting dust and slow light', color: '#9a86ff', secondary: '#ff4fa3', background: '#07050f', cameraDistance: 6.5, look: { terrain: 0, spectrum: 0 } },
  { id: 'cyber', label: 'Cyber grid', tagline: 'Neon floor, sharp geometry', color: '#35e0ff', secondary: '#8a5cff', background: '#030a10', cameraDistance: 6, look: { terrain: 0, spectrum: 0.75 } },
  { id: 'deep-space', label: 'Deep space', tagline: 'Stars, scale and silence', color: '#7aa2ff', secondary: '#ffd9a8', background: '#04060f', cameraDistance: 8, look: { terrain: 0.85, spectrum: 0 } },
  { id: 'void', label: 'Void', tagline: 'Nothing but the sound', color: '#ff4fa3', secondary: '#9a86ff', background: '#050407', cameraDistance: 5.5, look: { terrain: 0, spectrum: 0 } },
]

export const DEFAULT_ENVIRONMENT = 'nebula'

export const getEnvironment = (id) =>
  ENVIRONMENTS.find((env) => env.id === id) ?? ENVIRONMENTS[0]
