import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { audioData } from '../audio/audioData'
import { useVisualizerStore } from '../store/visualizerStore'

/** Bloom whose strength follows the Bloom setting, the loudness and every beat. */
export default function Effects() {
  const bloom = useRef(null)

  useFrame(() => {
    if (!bloom.current) return
    const { bloom: amount, beatResponse } = useVisualizerStore.getState().settings
    bloom.current.intensity = amount * (0.55 + audioData.beat * 0.9 * beatResponse + audioData.volume * 0.3)
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={0.25} luminanceSmoothing={0.2} intensity={0.6} />
    </EffectComposer>
  )
}
