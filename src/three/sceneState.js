import { ENVIRONMENTS, DEFAULT_ENVIRONMENT } from '../constants/environments'

/**
 * Shared, eased "what is visible right now" values, written by ThemeController every frame.
 * `env[id]` is 0..1 per world (so two worlds cross-fade during a switch), the rest are layer weights
 * combining the active world and the visualizer mode.
 */
export const sceneState = {
  env: Object.fromEntries(ENVIRONMENTS.map((e) => [e.id, e.id === DEFAULT_ENVIRONMENT ? 1 : 0])),
  orb: 1,
  particles: 1,
  terrain: 0,
  spectrum: 0,
}
