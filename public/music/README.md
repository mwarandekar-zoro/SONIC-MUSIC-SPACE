# 🎵 Built-in Music Directory (`public/music/`)

Drop your audio files here!

Supported formats:
- `.mp3`
- `.wav`
- `.ogg`
- `.flac`
- `.m4a` / `.aac`

### How to add a new song to the SONIC//SPACE library:
1. Copy your audio file into this directory (e.g. `public/music/my-song.mp3`).
2. (Optional) Copy your album art into `public/artwork/my-art.jpg`.
3. Open `src/data/musicLibrary.js` and add an entry:
```javascript
{
  id: 'track-05',
  title: 'My Track Title',
  artist: 'Artist Name',
  album: 'Album Name',
  genre: 'Synthwave',
  src: '/music/my-song.mp3',
  artwork: '/artwork/my-art.jpg',
  duration: 215, // seconds (optional)
}
```
4. Save and your new track will immediately appear in the library with full audio-reactive 3D visualizer support!
