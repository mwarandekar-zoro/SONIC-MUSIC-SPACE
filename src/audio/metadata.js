const MAX_TAG_BYTES = 4 * 1024 * 1024 // never read more than this from the start of the file

const synchsafe = (b, o) => ((b[o] & 0x7f) << 21) | ((b[o + 1] & 0x7f) << 14) | ((b[o + 2] & 0x7f) << 7) | (b[o + 3] & 0x7f)
const uint32 = (b, o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0

const DECODERS = {
  0: () => new TextDecoder('iso-8859-1'),
  1: () => new TextDecoder('utf-16'), // uses the BOM
  2: () => new TextDecoder('utf-16be'),
  3: () => new TextDecoder('utf-8'),
}

function decodeText(bytes, encoding) {
  const decoder = (DECODERS[encoding] ?? DECODERS[0])()
  return decoder.decode(bytes).replace(/\0+$/g, '').trim()
}

/** Index of the string terminator (one zero byte, or two for UTF-16). */
function findTerminator(bytes, start, encoding) {
  const wide = encoding === 1 || encoding === 2
  for (let i = start; i < bytes.length - (wide ? 1 : 0); i += wide ? 2 : 1) {
    if (bytes[i] === 0 && (!wide || bytes[i + 1] === 0)) return i
  }
  return bytes.length
}

function parseArtwork(body) {
  const encoding = body[0]
  const mimeEnd = findTerminator(body, 1, 0)
  const mime = new TextDecoder('iso-8859-1').decode(body.subarray(1, mimeEnd)) || 'image/jpeg'
  const descEnd = findTerminator(body, mimeEnd + 2, encoding)
  const width = encoding === 1 || encoding === 2 ? 2 : 1
  const data = body.subarray(descEnd + width)
  if (!data.length) return null
  return new Blob([data], { type: mime.includes('/') ? mime : `image/${mime}` })
}

/**
 * Minimal ID3v2 reader (MP3): title, artist, album and cover art.
 * Returns null when there is no tag. Never throws.
 */
export async function readMetadata(file) {
  try {
    const head = new Uint8Array(await file.slice(0, 10).arrayBuffer())
    if (head[0] !== 0x49 || head[1] !== 0x44 || head[2] !== 0x33) return null // "ID3"

    const version = head[3]
    if (version < 3 || version > 4) return null
    const tagSize = Math.min(synchsafe(head, 6), MAX_TAG_BYTES)
    const tag = new Uint8Array(await file.slice(10, 10 + tagSize).arrayBuffer())

    let offset = 0
    if (head[5] & 0x40) offset = version === 4 ? synchsafe(tag, 0) : uint32(tag, 0) + 4 // extended header

    const result = { title: null, artist: null, album: null, artwork: null }
    while (offset + 10 <= tag.length) {
      const id = String.fromCharCode(tag[offset], tag[offset + 1], tag[offset + 2], tag[offset + 3])
      if (!/^[A-Z0-9]{4}$/.test(id)) break // padding reached
      const size = version === 4 ? synchsafe(tag, offset + 4) : uint32(tag, offset + 4)
      const body = tag.subarray(offset + 10, offset + 10 + size)
      offset += 10 + size
      if (!body.length) continue

      if (id === 'TIT2') result.title = decodeText(body.subarray(1), body[0])
      else if (id === 'TPE1') result.artist = decodeText(body.subarray(1), body[0])
      else if (id === 'TALB') result.album = decodeText(body.subarray(1), body[0])
      else if (id === 'APIC' && !result.artwork) result.artwork = parseArtwork(body)
    }
    return result
  } catch {
    return null
  }
}
