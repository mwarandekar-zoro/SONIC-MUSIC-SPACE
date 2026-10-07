import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useVisualizerStore } from '../store/visualizerStore'
import { getQuality } from './quality'
import ThemeController from './ThemeController'
import Lighting from './Lighting'
import CameraRig, { BASE_FOV } from './Camera'
import AudioDriver from './AudioDriver'
import AudioOrb from './AudioOrb'
import ParticleField from './ParticleField'
import StarField from './StarField'
import WaveTerrain from './WaveTerrain'
import SpectrumRing from './SpectrumRing'
import BeatRings from './BeatRings'
import Effects from './Effects'
import Nebula from './environments/Nebula'
import CyberGrid from './environments/CyberGrid'
import DeepSpace from './environments/DeepSpace'
import Void from './environments/Void'

const START_BACKGROUND = '#07050f'

export default function Scene({ onReady }) {
  const performanceMode = useVisualizerStore((s) => s.settings.performanceMode)
  const bloomOn = useVisualizerStore((s) => s.settings.bloom > 0)
  const quality = useMemo(() => getQuality(performanceMode), [performanceMode])

  return (
    <Canvas
      flat
      dpr={quality.dpr}
      camera={{ position: [0, 0, 6.5], fov: BASE_FOV, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={onReady}
      aria-hidden="true"
    >
      <color attach="background" args={[START_BACKGROUND]} />
      <fog attach="fog" args={[START_BACKGROUND, 9, 34]} />

      <AudioDriver />
      <ThemeController />
      <Lighting />
      <CameraRig />

      <StarField key={`stars-${quality.stars}`} count={quality.stars} />
      <Nebula />
      <CyberGrid />
      <DeepSpace />
      <Void />

      <WaveTerrain key={`terrain-${quality.terrain}`} cols={quality.terrain[0]} rows={quality.terrain[1]} />
      <SpectrumRing key={`bars-${quality.bars}`} count={quality.bars} />
      <ParticleField key={`particles-${quality.particles}`} count={quality.particles} />
      <AudioOrb />
      <BeatRings />

      {quality.bloom && bloomOn && <Effects />}
    </Canvas>
  )
}
