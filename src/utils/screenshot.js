import { useVisualizerStore } from '../store/visualizerStore'

/** Saves the current 3D view (without the interface) as a PNG. */
export function takeScreenshot() {
  const { pushToast } = useVisualizerStore.getState()
  const canvas = document.querySelector('canvas')
  if (!canvas) return pushToast('Nothing to capture yet.', 'error')

  canvas.toBlob((blob) => {
    if (!blob) return pushToast('Could not capture the scene.', 'error')
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sonic-space-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    pushToast('Screenshot saved.')
  }, 'image/png')
}
