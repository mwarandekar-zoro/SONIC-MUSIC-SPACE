const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'hindi songs');
const musicDest = path.join(__dirname, '..', 'public', 'music', 'hindi');
const artDest = path.join(__dirname, '..', 'public', 'artwork', 'hindi');

if (!fs.existsSync(musicDest)) fs.mkdirSync(musicDest, { recursive: true });
if (!fs.existsSync(artDest)) fs.mkdirSync(artDest, { recursive: true });

const tracksDef = [
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.29 PM.mpeg', slug: 'qayde-se', title: 'Qayde Se', artist: 'Pritam, Arijit Singh, Amitabh Bhattacharya', album: 'Metro... In Dino', genre: 'Bollywood', year: '2024', accentColor: '#05d5ff', badge: 'LOSSLESS • 3D AUDIO', desc: 'Soulful melodic ballad with evocative acoustic guitar and resonant vocals by Arijit Singh.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.34 PM.mpeg', slug: 'kyon', title: 'Kyon', artist: 'Pritam, Papon, Sunidhi Chauhan', album: 'Barfi!', genre: 'Acoustic Pop', year: '2012', accentColor: '#ffd166', badge: 'ACOUSTIC WARMTH', desc: 'Whimsical acoustic breeze with sweet harmonizing whistles and heartfelt storytelling.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.36 PM (1).mpeg', slug: 'tu-chahiye', title: 'Tu Chahiye', artist: 'Atif Aslam & Pritam', album: 'Bajrangi Bhaijaan', genre: 'Sufi Pop', year: '2015', accentColor: '#ff4081', badge: 'HI-RES 24-BIT', desc: 'Passionate soaring vocal runs by Atif Aslam layered over uplifting orchestral sweeps.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.36 PM.mpeg', slug: 'tera-hone-laga-hoon', title: 'Tera Hone Laga Hoon', artist: 'Atif Aslam, Alisha Chinai, Pritam', album: 'Ajab Prem Ki Ghazab Kahani', genre: 'Romantic Pop', year: '2009', accentColor: '#ff6b81', badge: 'ALL-TIME HIT', desc: 'Nostalgic romantic synth duet with catchy acoustic rhythm and romantic melody.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.37 PM.mpeg', slug: 'pehli-nazar-mein', title: 'Pehli Nazar Mein', artist: 'Atif Aslam & Pritam', album: 'Race', genre: 'Romantic Pop', year: '2008', accentColor: '#48dbfb', badge: 'TOP CHART', desc: 'Legendary love anthem with crisp acoustic guitar strums and passionate crescendos.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.39 PM.mpeg', slug: 'iss-tarah', title: 'Iss Tarah', artist: 'Sonu Nigam & Chaar Diwaari', album: 'Chaar Diwaari', genre: 'Indie Fusion', year: '2024', accentColor: '#a55eea', badge: 'MODERN SOUND', desc: 'Hypnotic vocal timbre blending classical Hindi nuance with contemporary indie production.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.40 PM (1).mpeg', slug: 'tere-naina', title: 'Tere Naina', artist: 'Shafqat Amanat Ali & Shankar-Ehsaan-Loy', album: 'My Name Is Khan', genre: 'Sufi Classical', year: '2010', accentColor: '#1dd1a1', badge: 'CLASSICAL MASTER', desc: 'Spellbinding Sufi flourishes and intricate vocal improvisations over rich tabla dynamics.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.40 PM (2).mpeg', slug: 'tum-tak', title: 'Tum Tak', artist: 'A.R. Rahman, Javed Ali, Kirti Sagathia', album: 'Raanjhanaa', genre: 'Classical Fusion', year: '2013', accentColor: '#feca57', badge: 'A.R. RAHMAN', desc: 'Spiritual devotional masterpiece with soaring shehnai, dholak, and sublime harmonic layers.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.40 PM.mpeg', slug: 'abhi-na-jao-chhod-kar', title: 'Abhi Na Jao Chhod Kar', artist: 'Mohammed Rafi & Asha Bhosle', album: 'Hum Dono', genre: 'Vintage Classic', year: '1962', accentColor: '#ee5253', badge: 'TIMELESS GOLD', desc: 'Iconic golden-era duet brimming with pure romance, gentle rhythm, and velvet vocal mastery.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.05.41 PM.mpeg', slug: 'raat-bhar', title: 'Raat Bhar', artist: 'Arijit Singh, Shreya Ghoshal, Sajid-Wajid', album: 'Heropanti', genre: 'Dance Pop', year: '2014', accentColor: '#ff9ff3', badge: 'HIGH ENERGY', desc: 'Pumping four-on-the-floor synth groove with electrifying vocal interplay.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.22 PM.mpeg', slug: 'tu-jaane-na', title: 'Tu Jaane Na', artist: 'Atif Aslam & Pritam', album: 'Ajab Prem Ki Ghazab Kahani', genre: 'Sufi Rock', year: '2009', accentColor: '#54a0ff', badge: 'DOLBY ATMOS', desc: 'Emotive heartbreak ballad marked by Atif Aslam intense high register and electric guitars.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.23 PM (1).mpeg', slug: 'be-intehaan', title: 'Be Intehaan', artist: 'Atif Aslam, Sunidhi Chauhan, Pritam', album: 'Race 2', genre: 'Contemporary Pop', year: '2013', accentColor: '#5f27cd', badge: 'LOSSLESS AUDIO', desc: 'Sensual orchestral pop with sweeping strings and emotive vocal synergy.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.23 PM.mpeg', slug: 'mitwa', title: 'Mitwa', artist: 'Shafqat Amanat Ali, Shankar Mahadevan', album: 'Kabhi Alvida Naa Kehna', genre: 'Sufi Rock', year: '2006', accentColor: '#ff6b6b', badge: 'CLASSIC ANTHEM', desc: 'Exhilarating rock-infused Sufi anthem featuring thunderous drums and soaring passion.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.24 PM (1).mpeg', slug: 'pal-pal-dil-ke-paas', title: 'Pal Pal Dil Ke Paas', artist: 'Kishore Kumar', album: 'Blackmail', genre: 'Golden Classic', year: '1973', accentColor: '#10ac84', badge: 'EVERGREEN', desc: 'Kishore Kumar all-time romantic classic with nostalgic guitar arpeggios and warmth.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.24 PM.mpeg', slug: 'jiya-dhadak-dhadak-jaye', title: 'Jiya Dhadak Dhadak Jaye', artist: 'Rahat Fateh Ali Khan', album: 'Kalyug', genre: 'Sufi Pop', year: '2005', accentColor: '#e77f67', badge: 'WARM ANALOG', desc: 'Soul-stirring vocals from Rahat Fateh Ali Khan floating over ambient strings.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.25 PM (1).mpeg', slug: 'tum-se-hi', title: 'Tum Se Hi', artist: 'Mohit Chauhan & Pritam', album: 'Jab We Met', genre: 'Acoustic Ballad', year: '2007', accentColor: '#38ada9', badge: 'CULT HIT', desc: 'Breezy acoustic strums and Mohit Chauhan soothing vocals capturing the essence of rain.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.25 PM (2).mpeg', slug: 'zaalima', title: 'Zaalima', artist: 'Arijit Singh & Harshdeep Kaur', album: 'Raees', genre: 'Romantic Pop', year: '2017', accentColor: '#e58e26', badge: '3D AUDIO', desc: 'Irresistible romantic hook with delicate middle-eastern strings and crisp modern drums.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.25 PM.mpeg', slug: 'dildaara-stand-by-me', title: 'Dildaara (Stand By Me)', artist: 'Shafqat Amanat Ali & Vishal-Shekhar', album: 'Ra.One', genre: 'Electro Sufi', year: '2011', accentColor: '#00d2d3', badge: 'STAND BY ME', desc: 'Brilliant fusion of Ben E. King Stand By Me with Shafqat Amanat Ali Sufi prowess.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.26 PM (1).mpeg', slug: 'bade-achhe-lagte-hain', title: 'Bade Achhe Lagte Hain', artist: 'Amit Kumar & R.D. Burman', album: 'Balika Badhu', genre: 'Timeless Melody', year: '1976', accentColor: '#b8e994', badge: 'GOLDEN RETRO', desc: 'Gentle nostalgic melody with acoustic guitar and wholesome vintage intimacy.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.26 PM.mpeg', slug: 'khat', title: 'Khat', artist: 'Navjot Ahuja', album: 'Trending Beats', genre: 'Indie Acoustic', year: '2024', accentColor: '#f8a5c2', badge: 'INDIE SPOTLIGHT', desc: 'Modern soulful acoustic Hindi indie track with crisp guitar and introspective lyrics.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.27 PM (1).mpeg', slug: 'dagabaaz-re', title: 'Dagabaaz Re', artist: 'Rahat Fateh Ali Khan & Shreya Ghoshal', album: 'Dabangg 2', genre: 'Folk Bollywood', year: '2012', accentColor: '#e15f41', badge: 'FOLK POP', desc: 'Charming rural folk rhythm punctuated by playful harmonium and pristine duets.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.27 PM (2).mpeg', slug: 'laal-ishq', title: 'Laal Ishq', artist: 'Arijit Singh & Sanjay Leela Bhansali', album: 'Goliyon Ki Raasleela Ram-Leela', genre: 'Classical Semi-Sufi', year: '2013', accentColor: '#c0392b', badge: 'MASTERPIECE', desc: 'Haunting semi-classical odyssey with meditative sitar, heavy cymbals, and Arijit vocal heights.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.27 PM.mpeg', slug: 'bollywood-vibes', title: 'Bollywood Dreams', artist: 'Sonic Space (Hindi Special)', album: 'Sonic Space', genre: 'Ambient Fusion', year: '2024', accentColor: '#9c88ff', badge: 'SPECIAL TRACK', desc: 'Audio-reactive Bollywood synth immersion tailored for deep 3D visualizer response.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.28 PM (1).mpeg', slug: 'ishq-sufiyana', title: 'Ishq Sufiyana', artist: 'Kamal Khan & Vishal-Shekhar', album: 'The Dirty Picture', genre: 'Sufi Ballad', year: '2011', accentColor: '#f39c12', badge: 'SUFI MASTER', desc: 'Poignant qawwali-inspired vocal delivery over rhythmic claps and dynamic orchestral swells.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.28 PM.mpeg', slug: 'tere-mast-mast-do-nain', title: 'Tere Mast Mast Do Nain', artist: 'Rahat Fateh Ali Khan, Shreya Ghoshal, Sajid-Wajid', album: 'Dabangg', genre: 'Romantic Sufi', year: '2010', accentColor: '#2ecc71', badge: 'CHART TOPPER', desc: 'Beloved romantic classic with buoyant tabla beats and harmonious call-and-response vocals.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.35 PM.mpeg', slug: 'saathiya', title: 'Saathiya', artist: 'Shreya Ghoshal & Ajay-Atul', album: 'Singham', genre: 'Romantic Melody', year: '2011', accentColor: '#e056fd', badge: 'SWEET MELODY', desc: 'Cinematic romantic crescendo composed by Ajay-Atul featuring Shreya Ghoshal sublime singing.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.36 PM (1).mpeg', slug: 'abhi-kuch-dino-se', title: 'Abhi Kuch Dino Se', artist: 'Mohit Chauhan & Pritam', album: 'Dil Toh Baccha Hai Ji', genre: 'Acoustic Pop', year: '2011', accentColor: '#686de0', badge: 'FEEL GOOD', desc: 'Upbeat whistling intro and conversational acoustic lyrics celebrating new love.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.36 PM.mpeg', slug: 'moh-moh-ke-dhaage', title: 'Moh Moh Ke Dhaage', artist: 'Papon & Anu Malik', album: 'Dum Laga Ke Haisha', genre: 'Classical Folk', year: '2015', accentColor: '#ff7979', badge: 'NATIONAL AWARD', desc: 'Critically acclaimed classical-folk composition woven with delicate flute and sarangi.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.37 PM (1).mpeg', slug: 'piya-o-re-piya', title: 'Piya O Re Piya', artist: 'Atif Aslam, Shreya Ghoshal, Sachin-Jigar', album: 'Tere Naal Love Ho Gaya', genre: 'Melodic Pop', year: '2012', accentColor: '#30336b', badge: 'TIMELESS DUET', desc: 'Heartfelt emotional dialogue between Atif Aslam and Shreya Ghoshal with soaring strings.' },
  { file: 'WhatsApp Audio 2026-11-03 at 6.06.37 PM.mpeg', slug: 'saudebaazi', title: 'Saudebaazi', artist: 'Javed Ali & Pritam', album: 'Aakrosh', genre: 'Soulful Ballad', year: '2010', accentColor: '#22a6b3', badge: 'SOULFUL HIT', desc: 'Subtle guitar picking and passionate singing by Javed Ali celebrating unconditional devotion.' },
];

