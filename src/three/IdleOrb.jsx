import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'
import { useVisualizerStore } from '../store/visualizerStore'
import { getEnvironment } from '../constants/environments'

/**
 * Placeholder centrepiece so the foundation has something to show.
 * It does NOT react to audio yet; that is Phase 6.
 */
export default function IdleOrb() {
  const mesh = useRef(null)
  const material = useRef(null)
  const target = useMemo(() => new Color(), [])

  useFrame((_, delta) => {
    if (!mesh.current || !material.current) return
    mesh.current.rotation.y += delta * 0.12
    mesh.current.rotation.x += delta * 0.05
    // Read the store without subscribing, so no React re-render happens.
    target.set(getEnvironment(useVisualizerStore.getState().environment).color)
    material.current.color.lerp(target, 1 - Math.pow(0.001, delta))
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 3]} />
      <meshBasicMaterial ref={material} wireframe transparent opacity={0.5} color="#9a86ff" />
    </mesh>
  )
}
