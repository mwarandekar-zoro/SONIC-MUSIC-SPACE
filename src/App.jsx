import { AnimatePresence } from 'framer-motion'
import Scene from './three/Scene'
import SceneBoundary from './components/UI/SceneBoundary'
import Landing from './components/Landing/Landing'
import Experience from './Experience'
import LoadingScreen from './components/UI/LoadingScreen'
import ToastHost from './components/UI/Toast'
import { useVisualizerStore } from './store/visualizerStore'
import useBoot from './hooks/useBoot'

export default function App() {
  const stage = useVisualizerStore((s) => s.stage)
  const { booted, onSceneReady } = useBoot()

  return (
    <main style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* The 3D world stays mounted the whole time, so entering feels continuous. */}
      <SceneBoundary onFail={onSceneReady}>
        <Scene onReady={onSceneReady} />
      </SceneBoundary>
      <AnimatePresence mode="wait">
        {booted && (stage === 'landing' ? <Landing key="landing" /> : <Experience key="experience" />)}
      </AnimatePresence>
      <AnimatePresence>{!booted && <LoadingScreen key="loading" />}</AnimatePresence>
      <ToastHost />
    </main>
  )
}
