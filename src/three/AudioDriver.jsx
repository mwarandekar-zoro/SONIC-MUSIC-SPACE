import { useFrame } from '@react-three/fiber'
import { audioEngine } from '../audio/AudioEngine'
import { useVisualizerStore } from '../store/visualizerStore'

/**
 * Runs the analyser once per frame, before every other component (negative priority),
 * so they all read the same fresh `audioData`.
 */
export default function AudioDriver() {
  useFrame((_, delta) => {
    audioEngine.update(Math.min(delta, 0.1), useVisualizerStore.getState().settings.sensitivity)
  }, -1)
  return null
}
