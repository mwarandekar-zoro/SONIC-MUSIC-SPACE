import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useVisualizerStore } from '../../store/visualizerStore'
import { loadBuiltInTrack, openFilePicker, playTrackFromQueue } from '../../audio/loadTrack'
import { getLibraryGenres } from '../../data/musicLibrary'
import useDialogFocus from '../../hooks/useDialogFocus'
import { CloseIcon, UploadIcon } from '../UI/Icons'
import GlassyCarousel from './GlassyCarousel'
import LibrarySearch from './LibrarySearch'
import TrackList from './TrackList'
import QueueView from './QueueView'
import styles from './MusicLibrary.module.css'

export default function MusicLibrary() {
  const ref = useRef(null)
  const closePanel = useVisualizerStore((s) => s.closePanel)
  const library = useVisualizerStore((s) => s.library)
  const currentTrack = useVisualizerStore((s) => s.track)
  const isPlaying = useVisualizerStore((s) => s.isPlaying)
  const queue = useVisualizerStore((s) => s.queue)
  const queueIndex = useVisualizerStore((s) => s.queueIndex)
  const addToQueue = useVisualizerStore((s) => s.addToQueue)
  const removeFromQueue = useVisualizerStore((s) => s.removeFromQueue)
  const clearQueue = useVisualizerStore((s) => s.clearQueue)

  const [activeTab, setActiveTab] = useState('carousel') // 'carousel' | 'grid' | 'hindi' | 'queue'
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All') // 'All' | 'Hindi' | 'English'

  useDialogFocus(ref)

  const hindiCount = useMemo(
    () => library.filter((t) => t.language === 'Hindi').length,
    [library]
  )

  const effectiveLanguage = activeTab === 'hindi' ? 'Hindi' : selectedLanguage
  const genres = useMemo(() => getLibraryGenres(effectiveLanguage), [effectiveLanguage])
  const languages = useMemo(() => ['All', 'Hindi', 'English'], [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedGenre('All')
    if (tab === 'hindi') {
      setSelectedLanguage('Hindi')
    }
  }

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang)
    setSelectedGenre('All')
  }

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return library.filter((track) => {
      // Language filter
      if (activeTab === 'hindi') {
        if (track.language !== 'Hindi') return false
      } else if (selectedLanguage !== 'All') {
        if (track.language !== selectedLanguage) return false
      }

      // Genre filter
      const matchGenre = selectedGenre === 'All' || track.genre === selectedGenre

      // Search query filter
      const q = query.trim().toLowerCase()
      if (!q) return matchGenre

      const matchQuery =
        (track.title || track.name || '').toLowerCase().includes(q) ||
        (track.artist || '').toLowerCase().includes(q) ||
        (track.album || '').toLowerCase().includes(q) ||
        (track.genre || '').toLowerCase().includes(q)
      return matchGenre && matchQuery
    })
  }, [library, activeTab, selectedLanguage, selectedGenre, query])

  const handleSelectTrack = (track) => {
    loadBuiltInTrack(track)
  }

  return (
    <motion.div
      className={styles.wrap}
      onClick={closePanel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        ref={ref}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Built-in Music Library"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 24, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className={styles.head}>
          <div className={styles.headTitleGroup}>
            <h2 className={styles.title}>
              SONIC<span>//</span>LIBRARY
            </h2>
            <span className={styles.trackCounter}>
              {library.length} tracks • {hindiCount} Hindi
            </span>
          </div>

          <div className={styles.tabsRow}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'carousel' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('carousel')}
            >
              3D Carousel
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'grid' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('grid')}
            >
              All Tracks
            </button>
            <button
              className={`${styles.tabBtn} ${styles.hindiTabBtn} ${activeTab === 'hindi' ? styles.hindiTabActive : ''}`}
              onClick={() => handleTabChange('hindi')}
              title="Explore 30 Bollywood & Hindi tracks"
            >
              🇮🇳 Hindi Songs <span className={styles.hindiCountBadge}>{hindiCount}</span>
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'queue' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('queue')}
            >
              Queue ({queue.length})
            </button>
          </div>

          <div className={styles.headActions}>
            <button
              className={styles.uploadShortcutBtn}
              onClick={openFilePicker}
              title="Upload your own audio file"
            >
              <UploadIcon /> Upload
            </button>
            <button
              className={styles.close}
              onClick={closePanel}
              aria-label="Close music library"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body content based on tab */}
        <div className={styles.body}>
          {activeTab === 'carousel' && (
            <>
              <LibrarySearch
                query={query}
                onQueryChange={setQuery}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                genres={genres}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleLanguageChange}
                languages={languages}
                totalCount={filteredTracks.length}
              />
              <GlassyCarousel
                tracks={filteredTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handleSelectTrack}
                onAddToQueue={addToQueue}
              />
            </>
          )}

          {activeTab === 'grid' && (
            <>
              <LibrarySearch
                query={query}
                onQueryChange={setQuery}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                genres={genres}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleLanguageChange}
                languages={languages}
                totalCount={filteredTracks.length}
              />
              <TrackList
                tracks={filteredTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handleSelectTrack}
                onAddToQueue={addToQueue}
                onUploadClick={openFilePicker}
              />
            </>
          )}

          {activeTab === 'hindi' && (
            <>
              <LibrarySearch
                query={query}
                onQueryChange={setQuery}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                genres={genres}
                totalCount={filteredTracks.length}
              />
              <TrackList
                tracks={filteredTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handleSelectTrack}
                onAddToQueue={addToQueue}
                onUploadClick={openFilePicker}
              />
            </>
          )}

          {activeTab === 'queue' && (
            <QueueView
              queue={queue}
              queueIndex={queueIndex}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayQueueItem={playTrackFromQueue}
              onRemoveFromQueue={removeFromQueue}
              onClearQueue={clearQueue}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
