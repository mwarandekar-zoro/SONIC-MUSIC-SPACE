import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide } from 'three'
import { audioData } from '../../audio/audioData'
import { prefersReducedMotion } from '../motion'
import { theme } from '../themeState'
import useEnvironmentFade from './useEnvironmentFade'

/** DEEP SPACE: a huge ringed planet and a distant moon. Slow and quiet; the terrain below does the talking. */
export default function DeepSpace() {
  const group = useEnvironmentFade('deep-space')
  const planet = useRef(null)
  const ring = useRef(null)
  const moon = useRef(null)
  const bodyMat = useRef(null)
  const ringMat = useRef(null)
  const haloMat = useRef(null)
  const moonMat = useRef(null)

  useFrame((_, delta) => {
    const calm = prefersReducedMotion() ? 0.2 : 1
    if (planet.current) planet.current.rotation.y += delta * 0.01 * calm
    if (ring.current) ring.current.rotation.z += delta * 0.004 * calm
    if (moon.current) {
      moon.current.rotation.y += delta * 0.05 * calm
      moon.current.scale.setScalar(1 + audioData.bass * 0.05 * calm)
    }
    bodyMat.current?.color.copy(theme.accent).multiplyScalar(0.07)
    ringMat.current?.color.copy(theme.accent)
    haloMat.current?.color.copy(theme.secondary)
    moonMat.current?.color.copy(theme.secondary)
  })

  return (
    <group ref={group}>
      <group ref={planet} position={[-17, 6, -36]}>
        <mesh>
          <sphereGeometry args={[7, 48, 48]} />
          <meshBasicMaterial ref={bodyMat} opacity={1} fog={false} />
        </mesh>
        <mesh scale={1.06}>
          <sphereGeometry args={[7, 32, 32]} />
          <meshBasicMaterial ref={haloMat} side={BackSide} opacity={0.18} blending={AdditiveBlending} fog={false} />
        </mesh>
        <mesh ref={ring} rotation={[1.25, 0.3, 0]}>
          <torusGeometry args={[11, 0.08, 8, 128]} />
          <meshBasicMaterial ref={ringMat} opacity={0.55} fog={false} />
        </mesh>
      </group>

      <mesh ref={moon} position={[21, -3, -30]}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial ref={moonMat} wireframe opacity={0.5} fog={false} />
      </mesh>
    </group>
  )
}
