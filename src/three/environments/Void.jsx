import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioData } from '../../audio/audioData'
import { prefersReducedMotion } from '../motion'
import { theme } from '../themeState'
import useEnvironmentFade from './useEnvironmentFade'

/**
 * VOID: almost nothing. One faint cage around the orb gives a sense of space and breathes with the bass.
 * The real show here is the beat ripples (see BeatRings), which are strongest in this world.
 */
export default function Void() {
  const group = useEnvironmentFade('void')
  const cage = useRef(null)
  const material = useRef(null)

  useFrame((_, delta) => {
    const calm = prefersReducedMotion() ? 0.2 : 1
    if (cage.current) {
      cage.current.rotation.y += delta * 0.03 * calm
      cage.current.rotation.x += delta * 0.012 * calm
      cage.current.scale.setScalar(1 + audioData.bass * 0.06 * calm)
    }
    material.current?.color.copy(theme.accent)
  })

  return (
    <group ref={group}>
      <mesh ref={cage}>
        <icosahedronGeometry args={[11, 3]} />
        <meshBasicMaterial ref={material} wireframe opacity={0.07} fog={false} />
      </mesh>
    </group>
  )
}