function extractCover(buf) {
  const apicIdx = buf.indexOf(Buffer.from('APIC'));
  if (apicIdx === -1) return null;
  const jpegIdx = buf.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]), apicIdx);
  const pngIdx = buf.indexOf(Buffer.from([0x89, 0x50, 0x4E, 0x47]), apicIdx);
  let start = -1;
  let ext = 'jpg';
  if (jpegIdx !== -1 && (pngIdx === -1 || jpegIdx < pngIdx)) {
    start = jpegIdx; ext = 'jpg';
  } else if (pngIdx !== -1) {
    start = pngIdx; ext = 'png';
  }
  if (start === -1) return null;
  if (ext === 'jpg') {
    const end = buf.indexOf(Buffer.from([0xFF, 0xD9]), start);
    if (end !== -1) return { ext, data: buf.subarray(start, end + 2) };
  } else if (ext === 'png') {
    const end = buf.indexOf(Buffer.from([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]), start);
    if (end !== -1) return { ext, data: buf.subarray(start, end + 8) };
  }
  return null;
}

function getMp3Duration(buf) {
  const info = buf.indexOf(Buffer.from('Info'));
  const xing = buf.indexOf(Buffer.from('Xing'));
  const headerIdx = info !== -1 ? info : xing;
  if (headerIdx !== -1) {
    const frames = buf.readUInt32BE(headerIdx + 8);
    for (let i = Math.max(0, headerIdx - 40); i < headerIdx; i++) {
      if (buf[i] === 0xFF && (buf[i+1] & 0xE0) === 0xE0) {
        const srCode = (buf[i+2] >> 2) & 0x03;
        const srTable = [44100, 48000, 32000, 44100];
        const sr = srTable[srCode] || 44100;
        return Math.round(frames * 1152 / sr);
      }
    }
  }
  return Math.round(buf.length / (192 * 1024 / 8));
}

