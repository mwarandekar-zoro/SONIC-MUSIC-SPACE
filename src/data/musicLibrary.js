/**
 * SONIC//SPACE — Built-in Music Library Data
 *
 * Contains 20 English hit songs imported from MUSIC/ENGLISH SONGS,
 * plus the demo visualizer testing track.
 *
 * HOW TO ADD MORE SONGS:
 * 1. Place your audio file inside: /public/music/
 * 2. (Optional) Place your cover image inside: /public/artwork/
 * 3. Add an entry below with unique id, title, artist, src, and artwork.
 */

export const BUILT_IN_TRACKS = [
  {
    "id": "track-demo",
    "title": "Neon Odyssey",
    "artist": "Sonic Space (Demo Synth)",
    "genre": "Synthwave",
    "year": "2024",
    "rating": "9.4",
    "accentColor": "#05d5ff",
    "badge": "LOSSLESS • 3D AUDIO",
    "src": "/music/demo-ambient.wav",
    "artwork": "/artwork/neon-odyssey.svg",
    "duration": 12,
    "description": "Harmonic ambient drone with deep bass pulses for visualizer testing."
  },
  {
    "id": "track-01",
    "title": "Alone, Pt. II",
    "artist": "Alan Walker & Ava Max",
    "genre": "Electro Pop",
    "year": "2019",
    "rating": "9.3",
    "accentColor": "#00e5ff",
    "badge": "LOSSLESS • 3D AUDIO",
    "src": "/music/alone.mp3",
    "artwork": "/artwork/alone.jpg",
    "duration": 205,
    "description": "Pulsing synth beats and anthemic vocals by Alan Walker & Ava Max."
  },
  {
    "id": "track-02",
    "title": "Arcade",
    "artist": "Duncan Laurence",
    "genre": "Indie Pop",
    "year": "2019",
    "rating": "9.5",
    "accentColor": "#a855f7",
    "badge": "DOLBY ATMOS",
    "src": "/music/arcade.mp3",
    "artwork": "/artwork/arcade.jpg",
    "duration": 187,
    "description": "Emotional piano ballad with soaring cinematic production."
  },
  {
    "id": "track-03",
    "title": "Baby",
    "artist": "Justin Bieber ft. Ludacris",
    "genre": "Pop / R&B",
    "year": "2010",
    "rating": "8.8",
    "accentColor": "#ff007f",
    "badge": "CLASSIC HIT",
    "src": "/music/baby.mp3",
    "artwork": "/artwork/baby.jpg",
    "duration": 219,
    "description": "Iconic upbeat teen pop anthem with infectious rhythms."
  },
  {
    "id": "track-04",
    "title": "Believer",
    "artist": "Imagine Dragons",
    "genre": "Alternative Rock",
    "year": "2017",
    "rating": "9.7",
    "accentColor": "#ff3d00",
    "badge": "HI-RES 24-BIT",
    "src": "/music/believer.mp3",
    "artwork": "/artwork/believer.png",
    "duration": 341,
    "description": "Explosive tribal drums and heavy bass rock dynamics."
  },
  {
    "id": "track-05",
    "title": "Closer",
    "artist": "The Chainsmokers ft. Halsey",
    "genre": "EDM Pop",
    "year": "2016",
    "rating": "9.6",
    "accentColor": "#05d5ff",
    "badge": "LOSSLESS 96kHz",
    "src": "/music/closer.mp3",
    "artwork": "/artwork/closer.jpg",
    "duration": 411,
    "description": "Smooth retro synth leads and infectious progressive drop."
  },
  {
    "id": "track-06",
    "title": "Death Bed (Coffee for Your Head)",
    "artist": "Powfu ft. beabadoobee",
    "genre": "Lo-Fi Hip Hop",
    "year": "2020",
    "rating": "9.2",
    "accentColor": "#ff9f43",
    "badge": "WARM ANALOG",
    "src": "/music/death-bed.mp3",
    "artwork": "/artwork/death-bed.jpg",
    "duration": 175,
    "description": "Relaxed acoustic ukulele chords and cozy lo-fi beats."
  },
  {
    "id": "track-07",
    "title": "Eenie Meenie",
    "artist": "Sean Kingston & Justin Bieber",
    "genre": "Dancehall Pop",
    "year": "2010",
    "rating": "8.9",
    "accentColor": "#ffd166",
    "badge": "SUMMER VIBES",
    "src": "/music/eenie-meenie.mp3",
    "artwork": "/artwork/eenie-meenie.jpg",
    "duration": 138,
    "description": "Catchy island groove and energetic rhythmic pop bass."
  },
  {
    "id": "track-08",
    "title": "Heat Waves",
    "artist": "Glass Animals",
    "genre": "Psychedelic Pop",
    "year": "2020",
    "rating": "9.8",
    "accentColor": "#ff2a85",
    "badge": "TOP CHART • 3D AUDIO",
    "src": "/music/heat-waves.mp3",
    "artwork": "/artwork/heat-waves.jpg",
    "duration": 240,
    "description": "Wavy reverb-soaked guitars and heavy trap sub-bass."
  },
  {
    "id": "track-09",
    "title": "Let Her Go",
    "artist": "Passenger",
    "genre": "Folk Pop",
    "year": "2012",
    "rating": "9.4",
    "accentColor": "#f368e0",
    "badge": "ACOUSTIC MASTER",
    "src": "/music/let-her-go.mp3",
    "artwork": "/artwork/let-her-go.jpg",
    "duration": 437,
    "description": "Soulful fingerpicked acoustic guitar and poignant melodies."
  },
  {
    "id": "track-10",
    "title": "Let Me Down Slowly",
    "artist": "Alec Benjamin",
    "genre": "Indie Pop",
    "year": "2018",
    "rating": "9.3",
    "accentColor": "#48dbfb",
    "badge": "LOSSLESS AUDIO",
    "src": "/music/let-me-down-slowly.mp3",
    "artwork": "/artwork/let-me-down-slowly.jpg",
    "duration": 119,
    "description": "Vulnerable acoustic storytelling with crisp rhythmic snaps."
  },
  {
    "id": "track-11",
    "title": "Love Me Like You Do",
    "artist": "Ellie Goulding",
    "genre": "Synthpop",
    "year": "2015",
    "rating": "9.5",
    "accentColor": "#ff6b6b",
    "badge": "CINEMATIC POP",
    "src": "/music/love-me-like-you-do.mp3",
    "artwork": "/artwork/love-me-like-you-do.jpg",
    "duration": 254,
    "description": "Epic synth swell and massive cinematic drums."
  },
  {
    "id": "track-12",
    "title": "Love Me",
    "artist": "Justin Bieber",
    "genre": "Pop Dance",
    "year": "2009",
    "rating": "8.7",
    "accentColor": "#ee5253",
    "badge": "POP HIT",
    "src": "/music/love-me.mp3",
    "artwork": "/artwork/love-me.jpg",
    "duration": 131,
    "description": "Punchy synth riffs sampling The Cardigans Lovefool."
  },
  {
    "id": "track-13",
    "title": "Love Nwantiti (Ah Ah Ah)",
    "artist": "CKay",
    "genre": "Afrobeats",
    "year": "2019",
    "rating": "9.6",
    "accentColor": "#10ac84",
    "badge": "GLOBAL ANTHEM",
    "src": "/music/love-nwantiti.mp3",
    "artwork": "/artwork/love-nwantiti.jpg",
    "duration": 193,
    "description": "Hypnotic melodic vocals and smooth African polyrhythms."
  },
  {
    "id": "track-14",
    "title": "Mockingbird",
    "artist": "Eminem",
    "genre": "Hip Hop",
    "year": "2004",
    "rating": "9.8",
    "accentColor": "#5f27cd",
    "badge": "HIP-HOP CLASSIC",
    "src": "/music/mockingbird.mp3",
    "artwork": "/artwork/mockingbird.jpg",
    "duration": 175,
    "description": "Emotional lullaby piano chords and heartfelt storytelling flow."
  },
  {
    "id": "track-15",
    "title": "Night Changes",
    "artist": "One Direction",
    "genre": "Pop Rock",
    "year": "2014",
    "rating": "9.4",
    "accentColor": "#54a0ff",
    "badge": "DOLBY ATMOS",
    "src": "/music/night-changes.mp3",
    "artwork": "/artwork/night-changes.jpg",
    "duration": 245,
    "description": "Harmonic acoustic pop harmonies and nostalgic strings."
  },
  {
    "id": "track-16",
    "title": "Peaches",
    "artist": "Justin Bieber ft. Daniel Caesar & GIVEON",
    "genre": "R&B / Soul",
    "year": "2021",
    "rating": "9.5",
    "accentColor": "#ff9ff3",
    "badge": "SMOOTH GROOVE",
    "src": "/music/peaches.mp3",
    "artwork": "/artwork/peaches.jpg",
    "duration": 202,
    "description": "Sun-drenched neo-soul keyboards and bouncy bassline."
  },
  {
    "id": "track-17",
    "title": "Perfect",
    "artist": "Ed Sheeran",
    "genre": "Pop Ballad",
    "year": "2017",
    "rating": "9.7",
    "accentColor": "#ff7675",
    "badge": "ORCHESTRAL MASTER",
    "src": "/music/perfect.mp3",
    "artwork": "/artwork/perfect.jpg",
    "duration": 195,
    "description": "Timeless romantic 6/8 waltz with sweeping string section."
  },
  {
    "id": "track-18",
    "title": "Señorita",
    "artist": "Shawn Mendes & Camila Cabello",
    "genre": "Latin Pop",
    "year": "2019",
    "rating": "9.4",
    "accentColor": "#d63031",
    "badge": "LATIN GROOVE",
    "src": "/music/senorita.mp3",
    "artwork": "/artwork/senorita.jpg",
    "duration": 195,
    "description": "Sensual nylon guitar strums and pulsating Latin bass rhythm."
  },
  {
    "id": "track-19",
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "genre": "Pop / Dancehall",
    "year": "2017",
    "rating": "9.7",
    "accentColor": "#00d2d3",
    "badge": "RECORD BREAKER",
    "src": "/music/shape-of-you.mp3",
    "artwork": "/artwork/shape-of-you.jpg",
    "duration": 180,
    "description": "Iconic marimba percussion hook and driving rhythmic groove."
  },
  {
    "id": "track-20",
    "title": "Stay",
    "artist": "The Kid LAROI & Justin Bieber",
    "genre": "Synthpop / Pop Rap",
    "year": "2021",
    "rating": "9.8",
    "accentColor": "#54a0ff",
    "badge": "HIGH ENERGY",
    "src": "/music/stay.mp3",
    "artwork": "/artwork/stay.jpg",
    "duration": 137,
    "description": "Fast-paced pulsating 80s synth chords and infectious vocal hook."
  }
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
