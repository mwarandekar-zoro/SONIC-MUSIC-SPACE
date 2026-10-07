import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, MathUtils } from 'three'
import { useVisualizerStore } from '../store/visualizerStore'
import { ENVIRONMENTS, getEnvironment } from '../constants/environments'
import { getMode } from '../constants/modes'
import { theme } from './themeState'
import { sceneState } from './sceneState'

const EASE = 0.004 // lower = slower blend between environments and modes

/** Eases the theme, the world cross-fade and the layer weights towards the chosen environment and mode. */
export default function ThemeController() {
  const lastEnv = useRef(null)
  const target = useMemo(() => ({ accent: new Color(), secondary: new Color(), background: new Color(), distance: 6.5 }), [])

  useFrame((state, delta) => {
    const { environment: id, mode } = useVisualizerStore.getState()
    const env = getEnvironment(id)
    if (id !== lastEnv.current) {
      target.accent.set(env.color)
      target.secondary.set(env.secondary)
      target.background.set(env.background)
      target.distance = env.cameraDistance
      lastEnv.current = id
    }

    const k = 1 - Math.pow(EASE, delta)
    theme.accent.lerp(target.accent, k)
    theme.secondary.lerp(target.secondary, k)
    theme.background.lerp(target.background, k)
    theme.cameraDistance = MathUtils.lerp(theme.cameraDistance, target.distance, k)

    const look = getMode(mode).look
    for (const e of ENVIRONMENTS) sceneState.env[e.id] = MathUtils.lerp(sceneState.env[e.id], e.id === id ? 1 : 0, k)
    sceneState.orb = MathUtils.lerp(sceneState.orb, look.orb, k)
    sceneState.particles = MathUtils.lerp(sceneState.particles, look.particles, k)
    sceneState.terrain = MathUtils.lerp(sceneState.terrain, Math.max(look.terrain, env.look.terrain), k)
    sceneState.spectrum = MathUtils.lerp(sceneState.spectrum, Math.max(look.spectrum, env.look.spectrum), k)

    if (state.scene.background?.isColor) state.scene.background.copy(theme.background)
    if (state.scene.fog) state.scene.fog.color.copy(theme.background)
  })

  return null
}
