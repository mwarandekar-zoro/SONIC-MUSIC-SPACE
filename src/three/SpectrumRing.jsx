import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, Color, Object3D } from 'three'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { damp, clamp } from '../utils/math'
import { prefersReducedMotion } from './motion'
import { sceneState } from './sceneState'
import { theme } from './themeState'

const RADIUS = 3.4
const MAX_BIN = 260

/**
 * Radial spectrum: one instanced mesh of bars around the orb (a single draw call).
 * The spectrum is mirrored left/right with bass at the top and treble at the bottom.
 */
export default function SpectrumRing({ count }) {
  const group = useRef(null)
  const mesh = useRef(null)
  const dummy = useMemo(() => new Object3D(), [])
  const color = useMemo(() => new Color(), [])
  const levels = useMemo(() => new Float32Array(count), [count])
  const geometry = useMemo(() => new BoxGeometry(0.07, 1, 0.07).translate(0, 0.5, 0), []) // bars grow from their base
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const weight = sceneState.spectrum
    if (!group.current || !mesh.current) return
    group.current.visible = weight > 0.01
    if (!group.current.visible) return

    const sensitivity = useVisualizerStore.getState().settings.sensitivity
    const calm = prefersReducedMotion() ? 0.3 : 1
    const half = count / 2
    group.current.scale.setScalar(weight * (1 + audioData.beat * 0.08))
    group.current.rotation.z += delta * 0.08 * calm

    for (let i = 0; i < count; i++) {
      const side = i < half ? i : count - 1 - i
      const t = side / half
      const bin = 2 + Math.floor(Math.pow(t, 1.7) * MAX_BIN)
      const target = clamp(Math.pow(audioData.spectrum[bin] / 255, 1.8) * 1.3 * sensitivity)
      levels[i] = damp(levels[i], target, target > levels[i] ? 30 : 9, delta)

      const angle = (i / count) * Math.PI * 2 + Math.PI / 2
      dummy.position.set(Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS, 0)
      dummy.rotation.set(0, 0, angle - Math.PI / 2)
      dummy.scale.set(1, 0.12 + levels[i] * 2.4 * calm, 1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)

      color.copy(theme.accent).lerp(theme.secondary, t * 0.8 + levels[i] * 0.2).multiplyScalar(0.6 + levels[i] * 1.2)
      mesh.current.setColorAt(i, color)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <group ref={group} visible={false}>
      <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
