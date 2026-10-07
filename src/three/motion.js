const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

/** Live check, so it follows the OS setting if the user changes it. */
export const prefersReducedMotion = () => Boolean(query?.matches)
