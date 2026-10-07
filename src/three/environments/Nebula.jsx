import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, IcosahedronGeometry, Object3D } from 'three'
import { audioData } from '../../audio/audioData'
import { prefersReducedMotion } from '../motion'
import { getDotTexture } from '../dotTexture'
import { theme } from '../themeState'
import useEnvironmentFade from './useEnvironmentFade'

const SHAPES = 18
const GLOWS = [
  { position: [-9, 3, -14], size: 26, tint: 'accent', opacity: 0.2 },
  { position: [10, -2, -18], size: 30, tint: 'secondary', opacity: 0.16 },
  { position: [0, 7, -26], size: 36, tint: 'accent', opacity: 0.14 },
]

/** NEBULA: big soft clouds of colour in the distance and slowly tumbling wireframe structures. */
export default function Nebula() {
  const group = useEnvironmentFade('nebula')
  const glows = useRef([])
  const shapes = useRef(null)
  const dummy = useMemo(() => new Object3D(), [])
  const map = getDotTexture()
  const geometry = useMemo(() => new IcosahedronGeometry(0.55, 0), [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const seeds = useMemo(() => Array.from({ length: SHAPES }, () => {
    const radius = 7 + Math.random() * 6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta) * 0.7,
      z: radius * Math.cos(phi) - 4,
      spin: 0.1 + Math.random() * 0.3,
      phase: Math.random() * 10,
      scale: 0.6 + Math.random() * 1.4,
    }
  }), [])

  useFrame((state) => {
    const calm = prefersReducedMotion() ? 0.2 : 1
    const t = state.clock.elapsedTime * calm

    GLOWS.forEach((glow, i) => {
      const sprite = glows.current[i]
      if (!sprite) return
      sprite.material.color.copy(glow.tint === 'accent' ? theme.accent : theme.secondary)
      sprite.scale.setScalar(glow.size * (1 + audioData.bass * 0.12 * calm))
    })

    if (!shapes.current) return
    seeds.forEach((s, i) => {
      dummy.position.set(s.x, s.y + Math.sin(t * 0.3 + s.phase) * 0.6, s.z)
      dummy.rotation.set(t * s.spin, t * s.spin * 0.7, 0)
      dummy.scale.setScalar(s.scale * (1 + audioData.mid * 0.9 * calm))
      dummy.updateMatrix()
      shapes.current.setMatrixAt(i, dummy.matrix)
    })
    shapes.current.instanceMatrix.needsUpdate = true
    shapes.current.material.color.copy(theme.accent)
  })

  return (
    <group ref={group}>
      {GLOWS.map((glow, i) => (
        <sprite key={i} ref={(el) => { glows.current[i] = el }} position={glow.position}>
          <spriteMaterial map={map} opacity={glow.opacity} blending={AdditiveBlending} fog={false} toneMapped={false} />
        </sprite>
      ))}
      <instancedMesh ref={shapes} args={[geometry, undefined, SHAPES]} frustumCulled={false}>
        <meshBasicMaterial wireframe opacity={0.5} />
      </instancedMesh>
    </group>
  )
}
