import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color } from 'three'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { prefersReducedMotion } from './motion'
import { getDotTexture } from './dotTexture'
import { sceneState } from './sceneState'
import { theme } from './themeState'

const INNER_RADIUS = 4
const OUTER_RADIUS = 16

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform float uOrbit;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uBeat;
  attribute float aRand;

  void main() {
    vec3 p = position;
    vec3 dir = normalize(p);

    // Bass and beats push each particle outward, by a different amount per particle.
    p += dir * (uBass * 1.2 + uBeat * 2.6) * (0.35 + aRand);

    // Mids drive the orbit speed (accumulated on the CPU as uOrbit).
    float a = uOrbit * (0.4 + aRand * 0.6);
    float c = cos(a);
    float s = sin(a);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p.y += sin(uTime * 0.4 + aRand * 20.0) * (0.1 + uMid * 0.5);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Treble makes particles twinkle.
    float twinkle = 1.0 + uTreble * 1.4 * (0.5 + 0.5 * sin(uTime * 9.0 + aRand * 60.0));
    gl_PointSize = uSize * twinkle * (1.0 + uBeat * 0.6) * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float alpha = texture2D(uMap, gl_PointCoord).a * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`


/**
 * One Points object holding every particle (a single draw call). Motion is computed in the
 * vertex shader from a handful of audio uniforms, so the CPU cost does not grow with the count.
 */
export default function ParticleField({ count }) {
  const orbit = useRef(0)

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const radius = INNER_RADIUS + Math.pow(Math.random(), 0.75) * (OUTER_RADIUS - INNER_RADIUS)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      randoms[i] = Math.random()
    }
    return { positions, randoms }
  }, [count])

  const dot = getDotTexture()

  const uniforms = useMemo(() => ({
    uMap: { value: dot },
    uColor: { value: new Color() },
    uOpacity: { value: 0.75 },
    uTime: { value: 0 },
    uScale: { value: 400 },
    uSize: { value: 0.07 },
    uOrbit: { value: 0 },
    uBass: { value: 0 },
    uMid: { value: 0 },
    uTreble: { value: 0 },
    uBeat: { value: 0 },
  }), [dot])

  useFrame((state, delta) => {
    const calm = prefersReducedMotion() ? 0.3 : 1
    const { particleIntensity, beatResponse } = useVisualizerStore.getState().settings
    const intensity = particleIntensity * sceneState.particles // the visualizer mode scales it
    orbit.current += delta * (0.02 + audioData.mid * 0.5 + audioData.treble * 0.3) * calm

    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uScale.value = (state.size.height * state.viewport.dpr) / 2
    uniforms.uOrbit.value = orbit.current
    uniforms.uBass.value = audioData.bass * intensity * calm
    uniforms.uMid.value = audioData.mid * calm
    uniforms.uTreble.value = audioData.treble * intensity * calm
    uniforms.uBeat.value = audioData.beat * beatResponse * intensity * calm
    uniforms.uColor.value.copy(theme.accent)
    uniforms.uOpacity.value = Math.min(1, 0.75 * intensity * (0.8 + audioData.average * 0.6))
    uniforms.uSize.value = 0.05 + 0.04 * Math.min(1.5, intensity)
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  )
}
