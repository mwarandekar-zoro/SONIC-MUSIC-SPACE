import { SearchIcon } from '../UI/Icons'
import styles from './MusicLibrary.module.css'

export default function LibrarySearch({
  query,
  onQueryChange,
  selectedGenre,
  onSelectGenre,
  genres,
  totalCount,
}) {
  return (
    <div className={styles.searchHeader}>
      <div className={styles.searchBar}>
        <span className={styles.searchIcon} aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by track title, artist, or album…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search music library"
        />
        {query && (
          <button
            className={styles.searchClear}
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {genres && genres.length > 1 && (
        <div className={styles.genresList} role="tablist" aria-label="Filter by genre">
          {genres.map((genre) => (
            <button
              key={genre}
              role="tab"
              aria-selected={selectedGenre === genre}
              className={`${styles.genreChip} ${selectedGenre === genre ? styles.genreChipActive : ''}`}
              onClick={() => onSelectGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
