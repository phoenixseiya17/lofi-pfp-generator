/* Lofi PFP Generator — procedural pixel-art Yeti renderer.
   Zero network, zero dependencies. The Yeti is drawn pixel by pixel
   on a 64x64 grid, so every trait combination renders instantly. */
'use strict';

const W = 64, H = 64;

/* ---------------- palettes ---------------- */
const FUR = {
  white:  { label: 'White',  base: '#F5F7F9', shadow: '#C7D2DB', deep: '#93A9BC', light: '#FFFFFF', swatch: '#F5F7F9', rarity: 'Common' },
  blue:   { label: 'Blue',   base: '#8FC3EA', shadow: '#5A9BD8', deep: '#3570AC', light: '#C4E2F7', swatch: '#8FC3EA', rarity: 'Common' },
  mint:   { label: 'Mint',   base: '#A9E8C9', shadow: '#63C79A', deep: '#2F9E6E', light: '#D6F7E6', swatch: '#A9E8C9', rarity: 'Common' },
  pink:   { label: 'Pink',   base: '#FFB8D4', shadow: '#F28BB4', deep: '#CE5A90', light: '#FFD9E8', swatch: '#FFB8D4', rarity: 'Rare' },
  purple: { label: 'Purple', base: '#C9A8F0', shadow: '#9B6BD6', deep: '#6E3FA8', light: '#E3D2FA', swatch: '#C9A8F0', rarity: 'Rare' },
  gold:   { label: 'Gold',   base: '#FFD76A', shadow: '#F2A92E', deep: '#C07F16', light: '#FFE9A8', swatch: '#FFD76A', rarity: 'Legendary' },
};

const EXPRESSIONS = {
  happy:   { label: 'Happy',   rarity: 'Common' },
  sleepy:  { label: 'Sleepy',  rarity: 'Common' },
  cool:    { label: 'Cool',    rarity: 'Rare' },
  excited: { label: 'Excited', rarity: 'Rare' },
};

const EYES = {
  normal:     { label: 'Normal',     rarity: 'Common' },
  closed:     { label: 'Closed',     rarity: 'Common' },
  sunglasses: { label: 'Sunglasses', rarity: 'Rare' },
  star:       { label: 'Star Eyes',  rarity: 'Epic' },
};

const ACCESSORIES = {
  none:       { label: 'None',       rarity: 'Common' },
  scarf:      { label: 'Scarf',      rarity: 'Common' },
  beanie:     { label: 'Beanie',     rarity: 'Rare' },
  headphones: { label: 'Headphones', rarity: 'Rare' },
  crown:      { label: 'Crown',      rarity: 'Epic' },
};

const BACKGROUNDS = {
  arctic:  { label: 'Arctic Snow',   rarity: 'Common' },
  sky:     { label: 'Gradient Sky',  rarity: 'Common' },
  night:   { label: 'Starry Night',  rarity: 'Common' },
  carnival:{ label: 'Carnival',      rarity: 'Rare' },
  neon:    { label: 'Neon City',     rarity: 'Rare' },
};

const FACE = { base: '#7FB8DC', shadow: '#4E8FB8', nose: '#3D7AA8' };
const INK = '#1F2A37';
const BLUSH = '#F28BB4';

/* ---------------- state ---------------- */
const state = {
  fur: 'white',
  expression: 'happy',
  eyes: 'normal',
  accessory: 'none',
  background: 'arctic',
};

/* ---------------- seeded random ---------------- */
function hash2(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 974634211) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seedFromTraits(s) {
  const str = [s.fur, s.expression, s.eyes, s.accessory, s.background].join('|');
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* ---------------- grid ---------------- */
let grid = [];
function newGrid() { grid = Array.from({ length: H }, () => new Array(W).fill(null)); }
function setPx(x, y, c) {
  x |= 0; y |= 0;
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  grid[y][x] = c;
  if (trackPaint) painted[y][x] = true;
}
function getPx(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return null;
  return grid[y][x];
}
function rect(x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) setPx(i, j, c);
}
function ellipse(cx, cy, rx, ry, c, fluff, seed) {
  for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
    for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      const d = dx * dx + dy * dy;
      if (d <= 0.92) { setPx(x, y, c); continue; }
      if (fluff && d <= 1.18) {
        const p = (1.18 - d) / 0.26;
        if (hash2(x, y, seed) < p * 0.75) setPx(x, y, c);
      }
    }
  }
}
function circle(cx, cy, r, c) { ellipse(cx, cy, r, r, c, false, 0); }
function line(x0, y0, x1, y1, c) {
  const dx = x1 - x0, dy = y1 - y0, steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 0; i <= steps; i++) setPx(Math.round(x0 + dx * i / steps), Math.round(y0 + dy * i / steps), c);
}

