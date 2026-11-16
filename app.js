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
/* Full-body portrait with a clear silhouette: a distinct round head
   (big blue face) separated from the body by a visible neck break,
   a defined torso with belly, short arms at the sides, and feet at
   the bottom. The Yeti must read as a YETI, not a gorilla: white
   fluffy fur, a big prominent blue face, snow on the fur, a friendly
   round face, short arms, upright posture. */
function drawYeti(s, seed) {
  const fur = FUR[s.fur];
  const rnd = mulberry32(seed ^ 0x5EED);
  // body / torso
  ellipse(32, 50, 15, 11, fur.base, true, seed + 1);
  ellipse(32, 52, 9, 7, fur.light, false, 0); // belly highlight
  // arms: short, at the sides, never ape-like
  ellipse(15, 47, 3, 7, fur.base, true, seed + 11);
  ellipse(49, 47, 3, 7, fur.base, true, seed + 12);
  circle(15, 55, 3, FACE.base); // hands
  circle(49, 55, 3, FACE.base);
  // feet peeking out under the body
  ellipse(25, 62, 4, 2, FACE.base);
  ellipse(39, 62, 4, 2, FACE.base);
  // neck: narrow shadow connector between head and body
  rect(29, 35, 6, 4, fur.shadow);
  // ears (fur rim + blue inner)
  circle(17, 22, 3, fur.base);
  circle(17, 22, 2, FACE.base);
  circle(47, 22, 3, fur.base);
  circle(47, 22, 2, FACE.base);
  // head with fluffy edge
  ellipse(32, 23, 14, 12, fur.base, true, seed + 2);
  // fur shadow crescent at bottom of head
  ellipse(32, 31, 12, 7, fur.shadow, false, 0);
  // hair tuft on top
  setPx(28, 10, fur.deep); setPx(29, 9, fur.deep); setPx(30, 8, fur.deep); setPx(31, 8, fur.deep);
  setPx(32, 7, fur.deep); setPx(33, 8, fur.deep); setPx(34, 8, fur.deep); setPx(35, 9, fur.deep); setPx(36, 10, fur.deep);
  setPx(30, 9, fur.base); setPx(31, 9, fur.base); setPx(32, 8, fur.base); setPx(33, 9, fur.base); setPx(34, 9, fur.base);
  // face — big blue oval with a soft shadow crescent at the bottom
  ellipse(32, 25, 10, 9, FACE.base, false, 0);
  ellipse(32, 30, 8, 4, FACE.shadow, false, 0);
  ellipse(32, 24, 9, 7, FACE.base, false, 0);

  drawEyes(s, seed);
  drawBrows(s);
  drawNoseMouth(s);
  drawBlush(s);

  // snow speckles on the fur + tiny icicles hanging from the chin
  let placed = 0;
  while (placed < 26) {
    const x = 14 + Math.floor(rnd() * 36);
    const y = 8 + Math.floor(rnd() * 50);
    const c = getPx(x, y);
    if (c === fur.base || c === fur.shadow) { setPx(x, y, '#FFFFFF'); placed++; }
  }
  // icicles hanging from the lower head edge
  setPx(27, 34, '#DFF2FB'); setPx(27, 35, '#BFE3F2');
  setPx(37, 34, '#DFF2FB'); setPx(37, 35, '#BFE3F2');
}

function drawEyes(s, seed) {
  const style = s.eyes;
  const centers = [[26, 23], [38, 23]];
  if (style === 'sunglasses') {
    rect(20, 20, 10, 5, '#141414');
    rect(34, 20, 10, 5, '#141414');
    rect(30, 21, 4, 2, '#141414');
    setPx(22, 21, '#FFFFFF'); setPx(36, 21, '#FFFFFF');
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
    setPx(23, 19, INK); setPx(24, 18, INK); setPx(25, 18, INK); setPx(26, 19, INK);
    setPx(38, 19, INK); setPx(39, 18, INK); setPx(40, 18, INK); setPx(41, 19, INK);
  } else if (e === 'cool') {
    line(22, 18, 28, 20, INK); // left brow angled down toward center
    line(36, 20, 42, 18, INK); // right brow raised
  } else if (e === 'sleepy') {
    rect(22, 19, 6, 1, INK);
    rect(36, 19, 6, 1, INK);
  } else if (e === 'excited') {
    setPx(23, 17, INK); setPx(24, 16, INK); setPx(25, 16, INK); setPx(26, 17, INK);
    setPx(38, 17, INK); setPx(39, 16, INK); setPx(40, 16, INK); setPx(41, 17, INK);
  }
}

