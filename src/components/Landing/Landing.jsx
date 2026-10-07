import { motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import styles from './Landing.module.css'

export default function Landing() {
  const enter = useVisualizerStore((s) => s.enterExperience)

  return (
    <motion.section
      className={styles.landing}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="landing-title"
    >
      <div className={styles.inner}>
        <motion.h1
          id="landing-title"
          className={styles.wordmark}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          SONIC<span className={styles.slash}>//</span>SPACE
        </motion.h1>
        <p className={styles.tagline}>Don't visualize the music. Build a world that experiences it.</p>
        <button className={styles.enter} onClick={enter} autoFocus>
          Enter the space
        </button>
        <p className={styles.note}>Your music never leaves your browser.</p>
      </div>
    </motion.section>
  )
}
