import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, Color, Object3D } from 'three'
import { audioData } from '../../audio/audioData'
import { clamp, damp } from '../../utils/math'
import { prefersReducedMotion } from '../motion'
import { theme } from '../themeState'
import useEnvironmentFade from './useEnvironmentFade'

const FLOOR_Y = -3
const GRID_SIZE = 90
const GRID_DIVISIONS = 45
const CELL = GRID_SIZE / GRID_DIVISIONS
const PILLARS_PER_SIDE = 16
const PILLAR_GAP = 3
const PILLAR_RANGE = PILLARS_PER_SIDE * PILLAR_GAP
const PILLAR_X = 9

/** CYBER GRID: a neon floor that rushes towards you with the music, flanked by pillars that follow the spectrum. */
export default function CyberGrid() {
  const group = useEnvironmentFade('cyber')
  const grid = useRef(null)
  const pillars = useRef(null)
  const scroll = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  const color = useMemo(() => new Color(), [])
  const levels = useMemo(() => new Float32Array(PILLARS_PER_SIDE * 2), [])
  const geometry = useMemo(() => new BoxGeometry(0.8, 1, 0.8).translate(0, 0.5, 0), [])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const calm = prefersReducedMotion() ? 0.2 : 1
    scroll.current += delta * (1.5 + audioData.bass * 7 + audioData.beat * 4) * calm

    if (grid.current) {
      grid.current.position.z = scroll.current % CELL
      grid.current.material.color.copy(theme.accent)
    }
    if (!pillars.current) return

    for (let i = 0; i < PILLARS_PER_SIDE * 2; i++) {
      const side = i < PILLARS_PER_SIDE ? -1 : 1
      const k = i % PILLARS_PER_SIDE
      const z = -PILLAR_RANGE + 4 + ((k * PILLAR_GAP + scroll.current) % PILLAR_RANGE)
      const bin = 2 + Math.floor(Math.pow(k / PILLARS_PER_SIDE, 1.5) * 200)
      const target = clamp(Math.pow(audioData.spectrum[bin] / 255, 1.8) * 1.4)
      levels[i] = damp(levels[i], target, target > levels[i] ? 25 : 8, delta)

      dummy.position.set(side * PILLAR_X, FLOOR_Y, z)
      dummy.scale.set(1, 0.4 + levels[i] * 6 * calm, 1)
      dummy.updateMatrix()
      pillars.current.setMatrixAt(i, dummy.matrix)
      color.copy(theme.accent).lerp(theme.secondary, k / PILLARS_PER_SIDE).multiplyScalar(0.5 + levels[i])
      pillars.current.setColorAt(i, color)
    }
    pillars.current.instanceMatrix.needsUpdate = true
    pillars.current.instanceColor.needsUpdate = true
  })

  return (
    <group ref={group}>
      <gridHelper ref={grid} args={[GRID_SIZE, GRID_DIVISIONS, '#ffffff', '#ffffff']} position={[0, FLOOR_Y, 0]} />
      <instancedMesh ref={pillars} args={[geometry, undefined, PILLARS_PER_SIDE * 2]} frustumCulled={false}>
        <meshBasicMaterial opacity={0.6} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
