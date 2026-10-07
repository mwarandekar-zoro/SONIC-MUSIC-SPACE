# 🎵 SONIC//SPACE
> **An Interactive 3D Music Visualizer & Real-time Generative World**

![SONIC//SPACE Architecture](https://img.shields.io/badge/Web_Audio_API-FF4FA3?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-9A86FF?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌟 Overview

**SONIC//SPACE** transforms user-uploaded audio files into a living, reactive 3D universe in real time. Instead of relying on pre-rendered or pseudo-random animations, the Web Audio API extracts precise frequency spectrum and time-domain waveform data to drive 3D mesh deformation, particle dynamics, lighting, waveform terrain, and camera motion.

All audio processing occurs strictly inside your browser. No files are uploaded to any server.

---

## 🚀 Features

- 🎧 **Real-time Web Audio API Engine:** 5-band frequency analysis (Bass, Low-Mid, Mid, High-Mid, Treble) with beat detection & decay smoothing.
- 🌌 **4 Unique 3D Environments:**
  - **Nebula:** Atmospheric space with dust, floating wireframe geometries & soft nebula lights.
  - **Cyber Grid:** Neon floor with dynamic forward motion, reactive spectrum pillars & spectrum ring.
  - **Deep Space:** Cinematic planet with torus rings, starfields & scrolling waveform terrain.
  - **Void:** High-contrast minimal space with subtle cage geometry & powerful beat energy rings.
- 🎨 **5 Visualizer Modes:** `Orbit`, `Terrain`, `Pulse`, `Spectrum`, and `Particles` (switchable via buttons or `1`–`5` hotkeys).
- 🔮 **Audio-Reactive Mesh Deformation:** Custom GLSL vertex displacement on the central icosahedron orb without CPU overhead.
- ⚡ **GPU-Driven Particle System:** Custom vertex & fragment shaders driving thousands of glowing particles (orbiting, pulsing, twinkling).
- 🏔️ **Scrolling Waveform Terrain:** Instanced 3D vertex mesh generated from live FFT spectrum & time-domain waveform data.
- 📸 **Screenshot Capture Mode:** High-res canvas snapshot export via `P` key or Navbar button.
- 🎛️ **Live Settings & Performance Tiers:** Fine-tune audio sensitivity, beat response, bloom glow, particle count & performance mode for mobile/low-tier devices.
- 🎹 **Keyboard Controls:** Intuitive shortcuts for playback, seeking, environment switching, settings, and full-screen installation mode.

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────┐
│   Music File    │
└────────┬────────┘
         │ (HTML5 Audio + AudioContext)
         ▼
┌─────────────────┐
│  AudioEngine    │  ──────►  [Local Browser Audio Playback]
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AnalyserNode   │ (FFT Size: 2048, ByteFrequency & TimeDomain)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│              AudioAnalyzer              │
│ (Bands: Bass, LowMid, Mid, HighMid, Treble)
│ (RMS Volume, Beat Detector with Cooldown)
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  audioData (Shared Mutable State Ref)   │
└────────┬────────────────────────────────┘
         │
 ┌───────┼────────────────────┬─────────────────────┐
 │       │                    │                     │
 ▼       ▼                    ▼                     ▼
AudioOrb  ParticleField   WaveTerrain / Spectrum  Camera & Lights
 (GLSL)    (Shaders)       (Instanced Mesh)        (Beat Pulse)
```

---

## 🛠️ Tech Stack

- **Framework:** React 19, Vite
- **State Management:** Zustand (with localStorage persistence)
- **3D Engine:** Three.js, React Three Fiber, `@react-three/drei`
- **Post-processing:** `@react-three/postprocessing` (Bloom)
- **Animations:** Framer Motion
- **Audio Processing:** Web Audio API (`AudioContext`, `AnalyserNode`, `MediaElementAudioSourceNode`)
- **Styling:** Vanilla CSS Modules & CSS Custom Properties

---

## 📂 Project Structure

```
sonic-space/
├── public/
│   ├── favicon.ico
│   └── environments/
├── src/
│   ├── audio/
│   │   ├── AudioAnalyzer.js    # FFT band splitting & level smoothing
│   │   ├── AudioEngine.js      # Web Audio API pipeline controller
│   │   ├── audioData.js        # Shared zero-allocation audio frame ref
│   │   ├── beatDetection.js    # Beat threshold & cooldown logic
│   │   ├── loadTrack.js        # Unified file loader & state updater
│   │   └── metadata.js         # Native ID3v2 tag parser (title, artist, artwork)
│   ├── components/
│   │   ├── EnergyMeter/        # Live frequency band activity bars
│   │   ├── EnvironmentSelector/# Rail navigation for 3D worlds
│   │   ├── Landing/            # Hero entry screen
│   │   ├── MusicPlayer/        # Player bar, progress slider, volume
│   │   ├── Navbar/             # Brand header, screenshot & settings actions
│   │   ├── SettingsPanel/      # Audio sensitivity & graphic sliders
│   │   ├── ShortcutsHelp/      # Dialog listing keyboard hotkeys
│   │   ├── TrackInfo/          # Audio-reactive track title & metadata
│   │   ├── UI/                 # Toast, Loading, Slider, Icons
│   │   ├── UploadMusic/        # Drag-and-drop overlay & picker
│   │   └── VisualizerControls/# Segmented mode switcher (Orbit, Terrain, etc.)
│   ├── constants/
│   │   ├── environments.js     # World presets & lighting colors
│   │   ├── modes.js            # Visualizer mode definitions
│   │   └── settings.js         # Default control parameters
│   ├── hooks/
│   │   ├── useAudio.js         # Volume/error bridge between store & engine
│   │   ├── useAudioFrame.js    # 60fps DOM audio subscription hook
│   │   ├── useBoot.js          # Preloader condition manager
│   │   ├── useFullscreenSync.js# Fullscreen API event synchronization
│   │   ├── useIdle.js          # Inactivity timer for installation mode
│   │   └── useKeyboardShortcuts.js # Keyboard event listener
│   ├── store/
│   │   └── visualizerStore.js  # Persistent UI state
│   ├── three/
│   │   ├── AudioDriver.jsx     # Audio update tick inside R3F frame loop
│   │   ├── AudioOrb.jsx        # Core icosahedron with GLSL displacement
│   │   ├── BeatRings.jsx       # Beat pulse expander rings
│   │   ├── Camera.jsx          # Dynamic reactive perspective camera
│   │   ├── Effects.jsx         # Postprocessing Bloom pass
│   │   ├── Lighting.jsx        # Audio-reactive point lights
│   │   ├── ParticleField.jsx   # GPU shader particle cloud
│   │   ├── Scene.jsx           # Canvas & 3D world composition root
│   │   ├── SpectrumRing.jsx    # Instanced radial frequency bars
│   │   ├── StarField.jsx       # Background point starfield
│   │   ├── WaveTerrain.jsx     # Dynamic scrolling FFT heightmap
│   │   └── environments/       # Nebula, CyberGrid, DeepSpace, Void meshes
│   ├── utils/
│   │   ├── audioFile.js        # File format & size validator
│   │   ├── formatTime.js       # Time mm:ss formatter
│   │   ├── frequency.js        # FFT bin range calculations
│   │   ├── math.js             # Damp, lerp & clamp utilities
│   │   └── screenshot.js       # Canvas PNG exporter
│   ├── App.jsx
│   ├── Experience.jsx
│   └── index.css
├── vercel.json                 # Vercel deployment configuration
├── vite.config.js              # Vite build & chunk splitting config
└── package.json
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup Commands
```bash
# Clone the repository
git clone https://github.com/your-username/sonic-space.git
cd sonic-space

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Production Build & Deployment

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploying to Vercel
The project includes a ready-to-use `vercel.json`. You can deploy instantly:
```bash
npx vercel
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause audio |
| `←` / `→` | Seek backward / forward 5 seconds |
| `1` – `5` | Switch visualizer mode (Orbit, Terrain, Pulse, Spectrum, Particles) |
| `E` | Toggle environment selector rail |
| `S` | Open Settings panel |
| `M` | Mute / Unmute audio |
| `F` | Toggle Fullscreen mode |
| `P` | Take high-resolution screenshot |
| `?` | Show shortcuts modal |
| `Esc` | Close active dialog panels |

---

## 🔒 Privacy & Performance

- **100% Client-side Processing:** Audio files are read directly into browser memory via Blob URLs. Audio binary data is never transmitted to any server.
- **Optimized Rendering:** Zero React state updates occur per animation frame. All 60fps audio values are passed via direct reference objects (`audioData`) to Three.js uniform buffers and direct DOM styles.
- **Performance Mode:** Toggleable in Settings (`S`) to adapt particle count, terrain resolution, and post-processing for mobile devices or integrated GPUs.

---

## 📜 License

MIT © [Manthan]