/* ---------------- color helpers ---------------- */
function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function mix(a, b, t) {
  const A = hexRgb(a), B = hexRgb(b);
  return rgbHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
function vGradient(top, bottom) {
  for (let y = 0; y < H; y++) {
    const c = mix(top, bottom, y / (H - 1));
    for (let x = 0; x < W; x++) setPx(x, y, c);
  }
}

/* ---------------- backgrounds ---------------- */
function drawBackground(name, seed) {
  const rnd = mulberry32(seed ^ 0xBACC);
  if (name === 'arctic') {
    vGradient('#A8D8EA', '#EAF7FF');
    for (let i = 0; i < 46; i++) setPx(Math.floor(rnd() * W), Math.floor(rnd() * 44), '#FFFFFF');
    ellipse(32, 68, 36, 10, '#FFFFFF', false, 0);
    ellipse(10, 64, 16, 7, '#DFF2FB', false, 0);
  } else if (name === 'neon') {
    vGradient('#2B0A4A', '#12042B');
    for (let i = 0; i < 26; i++) setPx(Math.floor(rnd() * W), Math.floor(rnd() * 22), rnd() > 0.5 ? '#FFFFFF' : '#FFD76A');
    // buildings
    let x = 0;
    while (x < W) {
      const bw = 7 + Math.floor(rnd() * 7);
      const bh = 12 + Math.floor(rnd() * 22);
      rect(x, H - bh, bw, bh, '#1A0533');
      for (let wy = H - bh + 2; wy < H - 2; wy += 3)
        for (let wx = x + 1; wx < x + bw - 1; wx += 3)
          if (rnd() > 0.55) setPx(wx, wy, rnd() > 0.5 ? '#FFD76A' : '#7FE3FF');
      x += bw + 1;
    }
  } else if (name === 'carnival') {
    vGradient('#7FD4FF', '#FFF3C4');
    // ferris wheel
    const cx = 49, cy = 20, r = 12;
    for (let a = 0; a < 360; a += 6) {
      const rad = a * Math.PI / 180;
      setPx(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), '#E84A4A');
    }
    for (let a = 0; a < 8; a++) {
      const rad = a * Math.PI / 4;
      line(cx, cy, Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), '#E84A4A');
    }
    for (let a = 0; a < 8; a++) {
      const rad = a * Math.PI / 4 + Math.PI / 8;
      setPx(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), '#FFD76A');
    }
    setPx(cx, cy, '#E84A4A');
    line(cx, cy + r, cx, H, '#E84A4A');
    // striped tent, bottom left
    for (let y = 44; y < H; y++) {
      const half = Math.round((y - 44) * 0.55) + 2;
      for (let x = 2; x < 2 + half * 2; x++) {
        const stripe = Math.floor((x - 2) / 4) % 2 === 0;
        setPx(x, y, stripe ? '#E84A4A' : '#FFF6E8');
      }
    }
    line(2, 44, 22, 44, '#E84A4A');
    setPx(12, 41, '#FFD76A'); setPx(12, 42, '#FFD76A'); setPx(12, 43, '#FFD76A');
  } else if (name === 'sky') {
    vGradient('#7FD4FF', '#FFE9A8');
    circle(50, 12, 5, '#FFD76A');
    circle(50, 12, 3, '#FFE9A8');
    ellipse(14, 14, 9, 3, '#FFFFFF', false, 0);
    ellipse(20, 17, 7, 3, '#FFFFFF', false, 0);
    ellipse(44, 32, 8, 3, '#FFFFFF', false, 0);
    ellipse(10, 40, 7, 2, '#FFFFFF', false, 0);
  } else if (name === 'night') {
    vGradient('#0B1035', '#1B2A6B');
    for (let i = 0; i < 60; i++) setPx(Math.floor(rnd() * W), Math.floor(rnd() * 40), rnd() > 0.7 ? '#FFD76A' : '#FFFFFF');
    circle(49, 11, 5, '#F5F0DC');
    circle(51, 10, 4, '#1B2A6B'); // crescent cutout
    ellipse(8, 62, 18, 8, '#0A0E2E', false, 0);
    ellipse(56, 64, 16, 7, '#0A0E2E', false, 0);
  }
}

