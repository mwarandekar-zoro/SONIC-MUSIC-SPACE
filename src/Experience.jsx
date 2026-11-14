import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar/Navbar'
import EnvironmentSelector from './components/EnvironmentSelector/EnvironmentSelector'
import EnergyMeter from './components/EnergyMeter/EnergyMeter'
import UploadMusic from './components/UploadMusic/UploadMusic'
import VisualizerControls from './components/VisualizerControls/VisualizerControls'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import SettingsPanel from './components/SettingsPanel/SettingsPanel'
import ShortcutsHelp from './components/ShortcutsHelp/ShortcutsHelp'
import MusicLibrary from './components/MusicLibrary/MusicLibrary'
import { GalaxyIcon } from './components/UI/Icons'
import { useVisualizerStore } from './store/visualizerStore'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import useFullscreenSync from './hooks/useFullscreenSync'
import useIdle from './hooks/useIdle'
import useAudio from './hooks/useAudio'
import styles from './Experience.module.css'

export default function Experience() {
  const panel = useVisualizerStore((s) => s.panel)
  const isFullscreen = useVisualizerStore((s) => s.isFullscreen)
  const zenMode = useVisualizerStore((s) => s.zenMode)
  const toggleZenMode = useVisualizerStore((s) => s.toggleZenMode)

  useKeyboardShortcuts()
  useAudio()
  useFullscreenSync()

  // Fullscreen & Zen Mode act like an installation: chrome fades away until the mouse moves.
  const idle = useIdle(2500, (isFullscreen || zenMode) && !panel)
  const chromeHidden = (isFullscreen && idle) || zenMode

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
      {!zenMode && <UploadMusic />}
      {!zenMode && <MusicPlayer />}

      <AnimatePresence>
        {panel === 'settings' && <SettingsPanel key="settings" />}
        {panel === 'help' && <ShortcutsHelp key="help" />}
        {panel === 'library' && <MusicLibrary key="library" />}
      </AnimatePresence>

      <AnimatePresence>
        {zenMode && (
          <motion.button
            key="zenExit"
            className={`${styles.zenExitBtn} ${idle ? styles.zenExitIdle : ''}`}
            onClick={toggleZenMode}
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Exit Galaxy View"
            title="Exit Galaxy View (G or Esc)"
          >
            <GalaxyIcon />
            <span>Cinema Mode · UI Hidden</span>
            <kbd>G</kbd>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
