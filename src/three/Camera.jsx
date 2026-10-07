import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { prefersReducedMotion } from './motion'
import { theme } from './themeState'

export const BASE_FOV = 55
const FOLLOW = 0.02 // lower = floatier camera
const PUSH_FOLLOW = 0.0005 // much snappier, so beat pulses are visible

/**
 * Cinematic camera. Calm by default: a slow sway plus pointer parallax.
 * The music adds: a push towards the orb on bass, a short pulse and FOV kick on beats,
 * a faster drift when the track is energetic, and a tiny roll shake only on strong beats.
 * Reduced motion (or the camera slider at 0) turns all of it off.
 */
export default function CameraRig() {
  const phase = useRef(0)

  useFrame((state, delta) => {
    const { cameraMovement, beatResponse } = useVisualizerStore.getState().settings
    const move = prefersReducedMotion() ? 0 : cameraMovement
    const energy = audioData.average * 0.5 + audioData.volume * 0.5

    phase.current += delta * (1 + energy * 1.5)
    const t = phase.current

    const cam = state.camera
    const goalX = (Math.sin(t * 0.12) * 0.6 + state.pointer.x * 0.8) * move
    const goalY = (Math.cos(t * 0.09) * 0.35 + state.pointer.y * 0.5) * move
    const pulse = (audioData.bass * 0.5 + audioData.beat * 0.7 * beatResponse) * move
    const goalZ = theme.cameraDistance - pulse

    const k = 1 - Math.pow(FOLLOW, delta)
    cam.position.x += (goalX - cam.position.x) * k
    cam.position.y += (goalY - cam.position.y) * k
    cam.position.z += (goalZ - cam.position.z) * (1 - Math.pow(PUSH_FOLLOW, delta))
    cam.lookAt(0, 0, 0)

    const shake = audioData.beat * audioData.beat * 0.012 * beatResponse * move
    cam.rotation.z += Math.sin(t * 60) * shake

    const goalFov = BASE_FOV + (audioData.bass * 3 + audioData.beat * 5 * beatResponse) * move
    const nextFov = cam.fov + (goalFov - cam.fov) * (1 - Math.pow(0.001, delta))
    if (Math.abs(nextFov - cam.fov) > 0.005) {
      cam.fov = nextFov
      cam.updateProjectionMatrix()
    }
  })

  return null
}
