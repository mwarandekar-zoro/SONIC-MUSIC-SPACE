/**
 * SONIC//SPACE — Built-in Music Library Data
 *
 * HOW TO ADD YOUR OWN SONGS:
 * 1. Place your audio file (.mp3, .wav, .ogg, .flac) inside: /public/music/
 * 2. (Optional) Place your cover image (.jpg, .png, .webp, .svg) inside: /public/artwork/
 * 3. Add a new object entry below with unique `id`, `title`, `artist`, `src`, and optional `artwork`.
 *
 * All tracks are streamed locally and processed directly by Web Audio API & Three.js shaders.
 */

export const BUILT_IN_TRACKS = [
  {
    id: 'track-01',
    title: 'Neon Odyssey',
    artist: 'Sonic Space (Demo Synth)',
    director: 'Original Composition',
    album: 'Synthetic Horizons',
    genre: 'Synthwave',
    year: '2024',
    rating: '9.4',
    accentColor: '#05d5ff',
    badge: 'LOSSLESS • 3D AUDIO',
    src: '/music/demo-ambient.wav',
    artwork: '/artwork/neon-odyssey.svg',
    duration: 12,
    description: 'Harmonic ambient drone with deep bass pulses for visualizer testing.',
  },
  {
    id: 'track-02',
    title: 'Dune: Part Two',
    artist: 'Hans Zimmer',
    director: 'Denis Villeneuve',
    album: 'Official Soundtrack',
    genre: 'Epic Sci-Fi',
    year: '2024',
    rating: '8.8',
    accentColor: '#ff8c00',
    badge: 'TRAILER • 4K HDR',
    src: '/music/dune-melange.mp3',
    artwork: '/artwork/dune-melange.svg',
    duration: 214,
    description: 'Thunderous desert horns and ethereal vocal pads.',
  },
  {
    id: 'track-03',
    title: 'Blade Runner 2049',
    artist: 'Hans Zimmer & Benjamin Wallfisch',
    director: 'Denis Villeneuve',
    album: 'Cyberpunk Odyssey',
    genre: 'Neo-Noir Synth',
    year: '2017',
    rating: '8.6',
    accentColor: '#00e5ff',
    badge: 'DOLBY ATMOS',
    src: '/music/blade-runner.mp3',
    artwork: '/artwork/blade-runner.svg',
    duration: 228,
    description: 'Heavy Yamaha CS-80 analog bass synth vibrations.',
  },
  {
    id: 'track-04',
    title: 'Cyber Drift',
    artist: 'Digital Echo',
    director: 'Sonic Studios',
    album: 'Grid Runner',
    genre: 'Cyberpunk',
    year: '2025',
    rating: '9.1',
    accentColor: '#00ffcc',
    badge: 'HI-RES 24-BIT',
    src: '/music/cyber-drift.mp3',
    artwork: '/artwork/cyber-drift.svg',
    duration: 184,
    description: 'High energy pulsing synth track with razor-sharp beats.',
  },
  {
    id: 'track-05',
    title: 'Deep Void Reverie',
    artist: 'Astraea',
    director: 'Cosmic Audio Labs',
    album: 'Sub-Zero Waves',
    genre: 'Space Ambient',
    year: '2024',
    rating: '9.3',
    accentColor: '#9d4edd',
    badge: 'LOSSLESS 96kHz',
    src: '/music/deep-void.mp3',
    artwork: '/artwork/deep-void.svg',
    duration: 220,
    description: 'Ethereal cosmic pads and deep sub-bass resonance.',
  },
  {
    id: 'track-06',
    title: 'Solar Winds',
    artist: 'Quantum Pulsar',
    director: 'Starlight Records',
    album: 'Celestial Drift',
    genre: 'Lo-Fi Chill',
    year: '2024',
    rating: '8.9',
    accentColor: '#ff758c',
    badge: 'WARM ANALOG',
    src: '/music/solar-winds.mp3',
    artwork: '/artwork/solar-winds.svg',
    duration: 195,
    description: 'Warm atmospheric textures with soothing chord progressions.',
  },
]

/** Helper to find track by ID */
export function getTrackById(id) {
  return BUILT_IN_TRACKS.find((track) => track.id === id) || null
}

/** Helper to get all available genres */
export function getLibraryGenres() {
  const genres = new Set(BUILT_IN_TRACKS.map((t) => t.genre).filter(Boolean))
  return ['All', ...Array.from(genres)]
}
