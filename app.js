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
/* Hand-designed pixel sprite traced from the AI-generated pixel previews
   (pfp-previews/media-generation-lofi-pfp-pixel-*.png): a round fluffy head
   fills most of the frame, a big clean blue oval face front and center,
   modest blue ears peeking at the sides, a white beard with a V point,
   wide fur shoulders cut off at the bottom edge, blue hands at the
   bottom corners, bold black outline. Fur color is a palette swap on the
   same map (W = fur light, w = fur base, s = fur shadow); the face
   stays blue for every fur color, exactly as in the previews. */
const SPRITE = [
  "................................................................",
  "................................................................",
  "................................................................",
  ".............................KK.................................",
  ".............................KWKK...............................",
  "........................KKKKKKwWWK..KKKK........................",
  ".......................KwWWWWKKWWWKKWWWK........................",
  ".......................KsswWWWWwWWsWWwKK........................",
  "....................KKKWWWWWWWWWWWWWWWWWKKKK....................",
  "...................KWWWWWWWWWWWWWWWWWWWWWWWWK...................",
  "...................KswWWWWWWWWWWWWWWWWWWWWwsK...................",
  "..................KWWWWWWWWWWWWWWWWWWWWWWWWWWK..................",
  ".................KWWWWWWWWWWWWWWWWWWWWWWWWWWWWKK................",
  "................KWWwWWWWWWWWWWWWWWWWWWWWWWWWwWWsK...............",
  "...............KKswWWWWWWWWWWWWWWWWWWWWWWWWWWwssK...............",
  "...............KsWWWWWWwWWWWWWWWWWWWWWWWwWWWWWWsK...............",
  "...............KWWWWWsWWWwWwWWWWKWWWwWwWWWwWWWWWK...............",
  "..............KWWWWWWWwwKKKKKKKKFKKKKKKKwwwWWWWWWK..............",
  ".............KWwWWWWWwssssKFFFFFFFFFFFKssswWWWWWwWK.............",
  "..............KKWWWWWsssKKFFFFFFFFFFFFFKKsswWWWWKKK.............",
  "..............KWwWWWwssKFFFFFFFFFFFFFFFFFKssWWWwWK..............",
  ".............KwwWKKKKKKFFFFFFFFFFFFFFFFFFFKKKKKWwwK.............",
  ".............KKKWKwKKKFFFFFFFFFFFFFFFFFFFFFKKwKWKKK.............",
  "............KwwssKKKKFFFFFFFFFFFFFFFFFFFFFFFKKKwswwK............",
  "...........KFFFsswKKKFFFFFFFFFFFFFFFFFFFFFFFKKwwssFFK...........",
  "...........KFKfKWWsKFFFFFFFFFFFFFFFFFFFFFFFFKsWWsfKFK...........",
  "...........KFffFLWWKFFFFFFFFFFFFFFFFFFFFFFFFKWWWLffFK...........",
  "...........KFffLLWWKFFFFFFFFFFFFFFFFFFFFFFFFKWWsLffFK...........",
  "...........KFfKLLWWsKFFFFFFFFFFFFFFFFFFFFFFFKWWsLKfFK...........",
  "...........KfFffLWWKFFFFFFFFFFFFFFFFFFFFFFFFFKWWffFfK...........",
  "...........KfffFLWWwKFFFFFFFFFFFFFFFFFFFFFFFKWWWLfffK...........",
  "............KffFWWWWKFFFFFFFFFFFFFFFFFFFFFFFKWWWWfFK............",
  ".............KLWWWWWKFFFFFFFFFFFFFFFFFFFFFFFKWWWWWK.............",
  ".............KWWWWWWKFFFFFFFFFFFFFFFFFFFFFFFKWWWWWK.............",
  "............KWWsWWWWWKKFFFFFFFFFFFFFFFFFFKFKWWWWWWWK............",
  "............KwsWWWWWsKFFFFFFFFFFFFFFFFFFFFKKWWWWWswWK...........",
  "...........KWwWWWWWWssKFFFFFFFFFFFFFFFFFFFFKWWWWWWwWK...........",
  "............KKWsWWWWssKFFFFFFLLLLLLFFFFFFFKKWWWWsWKK............",
  ".............KwwWwWWsssKLLLLLFFFFFFLLLLLFKsKWWsWwwK.............",
  ".............KwwWWWWswssKKFFFFFFFFFFFFFKKswKWWWWwwK.............",
  ".............KKwsWWWWwKsssKKFFFFFFFFFKKssKssWWWssKK.............",
  "............KwKwsWWWWWKsssssKKKKFKKKKssssKWWWWWswKwK............",
  "..........KKssKwKwsWWWssKsssssssKsssssssswWWWswKwKssKK..........",
  ".........KsWsssKKwsWWWWwwKssssssssssssKKsWWWWwsKKsssWsK.........",
  "........KWwsWWssKwsWWWWWswKKssssssssKKwsWWWWWswKssWWwwWK........",
  "........KsWWWWssswKwwWWWWWsswwKssssswsWWWWWWsKwsssWWWWwK........",
  "........KWWWWWWWssKwKWWWWWWWsswKswssWWWWWWWswKsssWWWWWWK........",
  ".......KWWWWWWWsssssKssWWsWWWWWssWWWWWwWWwwswssswWWWWWWWK.......",
  ".......KWsWWWWWWwsssswKwWswWsWWwsWWwWWsWwKwKssswWWWWWWWWWK......",
  ".......KsWWWWWWWWWsssKsKsssWssWWWWssWsssKsKsssWWWWWWWWWsWK......",
  "......KKWWWWWWWssWssssKssssssssWWssssssssKssssWwsWWWWWWWsK......",
  "......KWWWWWWWWWsssssssssKKsssswWssssKKsssssssssWWWWWWWWWK......",
  "......KWWWWWWWWWWWssWWsssssssssssssssssssssWsKWWWWWWWWWWWKK.....",
  ".....KWWWWWWWWWWWWWsWWssssssssssssssssssssWWKWWWWWWWWWWWWWK.....",
  ".....KwWsWWWWWWsWsWsWWWsWWsssssKKsssssWWsWWWKWsWWWWWWWWsWwK.....",
  ".....KwWKKKKfKKfwKsKKWWWsWssssssssssssWsWWWKKsWwKKKfKKKKKwK.....",
  ".....KwsKLLfFKLKFKsssKWWWwsssssssssssswWWWWssssKFLKFKLLLKwK.....",
  ".....KwsKFLKFFKFFKssssKWWWWWsWssssWWWWWWWKsssssKFFKFFKfLKsK.....",
  ".....KssKKLKFFKFFKsssssKWWWWsWWssWWWWWWWKssssssKFFKFFKKLKsK.....",
  "......KwfffKFFKFFKsKsssKWWWWWWWwsWWWWWWWKsssKssKFFKFFKfKLK......",
  "......KsKfFKFFKKFKsKKssKsWWWWWWWWWWWWwWsKssKKssKFFKFFKffFK......",
  "......KKffFKFFFFfKssKKKswWWWWWWWWWWWwwwwsKKssssKKFFFKFfffK......",
  "........KfffKFFfKKssKssswwssssWWwwsssWsssssssssffFFKfffK........",
  ".........KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK........"
];

