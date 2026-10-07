import { clamp } from '../utils/math'

/**
 * Lightweight beat detector. It compares the current bass level with its
 * recent average and fires when it jumps clearly above it. A cooldown keeps it
 * from firing dozens of times per second.
 */
export class BeatDetector {
  constructor({ historySize = 60, minLevel = 0.3, ratio = 1.2, minDelta = 0.05, cooldownMs = 240 } = {}) {
    this.historySize = historySize
    this.minLevel = minLevel
    this.ratio = ratio
    this.minDelta = minDelta
    this.cooldownMs = cooldownMs
    this.history = new Float32Array(historySize)
    this.reset()
  }

  reset() {
    this.history.fill(0)
    this.cursor = 0
    this.filled = 0
    this.sum = 0
    this.previous = 0
    this.lastBeatAt = -Infinity
  }

  /** @returns {{ hit: boolean, strength: number }} strength is 0..1 */
  update(level, now) {
    const average = this.filled ? this.sum / this.filled : 0
    const delta = level - average

    const hit =
      this.filled >= this.historySize / 4 &&
      level > this.minLevel &&
      level > average * this.ratio &&
      delta > this.minDelta &&
      level > this.previous && // only on the rising edge
      now - this.lastBeatAt > this.cooldownMs

    this.sum += level - this.history[this.cursor]
    this.history[this.cursor] = level
    this.cursor = (this.cursor + 1) % this.historySize
    this.filled = Math.min(this.filled + 1, this.historySize)
    this.previous = level

    if (hit) this.lastBeatAt = now
    return { hit, strength: hit ? clamp(delta / 0.35) : 0 }
  }
}
