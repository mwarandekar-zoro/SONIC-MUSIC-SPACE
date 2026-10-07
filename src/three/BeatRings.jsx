import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { prefersReducedMotion } from './motion'
import { sceneState } from './sceneState'
import { theme } from './themeState'

const POOL = 5
const LIFETIME = 1.5 // seconds
const START_SCALE = 2.2
const END_SCALE = 15

/** On every beat a ripple leaves the orb and travels through the environment. Strongest in the Void. */
export default function BeatRings() {
  const meshes = useRef([])
  const ages = useRef(new Float32Array(POOL).fill(LIFETIME))
  const strengths = useRef(new Float32Array(POOL))
  const next = useRef(0)
  const lastBeat = useRef(0)

  useFrame((_, delta) => {
    const { beatResponse } = useVisualizerStore.getState().settings
    const presence = (0.45 + 0.55 * sceneState.env.void) * beatResponse * (prefersReducedMotion() ? 0.3 : 1)

    if (audioData.beatCount !== lastBeat.current) {
      lastBeat.current = audioData.beatCount
      ages.current[next.current] = 0
      strengths.current[next.current] = audioData.beat
      next.current = (next.current + 1) % POOL
    }

    for (let i = 0; i < POOL; i++) {
      const mesh = meshes.current[i]
      if (!mesh) continue
      ages.current[i] += delta
      const t = ages.current[i] / LIFETIME
      mesh.visible = t < 1
      if (!mesh.visible) continue
      mesh.scale.setScalar(START_SCALE + (END_SCALE - START_SCALE) * (1 - Math.pow(1 - t, 2)))
      mesh.material.opacity = Math.pow(1 - t, 2) * 0.7 * strengths.current[i] * presence
      mesh.material.color.copy(theme.accent).lerp(theme.secondary, t)
    }
  })

  return (
    <group position={[0, -0.8, 0]} rotation={[-Math.PI / 2 + 0.25, 0, 0]}>
      {Array.from({ length: POOL }, (_, i) => (
        <mesh key={i} ref={(el) => { meshes.current[i] = el }} visible={false}>
          <ringGeometry args={[0.985, 1, 96]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} toneMapped={false} fog={false} />
        </mesh>
      ))}
    </group>
  )
}
