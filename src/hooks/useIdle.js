import { useEffect, useState } from 'react'

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'touchstart']

/** True after `ms` without pointer or keyboard activity. Only listens while `enabled`. */
export default function useIdle(ms = 2500, enabled = true) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!enabled) { setIdle(false); return undefined }
    let timer
    const wake = () => {
      setIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), ms)
    }
    wake()
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    return () => {
      clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, wake))
    }
  }, [ms, enabled])

  return idle
}
