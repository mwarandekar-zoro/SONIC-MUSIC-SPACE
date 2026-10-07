import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './LoadingScreen.module.css'

const STEPS = ['Building the scene…', 'Loading type…', 'Entering the space…']
const STEP_MS = 520

export default function LoadingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      className={styles.screen}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
    >
      <div className={styles.inner}>
        <p className={styles.mark}>SONIC<span>//</span>SPACE</p>
        <div className={styles.track}><div className={styles.bar} /></div>
        <p className={styles.status}>{STEPS[step]}</p>
      </div>
    </motion.div>
  )
}
