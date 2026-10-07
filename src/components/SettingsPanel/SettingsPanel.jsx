import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import { SETTING_DEFS } from '../../constants/settings'
import useDialogFocus from '../../hooks/useDialogFocus'
import Slider from '../UI/Slider'
import { CloseIcon } from '../UI/Icons'
import styles from './SettingsPanel.module.css'

/** Side drawer without a backdrop, so changes can be seen live in the 3D world. */
export default function SettingsPanel() {
  const ref = useRef(null)
  const settings = useVisualizerStore((s) => s.settings)
  const setSetting = useVisualizerStore((s) => s.setSetting)
  const resetSettings = useVisualizerStore((s) => s.resetSettings)
  const closePanel = useVisualizerStore((s) => s.closePanel)
  useDialogFocus(ref)

  return (
    <motion.aside
      ref={ref}
      className={styles.drawer}
      role="dialog"
      aria-label="Visualizer settings"
      tabIndex={-1}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.head}>
        <h2 className={styles.title}>Settings</h2>
        <button className={styles.close} onClick={closePanel} aria-label="Close settings"><CloseIcon /></button>
      </div>

      <div className={styles.list}>
        {SETTING_DEFS.map(({ key, label, hint, min, max, step }) => (
          <div key={key} className={styles.row}>
            <div className={styles.labels}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{settings[key].toFixed(2)}</span>
            </div>
            <Slider label={label} value={settings[key]} min={min} max={max} step={step} onChange={(v) => setSetting(key, v)} aria-describedby={`${key}-hint`} />
            <span id={`${key}-hint`} className={styles.hint}>{hint}</span>
          </div>
        ))}

        <label className={styles.toggle}>
          <span>
            <span className={styles.label}>Performance mode</span>
            <span className={styles.hint}>Fewer particles and a lower resolution, for slower devices</span>
          </span>
          <input type="checkbox" checked={settings.performanceMode} onChange={(e) => setSetting('performanceMode', e.target.checked)} />
        </label>
      </div>

      <button className={styles.reset} onClick={resetSettings}>Reset to defaults</button>
    </motion.aside>
  )
}
