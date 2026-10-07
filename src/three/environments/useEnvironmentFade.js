import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { sceneState } from '../sceneState'

/**
 * Cross-fades a whole environment. Returns a ref for its root <group>.
 * The first time the group is visible it records every material's opacity as the "full" value,
 * then scales those by this world's weight each frame. Hidden worlds cost nothing to render.
 * Environments must therefore keep material opacity static and animate with scale or colour.
 */
export default function useEnvironmentFade(id) {
  const group = useRef(null)
  const materials = useRef(null)

  useFrame(() => {
    const root = group.current
    if (!root) return
    const weight = sceneState.env[id]
    root.visible = weight > 0.01
    if (!root.visible) return

    if (!materials.current) {
      const found = []
      root.traverse((object) => {
        const list = Array.isArray(object.material) ? object.material : object.material ? [object.material] : []
        for (const material of list) {
          material.transparent = true
          material.depthWrite = false
          found.push([material, material.opacity])
        }
      })
      materials.current = found
    }
    for (const [material, base] of materials.current) material.opacity = base * weight
  })

  return group
}
