import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide } from 'three'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { prefersReducedMotion } from './motion'
import { theme } from './themeState'
import { sceneState } from './sceneState'

// Pushes vertices along their normal. Mids bend the whole shape, treble adds fine ripples,
// bass swells it. Runs on the GPU, so the orb stays cheap at high detail.
const DISPLACE_GLSL = /* glsl */ `
  float n1 = sin(position.x * 2.3 + uTime * 0.9) * sin(position.y * 2.1 - uTime * 0.7) * sin(position.z * 2.6 + uTime * 0.5);
  float n2 = sin(position.x * 7.0 - uTime * 2.0) * sin(position.y * 6.5 + uTime * 2.3) * sin(position.z * 7.4 - uTime * 1.7);
  transformed += normal * (uMid * 0.38 * n1 + uTreble * 0.1 * n2 + uBass * 0.06);
`

/**
 * Central object: a dark lit core that deforms with the music, a wireframe shell and a glow.
 *  bass    -> swell      mid -> shape bending     treble -> surface ripples and spin
 *  volume  -> brightness beat -> sharp pulse
 */
export default function AudioOrb() {
  const group = useRef(null)
  const shell = useRef(null)
  const glow = useRef(null)
  const coreMat = useRef(null)
  const shellMat = useRef(null)
  const glowMat = useRef(null)

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uBass: { value: 0 }, uMid: { value: 0 }, uTreble: { value: 0 } }), [])
  const onBeforeCompile = useMemo(() => (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uBass;\nuniform float uMid;\nuniform float uTreble;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${DISPLACE_GLSL}`)
  }, [uniforms])

  useFrame((state, delta) => {
    const calm = prefersReducedMotion() ? 0.3 : 1
    const beatResponse = useVisualizerStore.getState().settings.beatResponse
    const { bass, mid, treble, highMid, volume, average, beat } = audioData
    const t = state.clock.elapsedTime

    uniforms.uTime.value = t
    uniforms.uBass.value = bass * calm
    uniforms.uMid.value = mid * calm
    uniforms.uTreble.value = treble * calm

    if (group.current) {
      group.current.rotation.y += delta * (0.1 + treble * 0.5) * calm
      group.current.rotation.x += delta * 0.04 * calm
      group.current.scale.setScalar((1 + Math.sin(t * 0.8) * 0.02 * calm + bass * 0.28 * calm + beat * 0.22 * beatResponse * calm) * sceneState.orb)
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * (0.18 + highMid * 0.6) * calm
      shell.current.scale.setScalar(1 + highMid * 0.12 * calm)
    }
    if (glow.current) glow.current.scale.setScalar(1 + bass * 0.15 * calm)

    if (coreMat.current) {
      coreMat.current.emissive.copy(theme.accent).lerp(theme.secondary, Math.min(1, beat * 0.8))
      coreMat.current.emissiveIntensity = 0.18 + volume * 1.1 + beat * 0.7 * beatResponse
    }
    if (shellMat.current) {
      shellMat.current.color.copy(theme.accent)
      shellMat.current.opacity = 0.25 + average * 0.5
    }
    if (glowMat.current) {
      glowMat.current.color.copy(theme.accent)
      glowMat.current.opacity = 0.08 + volume * 0.22 + beat * 0.25 * beatResponse
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.4, 5]} />
        <meshStandardMaterial ref={coreMat} color="#0c0a16" metalness={0.7} roughness={0.32} emissiveIntensity={0.18} onBeforeCompile={onBeforeCompile} />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.62, 2]} />
        <meshBasicMaterial ref={shellMat} wireframe transparent opacity={0.32} />
      </mesh>

      <mesh ref={glow}>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial ref={glowMat} side={BackSide} transparent opacity={0.1} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}