function drawNoseMouth(s) {
  const e = s.expression;
  // nose
  ellipse(32, 28, 2, 1, FACE.nose, false, 0);
  if (e === 'happy') {
    rect(29, 31, 7, 1, INK);
    rect(28, 32, 9, 1, INK);
    rect(29, 33, 7, 1, INK);
    rect(31, 34, 3, 1, INK);
    rect(30, 33, 5, 1, '#F28BB4'); // tongue
  } else if (e === 'cool') {
    line(29, 32, 36, 32, INK);
    setPx(36, 31, INK); setPx(37, 30, INK);
  } else if (e === 'sleepy') {
    rect(30, 32, 5, 1, INK);
  } else if (e === 'excited') {
    rect(28, 30, 9, 1, '#FFFFFF'); // teeth
    rect(27, 31, 11, 1, INK);
    rect(27, 32, 11, 2, INK);
    rect(28, 34, 9, 1, INK);
    rect(30, 33, 5, 2, '#F28BB4'); // tongue
  }
}

function drawBlush(s) {
  if (s.expression !== 'happy' && s.expression !== 'excited') return;
  rect(20, 28, 3, 2, BLUSH);
  rect(41, 28, 3, 2, BLUSH);
}

/* ---------------- accessories ---------------- */
function drawAccessory(s) {
  const a = s.accessory;
  if (a === 'crown') {
    // bright spikes + darker band so the crown reads even on gold fur
    rect(24, 7, 17, 3, '#F2A92E');
    setPx(25, 6, '#FFE9A8'); setPx(25, 5, '#FFE9A8'); setPx(25, 4, '#FFE9A8');
    setPx(32, 6, '#FFE9A8'); setPx(32, 5, '#FFE9A8'); setPx(32, 4, '#FFE9A8'); setPx(32, 3, '#FFE9A8');
    setPx(39, 6, '#FFE9A8'); setPx(39, 5, '#FFE9A8'); setPx(39, 4, '#FFE9A8');
    setPx(26, 6, '#FFE9A8'); setPx(31, 6, '#FFE9A8'); setPx(33, 6, '#FFE9A8'); setPx(38, 6, '#FFE9A8');
    setPx(28, 8, '#E84A4A'); setPx(32, 8, '#E84A4A'); setPx(36, 8, '#E84A4A');
    rect(24, 10, 17, 1, '#8A5A00'); // dark outline under the band
  } else if (a === 'headphones') {
    // band arc over the head
    for (let deg = 200; deg <= 340; deg += 4) {
      const rad = deg * Math.PI / 180;
      setPx(Math.round(32 + Math.cos(rad) * 17), Math.round(24 + Math.sin(rad) * 16), '#232323');
      setPx(Math.round(32 + Math.cos(rad) * 16), Math.round(24 + Math.sin(rad) * 15), '#232323');
    }
    // ear cups
    rect(12, 20, 5, 9, '#232323');
    rect(47, 20, 5, 9, '#232323');
    setPx(14, 24, '#7FE3FF'); setPx(14, 25, '#7FE3FF');
    setPx(49, 24, '#7FE3FF'); setPx(49, 25, '#7FE3FF');
  } else if (a === 'beanie') {
    // cap over the top of the head
    for (let y = 4; y <= 9; y++) {
      const half = 10 + (y - 4);
      for (let x = 32 - half; x <= 32 + half; x++) setPx(x, y, '#E84A4A');
    }
    rect(15, 10, 34, 3, '#B83232'); // brim
    rect(15, 11, 34, 1, '#FFD76A'); // brim stripe
    circle(32, 3, 3, '#FFFFFF'); // pompom
  } else if (a === 'scarf') {
    // wraps the neck break, tail hangs down the chest
    rect(20, 37, 24, 4, '#2EC4B6');
    rect(20, 39, 24, 1, '#1D8A80');
    rect(40, 41, 6, 8, '#2EC4B6'); // hanging tail
    rect(40, 47, 6, 1, '#1D8A80');
    setPx(41, 49, '#2EC4B6'); setPx(43, 49, '#2EC4B6'); setPx(45, 49, '#2EC4B6');
  }
}

/* ---------------- render ---------------- */
function render(s) {
  newGrid();
  const seed = seedFromTraits(s);
  drawBackground(s.background, seed);
  drawYeti(s, seed);
  drawAccessory(s);
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
