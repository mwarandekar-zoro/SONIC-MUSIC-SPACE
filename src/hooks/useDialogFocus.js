import { useEffect } from 'react'

const FOCUSABLE = 'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Moves focus into a dialog, keeps Tab inside it, and restores focus to the opener on close. */
export default function useDialogFocus(ref) {
  useEffect(() => {
    const node = ref.current
    const opener = document.activeElement
    node?.focus()

    const onKeyDown = (e) => {
      if (e.key !== 'Tab' || !node) return
      const items = Array.from(node.querySelectorAll(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    node?.addEventListener('keydown', onKeyDown)
    return () => {
      node?.removeEventListener('keydown', onKeyDown)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [ref])
}
