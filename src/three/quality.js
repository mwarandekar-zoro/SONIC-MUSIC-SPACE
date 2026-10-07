const TIERS = {
  high: { particles: 5000, stars: 2200, dpr: [1, 1.75], terrain: [72, 56], bars: 64, bloom: true },
  low: { particles: 1800, stars: 900, dpr: [1, 1.25], terrain: [48, 36], bars: 48, bloom: true },
  minimal: { particles: 800, stars: 400, dpr: [1, 1], terrain: [32, 24], bars: 32, bloom: false },
}

/** Picks a quality tier from the user's setting and a rough guess about the device. */
export function getQuality(performanceMode) {
  if (performanceMode) return TIERS.minimal
  const smallScreen = window.innerWidth < 760
  const touchOnly = window.matchMedia('(pointer: coarse)').matches
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4
  return smallScreen || touchOnly || fewCores ? TIERS.low : TIERS.high
}