/* ---------------- the Yeti ---------------- */
/* Head-and-shoulders PORTRAIT, matching the AI-generated pixel previews:
   a large head fills most of the frame, big blue face front and center,
   fluffy fur framing the face, shoulders cut off at the bottom edge.
   That composition is also the standard PFP format. The portrait removes
   the arm problem entirely, so nothing can read as ape-like limbs.
   The Yeti must read as a YETI, not a gorilla: white fluffy fur, a big
   prominent blue face, snow on the fur, a friendly round face, bold
   dark outline around the silhouette (as in the previews). */
let bgSnap = null; // background snapshot (kept for reference)
let currentFur = null;
const painted = Array.from({ length: H }, () => new Array(W).fill(false));
let trackPaint = false; // true while the Yeti/accessories are drawn

function spike(x, tipY, baseY, halfW, c) {
  for (let y = tipY; y <= baseY; y++) {
    const t = (y - tipY) / Math.max(1, baseY - tipY);
    const hw = Math.round(halfW * t);
    for (let xx = x - hw; xx <= x + hw; xx++) setPx(xx, y, c);
  }
}

function drawTuft(fur, seed) {
  // spiky fur tuft across the top of the head
  const tips = [[22, 3], [27, 1], [32, 2], [37, 1], [42, 3]];
  for (const [x, tipY] of tips) spike(x, tipY, 9, 3, fur.base);
}

function outlineFur() {
  // Bold dark outline around the fur silhouette, as in the previews:
  // any fur pixel whose neighbour was never painted by the Yeti is on
  // the outer edge and becomes INK. (A plain colour comparison would
  // misfire wherever fur and background share a colour, e.g. white
  // fur light on the arctic snow hill.)
  const fur = currentFur;
  const isFur = (c) => c === fur.base || c === fur.shadow || c === fur.deep || c === fur.light;
  const marks = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!isFur(grid[y][x])) continue;
      const nbs = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [nx, ny] of nbs) {
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        if (!painted[ny][nx]) { marks.push([x, y]); break; }
      }
    }
  }
  for (const [x, y] of marks) setPx(x, y, INK);
}

function drawYeti(s, seed) {
  const fur = FUR[s.fur];
  const rnd = mulberry32(seed ^ 0x5EED);
  currentFur = fur;

  // ---- shoulders: wide fur mass, cut off at the bottom edge ----
  rect(4, 54, 56, 10, fur.base);
  ellipse(32, 54, 26, 7, fur.base, true, seed + 21);
  ellipse(32, 58, 14, 6, fur.light, false, 0); // chest highlight
  ellipse(32, 53, 9, 4, fur.shadow, false, 0); // small neck shadow under the beard

  // ---- head fur: big blob filling most of the frame ----
  ellipse(32, 27, 17, 23, fur.base, true, seed + 2);
  // fur shadow crescent under the chin
  ellipse(32, 43, 11, 6, fur.shadow, false, 0);

  // ---- spiky tuft on top ----
  drawTuft(fur, seed);

  // ---- ears (fur rim + blue inner) ----
  circle(11, 30, 5, fur.base);
  circle(11, 30, 4, FACE.base);
  circle(11, 30, 2, FACE.shadow);
  circle(53, 30, 5, fur.base);
  circle(53, 30, 4, FACE.base);
  circle(53, 30, 2, FACE.shadow);

  // ---- face: big blue oval, soft shadow rim, shadow crescent at bottom ----
  ellipse(32, 30, 12, 12, FACE.shadow, false, 0);
  ellipse(32, 30, 11, 11, FACE.base, false, 0);
  ellipse(32, 36, 9, 5, FACE.shadow, false, 0);
  ellipse(32, 29, 10, 9, FACE.base, false, 0);

  drawEyes(s, seed);
  drawBrows(s);
  drawNoseMouth(s);
  drawBlush(s);

  // ---- beard fringe: jagged fur hanging under the chin ----
  for (let x = 22; x <= 42; x++) {
    const len = 2 + Math.floor(hash2(x, 7, seed) * 5);
    for (let y = 42; y < 42 + len; y++) setPx(x, y, fur.base);
    setPx(x, 42 + len, fur.shadow);
  }

  // ---- hands peeking out at the bottom corners ----
  ellipse(9, 61, 5, 4, FACE.base, false, 0);
  ellipse(55, 61, 5, 4, FACE.base, false, 0);
  ellipse(9, 62, 4, 2, FACE.shadow, false, 0);
  ellipse(55, 62, 4, 2, FACE.shadow, false, 0);

  // snow speckles on the fur + tiny icicles hanging from the beard
  let placed = 0;
  while (placed < 26) {
    const x = 14 + Math.floor(rnd() * 36);
    const y = 4 + Math.floor(rnd() * 54);
    const c = getPx(x, y);
    if (c === fur.base || c === fur.shadow) { setPx(x, y, '#FFFFFF'); placed++; }
  }
  setPx(26, 48, '#DFF2FB'); setPx(26, 49, '#BFE3F2');
  setPx(38, 48, '#DFF2FB'); setPx(38, 49, '#BFE3F2');

  // bold outline around the whole silhouette
  outlineFur();
}

