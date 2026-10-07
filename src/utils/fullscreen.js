export function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.()
  } else {
    // iOS Safari has no Fullscreen API for pages, so this quietly does nothing there.
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
}
