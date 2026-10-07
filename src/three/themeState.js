import { Color } from 'three'

/**
 * Shared, mutable "current look" of the 3D world.
 * ThemeController eases these values towards the selected environment every frame,
 * and lights, particles and the orb read them. It is a plain object (not React state)
 * because it changes 60 times per second.
 */
export const theme = {
  accent: new Color('#9a86ff'),
  secondary: new Color('#ff4fa3'),
  background: new Color('#07050f'),
  cameraDistance: 6.5,
}