function drawEyes(s, seed) {
  const style = s.eyes;
  const centers = [[26, 28], [38, 28]];
  if (style === 'sunglasses') {
    // big black shades spanning the face, as in the classic preview
    rect(20, 25, 11, 6, '#141414');
    rect(33, 25, 11, 6, '#141414');
    rect(30, 26, 3, 2, '#141414');
    setPx(22, 26, '#FFFFFF'); setPx(36, 26, '#FFFFFF');
    return;
  }
  if (style === 'star') {
    for (const [cx, cy] of centers) {
      setPx(cx, cy - 2, '#FFD76A'); setPx(cx - 1, cy - 1, '#FFD76A'); setPx(cx, cy - 1, '#FFD76A'); setPx(cx + 1, cy - 1, '#FFD76A');
      setPx(cx - 2, cy, '#FFD76A'); setPx(cx - 1, cy, '#FFD76A'); setPx(cx, cy, '#FFD76A'); setPx(cx + 1, cy, '#FFD76A'); setPx(cx + 2, cy, '#FFD76A');
      setPx(cx - 1, cy + 1, '#FFD76A'); setPx(cx + 1, cy + 1, '#FFD76A'); setPx(cx, cy + 2, '#FFD76A');
      setPx(cx - 1, cy - 2, '#FFFFFF');
    }
    return;
  }
  if (style === 'closed') {
    for (const [cx, cy] of centers) {
      setPx(cx - 2, cy - 1, INK); setPx(cx - 1, cy, INK); setPx(cx, cy, INK); setPx(cx + 1, cy, INK); setPx(cx + 2, cy - 1, INK);
    }
    return;
  }
  // normal (or half-closed when sleepy)
  const half = s.expression === 'sleepy';
  for (const [cx, cy] of centers) {
    rect(cx - 2, cy - 1, 4, half ? 2 : 3, '#FFFFFF');
    rect(cx - 1, cy, 2, half ? 1 : 2, INK);
  }
}

function drawBrows(s) {
  const e = s.expression;
  if (e === 'happy') {
    setPx(23, 24, INK); setPx(24, 23, INK); setPx(25, 23, INK); setPx(26, 24, INK);
    setPx(38, 24, INK); setPx(39, 23, INK); setPx(40, 23, INK); setPx(41, 24, INK);
  } else if (e === 'cool') {
    line(22, 23, 28, 25, INK); // left brow angled down toward center
    line(36, 25, 42, 23, INK); // right brow raised
  } else if (e === 'sleepy') {
    rect(22, 24, 6, 1, INK);
    rect(36, 24, 6, 1, INK);
  } else if (e === 'excited') {
    setPx(23, 22, INK); setPx(24, 21, INK); setPx(25, 21, INK); setPx(26, 22, INK);
    setPx(38, 22, INK); setPx(39, 21, INK); setPx(40, 21, INK); setPx(41, 22, INK);
  }
}

