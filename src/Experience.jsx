import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar/Navbar'
import EnvironmentSelector from './components/EnvironmentSelector/EnvironmentSelector'
import EnergyMeter from './components/EnergyMeter/EnergyMeter'
import UploadMusic from './components/UploadMusic/UploadMusic'
import VisualizerControls from './components/VisualizerControls/VisualizerControls'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import SettingsPanel from './components/SettingsPanel/SettingsPanel'
import ShortcutsHelp from './components/ShortcutsHelp/ShortcutsHelp'
import { useVisualizerStore } from './store/visualizerStore'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import useFullscreenSync from './hooks/useFullscreenSync'
import useIdle from './hooks/useIdle'
import useAudio from './hooks/useAudio'

export default function Experience() {
  const panel = useVisualizerStore((s) => s.panel)
  const isFullscreen = useVisualizerStore((s) => s.isFullscreen)

  useKeyboardShortcuts()
  useAudio()
  useFullscreenSync()

  // Fullscreen acts like an installation: chrome fades away until the mouse moves.
  const idle = useIdle(2500, isFullscreen && !panel)
  const chromeHidden = isFullscreen && idle

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, cursor: chromeHidden ? 'none' : undefined }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar hidden={chromeHidden} />
      <EnvironmentSelector hidden={chromeHidden} />
      <EnergyMeter hidden={chromeHidden} />
      <VisualizerControls hidden={chromeHidden} />
      <UploadMusic />
      <MusicPlayer />
      <AnimatePresence>
        {panel === 'settings' && <SettingsPanel key="settings" />}
        {panel === 'help' && <ShortcutsHelp key="help" />}
      </AnimatePresence>
    </motion.div>
  )
}
