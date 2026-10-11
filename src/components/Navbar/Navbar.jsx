import { useVisualizerStore } from '../../store/visualizerStore'
import { getEnvironment } from '../../constants/environments'
import { toggleFullscreen } from '../../utils/fullscreen'
import { takeScreenshot } from '../../utils/screenshot'
import { CameraIcon, FullscreenIcon, KeyboardIcon, LibraryIcon, SettingsIcon } from '../UI/Icons'
import styles from './Navbar.module.css'

export default function Navbar({ hidden = false }) {
  const environment = useVisualizerStore((s) => s.environment)
  const panel = useVisualizerStore((s) => s.panel)
  const togglePanel = useVisualizerStore((s) => s.togglePanel)

  return (
    <header className={`${styles.nav} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.brand}>SONIC<span>//</span>SPACE</div>
      <div className={styles.current} aria-live="polite">{getEnvironment(environment).label}</div>
      <div className={styles.actions}>
        <button
          className={`${styles.iconBtn} ${panel === 'library' ? styles.active : ''}`}
          onClick={() => togglePanel('library')}
          aria-label="Music library"
          aria-haspopup="dialog"
          aria-expanded={panel === 'library'}
          title="Music Library (L)"
        >
          <LibraryIcon />
        </button>
        <button className={styles.iconBtn} onClick={takeScreenshot} aria-label="Take screenshot" title="Screenshot (P)">
          <CameraIcon />
        </button>
        <button className={`${styles.iconBtn} ${styles.keys}`} onClick={() => togglePanel('help')} aria-label="Keyboard shortcuts" aria-haspopup="dialog" aria-expanded={panel === 'help'} title="Shortcuts (?)">
          <KeyboardIcon />
        </button>
        <button className={`${styles.iconBtn} ${panel === 'settings' ? styles.active : ''}`} onClick={() => togglePanel('settings')} aria-label="Settings" aria-haspopup="dialog" aria-expanded={panel === 'settings'} title="Settings (S)">
          <SettingsIcon />
        </button>
        <button className={styles.iconBtn} onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Fullscreen (F)">
          <FullscreenIcon />
        </button>
      </div>
    </header>
  )
}