function drawNoseMouth(s) {
  const e = s.expression;
  // nose with two nostrils
  ellipse(32, 34, 3, 2, FACE.nose, false, 0);
  setPx(30, 34, INK); setPx(34, 34, INK);
  if (e === 'happy') {
    rect(29, 37, 7, 1, INK);
    rect(28, 38, 9, 1, INK);
    rect(29, 39, 7, 1, INK);
    rect(31, 40, 3, 1, INK);
    rect(30, 39, 5, 1, '#F28BB4'); // tongue
  } else if (e === 'cool') {
    line(29, 38, 36, 38, INK);
    setPx(36, 37, INK); setPx(37, 36, INK);
  } else if (e === 'sleepy') {
    rect(30, 38, 5, 1, INK);
  } else if (e === 'excited') {
    rect(28, 36, 9, 1, '#FFFFFF'); // teeth
    rect(27, 37, 11, 1, INK);
    rect(27, 38, 11, 2, INK);
    rect(28, 40, 9, 1, INK);
    rect(30, 39, 5, 2, '#F28BB4'); // tongue
  }
}

function drawBlush(s) {
  if (s.expression !== 'happy' && s.expression !== 'excited') return;
  rect(21, 33, 3, 2, BLUSH);
  rect(40, 33, 3, 2, BLUSH);
}

/* ---------------- accessories ---------------- */
/* All positioned for the portrait geometry: crown on top of the head,
   headphones resting on the chest (as in the blue preview), beanie
   over the top of the head, scarf wrapped at the shoulders. */
function drawAccessory(s) {
  const a = s.accessory;
  if (a === 'crown') {
    // bright spikes with a dark outline, sitting on top of the head
    spike(26, 0, 4, 3, INK); spike(32, -1, 4, 3, INK); spike(38, 0, 4, 3, INK);
    spike(26, 1, 4, 2, '#FFE9A8'); spike(32, 0, 4, 2, '#FFE9A8'); spike(38, 1, 4, 2, '#FFE9A8');
    rect(24, 4, 17, 3, '#F2A92E');
    setPx(28, 5, '#E84A4A'); setPx(32, 5, '#E84A4A'); setPx(36, 5, '#E84A4A');
    rect(24, 7, 17, 1, '#8A5A00'); // dark outline under the band
  } else if (a === 'headphones') {
    // cups resting on the chest, band hidden behind the beard
    rect(17, 52, 6, 9, '#232323');
    rect(41, 52, 6, 9, '#232323');
    rect(18, 54, 4, 5, '#3A3A3A');
    rect(42, 54, 4, 5, '#3A3A3A');
    setPx(19, 56, '#7FE3FF'); setPx(20, 56, '#7FE3FF');
    setPx(43, 56, '#7FE3FF'); setPx(44, 56, '#7FE3FF');
    // short strap stubs disappearing behind the beard
    setPx(19, 51, '#232323'); setPx(20, 50, '#232323');
    setPx(44, 51, '#232323'); setPx(43, 50, '#232323');
  } else if (a === 'beanie') {
    // dark rim behind, red cap on top, covering the tuft
    for (let y = 2; y <= 7; y++) {
      const half = 11 + (y - 2);
      for (let x = 32 - half; x <= 32 + half; x++) setPx(x, y, '#7A1F1F');
    }
    for (let y = 2; y <= 7; y++) {
      const half = 10 + (y - 2);
      for (let x = 32 - half; x <= 32 + half; x++) setPx(x, y, '#E84A4A');
    }
    rect(14, 8, 36, 3, '#7A1F1F'); // brim rim
    rect(15, 8, 34, 3, '#B83232'); // brim
    rect(15, 9, 34, 1, '#FFD76A'); // brim stripe
    circle(32, 1, 2, '#FFFFFF'); // pompom
  } else if (a === 'scarf') {
    // wraps the shoulders, tail hangs down the chest
    rect(12, 52, 40, 4, '#2EC4B6');
    rect(12, 54, 40, 1, '#1D8A80');
    rect(40, 56, 6, 7, '#2EC4B6'); // hanging tail
    rect(40, 62, 6, 1, '#1D8A80');
    setPx(41, 63, '#2EC4B6'); setPx(43, 63, '#2EC4B6'); setPx(45, 63, '#2EC4B6');
  }
}

/* ---------------- render ---------------- */
function render(s) {
  newGrid();
  for (let y = 0; y < H; y++) painted[y].fill(false);
  const seed = seedFromTraits(s);
  drawBackground(s.background, seed);
  bgSnap = grid.map(row => row.slice()); // snapshot for reference
  trackPaint = true; // from here on, setPx records painted pixels
  drawYeti(s, seed);
  drawAccessory(s);
  trackPaint = false;
  blitToCanvas();
}

