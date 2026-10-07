import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, Color } from 'three'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { clamp } from '../utils/math'
import { prefersReducedMotion } from './motion'
import { sceneState } from './sceneState'
import { theme } from './themeState'

const WIDTH = 36
const DEPTH = 34
const BASE_Y = -3.2
const HEIGHT = 3.2
const ROW_INTERVAL = 1 / 30 // seconds between new rows; the mesh glides in between so it looks continuous
const MAX_BIN = 300 // highest FFT bin shown (about 7 kHz)

/**
 * Scrolling spectrum terrain. Every 1/30 s the current spectrum becomes a new row at the far end,
 * and older rows roll towards the camera: bass forms the centre ridge, treble the edges.
 * Drawn as grid lines (one draw call), updated in place with no allocations.
 */
export default function WaveTerrain({ cols, rows }) {
  const lines = useRef(null)
  const clock = useRef(0)
  const color = useMemo(() => new Color(), [])
  const heights = useMemo(() => new Float32Array(cols * rows), [cols, rows])

  const geometry = useMemo(() => {
    const g = new BufferGeometry()
    const position = new Float32Array(cols * rows * 3)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 3
        position[i] = (c / (cols - 1) - 0.5) * WIDTH
        position[i + 1] = BASE_Y
        position[i + 2] = (r / (rows - 1) - 0.5) * DEPTH // row 0 is the far end
      }
    }
    const index = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        if (c < cols - 1) index.push(i, i + 1)
        if (r < rows - 1) index.push(i, i + cols)
      }
    }
    g.setAttribute('position', new BufferAttribute(position, 3))
    g.setAttribute('color', new BufferAttribute(new Float32Array(cols * rows * 3), 3))
    g.setIndex(index)
    return g
  }, [cols, rows])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const object = lines.current
    if (!object) return
    const weight = sceneState.terrain
    object.visible = weight > 0.01
    if (!object.visible) return

    clock.current += delta
    const spacing = DEPTH / (rows - 1)
    const { spectrum, waveform } = audioData

    if (clock.current >= ROW_INTERVAL) {
      clock.current %= ROW_INTERVAL
      heights.copyWithin(cols, 0, (rows - 1) * cols) // roll every row one step towards the camera
      for (let c = 0; c < cols; c++) {
        const u = Math.abs((c / (cols - 1)) * 2 - 1) // 0 at the centre, 1 at the edges
        const bin = 2 + Math.floor(Math.pow(u, 1.6) * MAX_BIN)
        const level = Math.pow(spectrum[bin] / 255, 2.2)
        const wave = ((waveform[Math.floor((c / cols) * waveform.length * 0.5)] - 128) / 128) * 0.25
        heights[c] = (level + wave) * (1 - u * u * 0.6)
      }

      const { terrainIntensity, sensitivity } = useVisualizerStore.getState().settings
      const scale = HEIGHT * terrainIntensity * sensitivity * (prefersReducedMotion() ? 0.4 : 1)
      const position = geometry.attributes.position.array
      const colors = geometry.attributes.color.array
      for (let i = 0; i < heights.length; i++) {
        const h = heights[i]
        position[i * 3 + 1] = BASE_Y + h * scale
        const t = clamp(h * 1.4)
        const glow = 0.25 + t * 1.1
        color.copy(theme.accent).lerp(theme.secondary, t)
        colors[i * 3] = color.r * glow
        colors[i * 3 + 1] = color.g * glow
        colors[i * 3 + 2] = color.b * glow
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
    }

    object.position.z = -DEPTH / 2 + 4 + (clock.current / ROW_INTERVAL) * spacing
    object.material.opacity = 0.8 * weight
  })

  return (
    <lineSegments ref={lines} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial vertexColors transparent opacity={0} depthWrite={false} />
    </lineSegments>
  )
}