const FACE = { base: '#5E9BD6', dark: '#3F74AC', light: '#A8CBE8' };
const INK = '#14181D';
const BLUSH = '#F28BB4';
const CROWN = { gold: '#FFC93E', deep: '#D18A1B', gem: '#7B4DFF' };
const PHONE = { dark: '#232B3A', mid: '#4A5E85', light: '#7FE3FF' };
const SCARF = { base: '#2EC4B6', dark: '#1D8A80' };
const BEANIE = { base: '#E84A4A', dark: '#7A1F1F', stripe: '#FFD76A' };
const STAR = '#FFD76A';

function paintSprite(s) {
  const fur = FUR[s.fur];
  const col = { W: fur.light, w: fur.base, s: fur.shadow, F: FACE.base, f: FACE.dark, L: FACE.light, K: INK, P: BLUSH };
  for (let y = 0; y < H; y++) {
    const row = SPRITE[y];
    for (let x = 0; x < W; x++) {
      const c = col[row[x]];
      if (c) setPx(x, y, c);
    }
  }
}

function drawEyes(s) {
  const style = s.eyes;
  const centers = [[26, 27], [38, 27]];
  if (style === 'sunglasses') {
    // big black shades spanning the face, as in the classic preview
    for (const [lx, rx] of [[19, 31], [33, 45]]) {
      for (let y = 23; y <= 30; y++) {
        for (let x = lx; x <= rx; x++) {
          if (x === lx || x === rx) { if (y === 23 || y === 30) continue; }
          if (y === 30 && (x === lx || x === rx)) continue;
          setPx(x, y, '#141414');
        }
      }
    }
    setPx(32, 25, '#141414'); setPx(32, 26, '#141414');
    for (const gx of [22, 36]) {
      setPx(gx, 25, '#FFFFFF'); setPx(gx + 1, 25, '#FFFFFF');
      setPx(gx, 26, '#FFFFFF'); setPx(gx + 2, 27, '#FFFFFF');
    }
    return;
  }
  if (style === 'star') {
    for (const [cx, cy] of centers) {
      for (const [dx, dy] of [[0,-2],[-1,-1],[0,-1],[1,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,1],[1,1],[0,2]])
        setPx(cx + dx, cy + dy, STAR);
      setPx(cx - 1, cy - 2, '#FFFFFF');
    }
    return;
  }
  if (style === 'closed') {
    for (const [cx, cy] of centers) {
      for (const [dx, dy] of [[-2,-1],[-1,0],[0,0],[1,0],[2,-1]]) setPx(cx + dx, cy + dy, INK);
    }
    return;
  }
  // normal (half-closed when sleepy)
  for (const [cx, cy] of centers) {
    if (s.expression === 'sleepy') {
      for (let x = cx - 2; x <= cx + 2; x++) setPx(x, cy, INK);
      setPx(cx, cy + 1, INK);
    } else {
      for (let y = 24; y <= 29; y++) {
        for (let x = cx - 2; x <= cx + 2; x++) {
          if ((x === cx - 2 || x === cx + 2) && (y === 24 || y === 29)) continue;
          setPx(x, y, INK);
        }
      }
      setPx(cx - 1, 25, '#FFFFFF'); setPx(cx, 25, '#FFFFFF'); setPx(cx - 1, 26, '#FFFFFF');
    }
  }
}

