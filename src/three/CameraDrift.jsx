import { useFrame } from '@react-three/fiber'

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Very slow idle camera sway. Phase 10 replaces this with the audio-reactive rig. */
export default function CameraDrift() {
  useFrame((state) => {
    if (REDUCED_MOTION) return
    const t = state.clock.elapsedTime
    state.camera.position.x = Math.sin(t * 0.12) * 0.6
    state.camera.position.y = Math.cos(t * 0.09) * 0.35
    state.camera.lookAt(0, 0, 0)
  })
  return null
}