const canvas = document.getElementById('yetiCanvas');
const ctx = canvas.getContext('2d');
function blitToCanvas() {
  ctx.imageSmoothingEnabled = false;
  const scale = canvas.width / W;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(Math.floor(x * scale), Math.floor(y * scale), Math.ceil(scale), Math.ceil(scale));
    }
  }
}

/* ---------------- UI ---------------- */
const RARITY_ORDER = ['Common', 'Rare', 'Epic', 'Legendary'];
function buildOptions(containerId, config, key) {
  const box = document.getElementById(containerId);
  box.innerHTML = '';
  for (const [value, def] of Object.entries(config)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opt' + (state[key] === value ? ' active' : '');
    btn.dataset.value = value;
    btn.dataset.group = key;
    btn.innerHTML = (def.swatch ? '<span class="swatch" style="background:' + def.swatch + '"></span>' : '') + def.label;
    btn.title = def.rarity;
    btn.addEventListener('click', () => {
      state[key] = value;
      render(state);
      syncUI();
    });
    box.appendChild(btn);
  }
}

function syncUI() {
  document.querySelectorAll('.opt').forEach(b => {
    b.classList.toggle('active', state[b.dataset.group] === b.dataset.value);
  });
  const rows = [
    ['FUR', FUR[state.fur].label, FUR[state.fur].rarity],
    ['EXPRESSION', EXPRESSIONS[state.expression].label, EXPRESSIONS[state.expression].rarity],
    ['EYES', EYES[state.eyes].label, EYES[state.eyes].rarity],
    ['ACCESSORY', ACCESSORIES[state.accessory].label, ACCESSORIES[state.accessory].rarity],
    ['BACKGROUND', BACKGROUNDS[state.background].label, BACKGROUNDS[state.background].rarity],
  ];
  document.getElementById('traitList').innerHTML = rows.map(([k, v, r]) =>
    '<div class="trait-row"><span class="trait-name">' + k + '</span>' +
    '<span><span class="trait-value">' + v + '</span> ' +
    '<span class="badge ' + r + '">' + r.toUpperCase() + '</span></span></div>'
  ).join('');
}

function weightedPick(config) {
  const weights = { Common: 60, Rare: 25, Epic: 10, Legendary: 5 };
  const entries = Object.entries(config);
  const total = entries.reduce((s, [, d]) => s + (weights[d.rarity] || 10), 0);
  let roll = Math.random() * total;
  for (const [value, def] of entries) {
    roll -= weights[def.rarity] || 10;
    if (roll <= 0) return value;
  }
  return entries[0][0];
}

function randomize() {
  state.fur = weightedPick(FUR);
  state.expression = weightedPick(EXPRESSIONS);
  state.eyes = weightedPick(EYES);
  state.accessory = weightedPick(ACCESSORIES);
  state.background = weightedPick(BACKGROUNDS);
  render(state);
  syncUI();
}

function downloadPNG() {
  const off = document.createElement('canvas');
  off.width = 512; off.height = 512;
  const octx = off.getContext('2d');
  octx.imageSmoothingEnabled = false;
  const scale = 512 / W;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (!c) continue;
      octx.fillStyle = c;
      octx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  off.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lofi-yeti-pfp.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }, 'image/png');
}

document.getElementById('randomizeBtn').addEventListener('click', randomize);
document.getElementById('downloadBtn').addEventListener('click', downloadPNG);

buildOptions('furOptions', FUR, 'fur');
buildOptions('expressionOptions', EXPRESSIONS, 'expression');
buildOptions('eyesOptions', EYES, 'eyes');
buildOptions('accessoryOptions', ACCESSORIES, 'accessory');
buildOptions('backgroundOptions', BACKGROUNDS, 'background');
render(state);
syncUI();

/* test hooks (used by the automated verification, harmless in production) */
window.__yeti = {
  state,
  renderCount: 0,
  grid() {
    return grid.map(row => row.slice());
  },
  gridHash() {
    let h = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (c) h = (Math.imul(h, 31) + c.charCodeAt(1) + c.charCodeAt(2)) | 0;
    }
    return h;
  },
};