function drawBrows(s) {
  const e = s.expression;
  const arcs = {
    happy:   [[23,24],[24,23],[25,22],[26,22],[27,23],[28,24],[36,24],[37,23],[38,22],[39,22],[40,23],[41,24]],
    sleepy:  [[23,24],[24,24],[25,24],[26,24],[27,24],[28,24],[36,24],[37,24],[38,24],[39,24],[40,24],[41,24]],
    cool:    [[22,23],[23,24],[24,24],[25,25],[26,25],[27,26],[28,26],[36,26],[37,25],[38,25],[39,24],[40,24],[41,23]],
    excited: [[23,23],[24,22],[25,21],[26,21],[27,22],[28,23],[36,23],[37,22],[38,21],[39,21],[40,22],[41,23]],
  }[e] || [];
  for (const [x, y] of arcs) setPx(x, y, INK);
}

function drawMouth(s) {
  const e = s.expression;
  if (e === 'happy') {
    for (const [x, y] of [[26,38],[27,39],[28,39],[29,40],[30,40],[31,40],[32,40],[33,40],[34,40],[35,39],[36,39],[37,39],[38,38]]) setPx(x, y, INK);
  } else if (e === 'cool') {
    line(29, 38, 36, 38, INK);
    setPx(37, 37, INK); setPx(38, 36, INK);
  } else if (e === 'sleepy') {
    rect(29, 39, 7, 1, INK);
  } else if (e === 'excited') {
    rect(27, 37, 11, 5, INK);
    for (let x = 28; x <= 36; x++) setPx(x, 37, '#FFFFFF');
    for (let x = 29; x <= 35; x++) { setPx(x, 40, BLUSH); setPx(x, 41, BLUSH); }
  }
}

