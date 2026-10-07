export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const lerp = (a, b, t) => a + (b - a) * t

/**
 * Frame-rate independent smoothing: moves `current` towards `target`.
 * `rate` is roughly "how many times per second it closes the gap".
 */
export const damp = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt))
