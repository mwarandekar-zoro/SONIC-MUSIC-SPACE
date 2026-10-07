import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'
import { theme } from './themeState'

const KEY_INTENSITY = 55
const RIM_INTENSITY = 45

/** Low ambient light plus two coloured point lights: a key from the front (bass) and a rim from behind (treble). */
export default function Lighting() {
  const key = useRef(null)
  const rim = useRef(null)

  useFrame(() => {
    const beatResponse = useVisualizerStore.getState().settings.beatResponse
    if (key.current) {
      key.current.color.copy(theme.accent)
      key.current.intensity = KEY_INTENSITY * (1 + audioData.bass * 0.9 + audioData.beat * 0.9 * beatResponse)
    }
    if (rim.current) {
      rim.current.color.copy(theme.secondary)
      rim.current.intensity = RIM_INTENSITY * (1 + audioData.treble * 1.2 + audioData.highMid * 0.5)
    }
  })

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight ref={key} position={[4, 3, 5]} intensity={KEY_INTENSITY} distance={32} decay={2} />
      <pointLight ref={rim} position={[-5, -2, -5]} intensity={RIM_INTENSITY} distance={32} decay={2} />
    </>
  )
}