/* ---------------- accessories ---------------- */
/* Positioned for the portrait sprite: crown on top of the head (as in the
   gold preview), headphones resting on the chest (as in the blue preview),
   beanie over the top of the head, scarf wrapped at the shoulders. */
function drawAccessory(s) {
  const a = s.accessory;
  if (a === 'crown') {
    for (const [cx, tip] of [[27, 1], [32, 0], [37, 1]]) spike(cx, tip, 8, 3, INK);
    for (const [cx, tip] of [[27, 2], [32, 1], [37, 2]]) spike(cx, tip, 8, 2, CROWN.gold);
    rect(24, 7, 17, 3, CROWN.gold);
    for (const gx of [28, 32, 36]) setPx(gx, 8, CROWN.gem);
    rect(24, 10, 17, 1, CROWN.deep);
  } else if (a === 'headphones') {
    // rounded cups hanging on the chest
    for (const [cx0, cy0] of [[17, 48], [40, 48]]) {
      for (let y = cy0; y <= cy0 + 8; y++) {
        for (let x = cx0; x <= cx0 + 7; x++) {
          if ((x === cx0 || x === cx0 + 7) && (y === cy0 || y === cy0 + 8)) continue;
          setPx(x, y, PHONE.dark);
        }
      }
      for (let y = cy0 + 2; y <= cy0 + 6; y++)
        for (let x = cx0 + 2; x <= cx0 + 5; x++) setPx(x, y, PHONE.mid);
      setPx(cx0 + 3, cy0 + 4, PHONE.light); setPx(cx0 + 4, cy0 + 4, PHONE.light);
      setPx(cx0 + 3, cy0 - 1, PHONE.dark); setPx(cx0 + 3, cy0 - 2, PHONE.dark);
    }
  } else if (a === 'beanie') {
    for (let y = 2; y <= 7; y++) {
      const half = 8 + (y - 2) * 2;
      for (let x = 32 - half; x <= 32 + half; x++) setPx(x, y, BEANIE.base);
    }
    rect(15, 8, 34, 3, BEANIE.dark);
    rect(15, 8, 34, 1, BEANIE.base);
    rect(15, 9, 34, 1, BEANIE.stripe);
    for (const [dx, dy] of [[0,-1],[-1,0],[0,0],[1,0],[0,1]]) setPx(32 + dx, 1 + dy, '#FFFFFF');
  } else if (a === 'scarf') {
    rect(10, 51, 44, 4, SCARF.base);
    rect(10, 54, 44, 1, SCARF.dark);
    rect(40, 55, 6, 8, SCARF.base);
    rect(40, 62, 6, 1, SCARF.dark);
  }
}

function spike(x, tipY, baseY, halfW, c) {
  for (let y = tipY; y <= baseY; y++) {
    const t = (y - tipY) / Math.max(1, baseY - tipY);
    const hw = Math.round(halfW * t);
    for (let xx = x - hw; xx <= x + hw; xx++) setPx(xx, y, c);
  }
}

/* ---------------- render ---------------- */
function render(s) {
  newGrid();
  const seed = seedFromTraits(s);
  drawBackground(s.background, seed);
  paintSprite(s);
  drawEyes(s);
  drawBrows(s);
  drawMouth(s);
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
