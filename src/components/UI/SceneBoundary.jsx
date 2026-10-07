import { Component } from 'react'

/** Keeps the app usable (UI, shortcuts, audio) if WebGL is unavailable or the 3D scene crashes. */
export default class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('SONIC//SPACE 3D scene failed:', error)
    this.props.onFail?.()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
        The 3D view could not start on this device. Check that hardware acceleration is on, then reload.
      </div>
    )
  }
}
