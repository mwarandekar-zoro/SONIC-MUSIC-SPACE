import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_ENVIRONMENT, ENVIRONMENTS } from '../constants/environments'
import { DEFAULT_SETTINGS } from '../constants/settings'
import { DEFAULT_MODE, MODES } from '../constants/modes'

import { BUILT_IN_TRACKS } from '../data/musicLibrary'

let toastCounter = 0

/**
 * UI-level state only. Values that change every frame (bass, beat, current time)
 * never live here. They go through refs in the audio layer (Phase 5).
 *
 * Only environment, settings, volume, and playback modes are saved to localStorage.
 */
export const useVisualizerStore = create(
  persist(
    (set, get) => ({
      stage: 'landing', // 'landing' | 'experience'
      enterExperience: () => set({ stage: 'experience' }),

      environment: DEFAULT_ENVIRONMENT,
      setEnvironment: (environment) => set({ environment }),
      mode: DEFAULT_MODE,
      setMode: (mode) => set({ mode }),
      envOpen: true,
      toggleEnvOpen: () => set((s) => ({ envOpen: !s.envOpen })),

      // Track & Library
      track: null,
      setTrack: (track) => set({ track }),
      loadingTrack: false,
      setLoadingTrack: (loadingTrack) => set({ loadingTrack }),
      library: BUILT_IN_TRACKS,

      // Playlist & Queue
      queue: [...BUILT_IN_TRACKS],
      queueIndex: -1,
      shuffle: false,
      repeatMode: 'all', // 'off' | 'all' | 'one'
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      cycleRepeat: () =>
        set((s) => ({
          repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
        })),

      syncQueueWithTrack: (track) =>
        set((s) => {
          const idx = s.queue.findIndex((t) => t.id === track.id || (t.title && t.title === track.title))
          if (idx !== -1) {
            return { queueIndex: idx }
          }
          const updated = [...s.queue, track]
          return { queue: updated, queueIndex: updated.length - 1 }
        }),

      addToQueue: (track) =>
        set((s) => {
          if (s.queue.some((t) => t.id === track.id)) {
            get().pushToast(`"${track.title || track.name}" is already in queue`, 'info')
            return {}
          }
          get().pushToast(`Added "${track.title || track.name}" to queue`, 'info')
          return { queue: [...s.queue, track] }
        }),

      removeFromQueue: (index) =>
        set((s) => {
          const updated = s.queue.filter((_, i) => i !== index)
          let newIndex = s.queueIndex
          if (index < s.queueIndex) {
            newIndex = Math.max(0, s.queueIndex - 1)
          } else if (index === s.queueIndex) {
            newIndex = Math.min(newIndex, updated.length - 1)
          }
          return { queue: updated, queueIndex: newIndex }
        }),

      clearQueue: () =>
        set((s) => {
          if (!s.track) return { queue: [], queueIndex: -1 }
          return { queue: [s.track], queueIndex: 0 }
        }),

      // Mirrored from the AudioEngine by useAudio. The current time is NOT stored here.
      isPlaying: false,
      duration: 0,

      volume: 0.8,
      muted: false,
      setVolume: (volume) => set({ volume, muted: volume === 0 }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),

      settings: DEFAULT_SETTINGS,
      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      panel: null, // null | 'settings' | 'help' | 'library' | 'queue'
      togglePanel: (name) => set((s) => ({ panel: s.panel === name ? null : name })),
      closePanel: () => set({ panel: null }),

      isFullscreen: false,
      setFullscreen: (isFullscreen) => set({ isFullscreen }),

      toasts: [],
      pushToast: (message, tone = 'info') =>
        set((s) => ({ toasts: [...s.toasts, { id: ++toastCounter, message, tone }].slice(-3) })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'sonic-space:v1',
      version: 1,
      partialize: (s) => ({ environment: s.environment, mode: s.mode, settings: s.settings, volume: s.volume, muted: s.muted }),
      // Never trust saved data blindly: fall back to defaults if it is missing or invalid.
      merge: (saved, current) => {
        const s = saved ?? {}
        return {
          ...current,
          environment: ENVIRONMENTS.some((e) => e.id === s.environment) ? s.environment : current.environment,
          mode: MODES.some((m) => m.id === s.mode) ? s.mode : current.mode,
          settings: { ...DEFAULT_SETTINGS, ...(s.settings ?? {}) },
          volume: typeof s.volume === 'number' ? Math.min(1, Math.max(0, s.volume)) : current.volume,
          muted: Boolean(s.muted),
        }
      },
    },
  ),
)
