import { ENVIRONMENTS } from '../../constants/environments'
import { useVisualizerStore } from '../../store/visualizerStore'
import styles from './EnvironmentSelector.module.css'

export default function EnvironmentSelector({ hidden = false }) {
  const current = useVisualizerStore((s) => s.environment)
  const setEnvironment = useVisualizerStore((s) => s.setEnvironment)
  const open = useVisualizerStore((s) => s.envOpen)
  const toggleOpen = useVisualizerStore((s) => s.toggleEnvOpen)

  return (
    <nav className={`${styles.rail} ${hidden ? styles.hidden : ''}`} aria-label="Environments">
      <button className={styles.head} onClick={toggleOpen} aria-expanded={open} aria-controls="env-list">
        Worlds <kbd>E</kbd>
      </button>
      <div className={`${styles.listWrap} ${open ? '' : styles.collapsed}`} inert={!open}>
        <div id="env-list" className={styles.list}>
          {ENVIRONMENTS.map((env) => (
            <button
              key={env.id}
              className={`${styles.item} ${env.id === current ? styles.active : ''}`}
              style={{ '--accent': env.color }}
              onClick={() => setEnvironment(env.id)}
              aria-pressed={env.id === current}
            >
              <span className={styles.name}>{env.label}</span>
              <span className={styles.tag}>{env.tagline}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
