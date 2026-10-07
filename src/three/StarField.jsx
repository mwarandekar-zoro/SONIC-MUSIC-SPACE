import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import { audioData } from '../audio/audioData'
import { prefersReducedMotion } from './motion'
import { getDotTexture } from './dotTexture'
import { sceneState } from './sceneState'

const MIN_RADIUS = 45
const MAX_RADIUS = 90

/** Distant stars. They fade out in the Void and twinkle slightly with treble. */
export default function StarField({ count }) {
  const group = useRef(null)
  const material = useRef(null)
  const map = getDotTexture()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (group.current && !prefersReducedMotion()) group.current.rotation.y += delta * 0.004
    if (!material.current) return
    material.current.opacity = 0.9 * (1 - sceneState.env.void * 0.92)
    material.current.size = 0.55 + audioData.treble * 0.25
  })

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={material} map={map} color="#cfd8ff" size={0.55} sizeAttenuation transparent depthWrite={false} blending={AdditiveBlending} fog={false} />
      </points>
    </group>
  )
}