const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180b26" />
      <stop offset="50%" stop-color="#4a154b" />
      <stop offset="100%" stop-color="#0e0918" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff007f" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#ff007f" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)" />
  <circle cx="250" cy="250" r="180" fill="url(#glow)" />
  <circle cx="250" cy="250" r="120" fill="none" stroke="#05d5ff" stroke-width="4" opacity="0.8" stroke-dasharray="10 15" />
  <circle cx="250" cy="250" r="70" fill="none" stroke="#ffdd59" stroke-width="6" opacity="0.9" />
  <text x="250" y="240" fill="#ffffff" font-size="28" font-weight="900" font-family="sans-serif" text-anchor="middle" letter-spacing="4">BOLLYWOOD</text>
  <text x="250" y="275" fill="#05d5ff" font-size="18" font-weight="600" font-family="sans-serif" text-anchor="middle" letter-spacing="6">DREAMS</text>
  <text x="250" y="320" fill="#ffdd59" font-size="12" font-weight="700" font-family="sans-serif" text-anchor="middle" letter-spacing="2">SONIC // SPACE</text>
</svg>`;
fs.writeFileSync(path.join(artDest, 'bollywood-vibes.svg'), fallbackSvg, 'utf8');

const finalLibraryData = [];

tracksDef.forEach((t, i) => {
  const inPath = path.join(srcDir, t.file);
  const outMp3 = path.join(musicDest, t.slug + '.mp3');
  const buf = fs.readFileSync(inPath);
  
  fs.copyFileSync(inPath, outMp3);
  
  const cover = extractCover(buf);
  let artRelPath = '/artwork/hindi/' + t.slug + '.jpg';
  if (cover) {
    fs.writeFileSync(path.join(artDest, t.slug + '.' + cover.ext), cover.data);
    artRelPath = '/artwork/hindi/' + t.slug + '.' + cover.ext;
  } else {
    artRelPath = '/artwork/hindi/bollywood-vibes.svg';
  }
  
  const duration = getMp3Duration(buf);
  
  finalLibraryData.push({
    id: 'hindi-' + String(i + 1).padStart(2, '0'),
    title: t.title,
    artist: t.artist,
    album: t.album,
    genre: t.genre,
    year: t.year,
    rating: (9.2 + ((i * 7) % 7) * 0.1).toFixed(1),
    accentColor: t.accentColor,
    badge: t.badge,
    language: 'Hindi',
    src: '/music/hindi/' + t.slug + '.mp3',
    artwork: artRelPath,
    duration: duration,
    description: t.desc
  });
});

console.log('Processed ' + finalLibraryData.length + ' Hindi tracks successfully.');
fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'hindiTracks.json'), JSON.stringify(finalLibraryData, null, 2), 'utf8');
