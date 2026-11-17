/* Lofi PFP Generator v6 — image-based, RANDOM ONLY (user decision
   17 Nov 2026: everything random, only minters own a Yeti).
   The generator shows one of 150 hand-checked AI-generated pixel
   portraits (assets/), all in the same style as the original previews:
   square head-and-shoulders pixel art, big blue face, fluffy fur,
   bold outlines. There are NO trait pickers: the only way to see a
   Yeti is RANDOMIZE, and the only way to own one is to mint it
   (random draw on Sui testnet, see sui-mint.js). The trait list and
   rarity badge just describe the Yeti currently shown.
   Zero network, zero dependencies, zero API key. */
'use strict';

/* ---------------- the library ---------------- */
/* fur: white | blue | mint | pink | purple | gold
   accessory: none | sunglasses | crown | headphones | beanie
   background: arctic | sky | night | carnival | neon */
const LIBRARY = [
  { file: 'assets/yeti-white-plain-snow.png',            fur: 'white',   accessory: 'none',       background: 'arctic' },
  { file: 'assets/yeti-white-plain-sky.png',             fur: 'white',   accessory: 'none',       background: 'sky' },
  { file: 'assets/yeti-white-plain-night.png',           fur: 'white',   accessory: 'none',       background: 'night' },
  { file: 'assets/yeti-white-plain-carnival.png',        fur: 'white',   accessory: 'none',       background: 'carnival' },
  { file: 'assets/yeti-white-plain-neon.png',            fur: 'white',   accessory: 'none',       background: 'neon' },
  { file: 'assets/yeti-white-sunglasses-snow.png',       fur: 'white',   accessory: 'sunglasses', background: 'arctic' },
  { file: 'assets/yeti-white-sunglasses-sky.png',        fur: 'white',   accessory: 'sunglasses', background: 'sky' },
  { file: 'assets/yeti-white-sunglasses-night.png',      fur: 'white',   accessory: 'sunglasses', background: 'night' },
  { file: 'assets/yeti-white-sunglasses-carnival.png',   fur: 'white',   accessory: 'sunglasses', background: 'carnival' },
  { file: 'assets/yeti-white-sunglasses-neon.png',       fur: 'white',   accessory: 'sunglasses', background: 'neon' },
  { file: 'assets/yeti-white-crown-snow.png',            fur: 'white',   accessory: 'crown',      background: 'arctic' },
  { file: 'assets/yeti-white-crown-sky.png',             fur: 'white',   accessory: 'crown',      background: 'sky' },
  { file: 'assets/yeti-white-crown-night.png',           fur: 'white',   accessory: 'crown',      background: 'night' },
  { file: 'assets/yeti-white-crown-carnival.png',        fur: 'white',   accessory: 'crown',      background: 'carnival' },
  { file: 'assets/yeti-white-crown-neon.png',            fur: 'white',   accessory: 'crown',      background: 'neon' },
  { file: 'assets/yeti-white-headphones-snow.png',       fur: 'white',   accessory: 'headphones', background: 'arctic' },
  { file: 'assets/yeti-white-headphones-sky.png',        fur: 'white',   accessory: 'headphones', background: 'sky' },
  { file: 'assets/yeti-white-headphones-night.png',      fur: 'white',   accessory: 'headphones', background: 'night' },
  { file: 'assets/yeti-white-headphones-carnival.png',   fur: 'white',   accessory: 'headphones', background: 'carnival' },
  { file: 'assets/yeti-white-headphones-neon.png',       fur: 'white',   accessory: 'headphones', background: 'neon' },
  { file: 'assets/yeti-white-beanie-snow.png',           fur: 'white',   accessory: 'beanie',     background: 'arctic' },
  { file: 'assets/yeti-white-beanie-sky.png',            fur: 'white',   accessory: 'beanie',     background: 'sky' },
  { file: 'assets/yeti-white-beanie-night.png',          fur: 'white',   accessory: 'beanie',     background: 'night' },
  { file: 'assets/yeti-white-beanie-carnival.png',       fur: 'white',   accessory: 'beanie',     background: 'carnival' },
  { file: 'assets/yeti-white-beanie-neon.png',           fur: 'white',   accessory: 'beanie',     background: 'neon' },
  { file: 'assets/yeti-blue-plain-snow.png',             fur: 'blue',    accessory: 'none',       background: 'arctic' },
  { file: 'assets/yeti-blue-plain-sky.png',              fur: 'blue',    accessory: 'none',       background: 'sky' },
  { file: 'assets/yeti-blue-plain-night.png',            fur: 'blue',    accessory: 'none',       background: 'night' },
  { file: 'assets/yeti-blue-plain-carnival.png',         fur: 'blue',    accessory: 'none',       background: 'carnival' },
  { file: 'assets/yeti-blue-plain-neon.png',             fur: 'blue',    accessory: 'none',       background: 'neon' },
  { file: 'assets/yeti-blue-sunglasses-snow.png',        fur: 'blue',    accessory: 'sunglasses', background: 'arctic' },
  { file: 'assets/yeti-blue-sunglasses-sky.png',         fur: 'blue',    accessory: 'sunglasses', background: 'sky' },
  { file: 'assets/yeti-blue-sunglasses-night.png',       fur: 'blue',    accessory: 'sunglasses', background: 'night' },
  { file: 'assets/yeti-blue-sunglasses-carnival.png',    fur: 'blue',    accessory: 'sunglasses', background: 'carnival' },
  { file: 'assets/yeti-blue-sunglasses-neon.png',        fur: 'blue',    accessory: 'sunglasses', background: 'neon' },
  { file: 'assets/yeti-blue-crown-snow.png',             fur: 'blue',    accessory: 'crown',      background: 'arctic' },
  { file: 'assets/yeti-blue-crown-sky.png',              fur: 'blue',    accessory: 'crown',      background: 'sky' },
  { file: 'assets/yeti-blue-crown-night.png',            fur: 'blue',    accessory: 'crown',      background: 'night' },
  { file: 'assets/yeti-blue-crown-carnival.png',         fur: 'blue',    accessory: 'crown',      background: 'carnival' },
  { file: 'assets/yeti-blue-crown-neon.png',             fur: 'blue',    accessory: 'crown',      background: 'neon' },
  { file: 'assets/yeti-blue-headphones-snow.png',        fur: 'blue',    accessory: 'headphones', background: 'arctic' },
  { file: 'assets/yeti-blue-headphones-sky.png',         fur: 'blue',    accessory: 'headphones', background: 'sky' },
  { file: 'assets/yeti-blue-headphones-night.png',       fur: 'blue',    accessory: 'headphones', background: 'night' },
  { file: 'assets/yeti-blue-headphones-carnival.png',    fur: 'blue',    accessory: 'headphones', background: 'carnival' },
  { file: 'assets/yeti-blue-headphones-neon.png',        fur: 'blue',    accessory: 'headphones', background: 'neon' },
  { file: 'assets/yeti-blue-beanie-snow.png',            fur: 'blue',    accessory: 'beanie',     background: 'arctic' },
  { file: 'assets/yeti-blue-beanie-sky.png',             fur: 'blue',    accessory: 'beanie',     background: 'sky' },
  { file: 'assets/yeti-blue-beanie-night.png',           fur: 'blue',    accessory: 'beanie',     background: 'night' },
  { file: 'assets/yeti-blue-beanie-carnival.png',        fur: 'blue',    accessory: 'beanie',     background: 'carnival' },
  { file: 'assets/yeti-blue-beanie-neon.png',            fur: 'blue',    accessory: 'beanie',     background: 'neon' },
  { file: 'assets/yeti-mint-plain-snow.png',             fur: 'mint',    accessory: 'none',       background: 'arctic' },
  { file: 'assets/yeti-mint-plain-sky.png',              fur: 'mint',    accessory: 'none',       background: 'sky' },
  { file: 'assets/yeti-mint-plain-night.png',            fur: 'mint',    accessory: 'none',       background: 'night' },
  { file: 'assets/yeti-mint-plain-carnival.png',         fur: 'mint',    accessory: 'none',       background: 'carnival' },
  { file: 'assets/yeti-mint-plain-neon.png',             fur: 'mint',    accessory: 'none',       background: 'neon' },
  { file: 'assets/yeti-mint-sunglasses-snow.png',        fur: 'mint',    accessory: 'sunglasses', background: 'arctic' },
  { file: 'assets/yeti-mint-sunglasses-sky.png',         fur: 'mint',    accessory: 'sunglasses', background: 'sky' },
  { file: 'assets/yeti-mint-sunglasses-night.png',       fur: 'mint',    accessory: 'sunglasses', background: 'night' },
  { file: 'assets/yeti-mint-sunglasses-carnival.png',    fur: 'mint',    accessory: 'sunglasses', background: 'carnival' },
  { file: 'assets/yeti-mint-sunglasses-neon.png',        fur: 'mint',    accessory: 'sunglasses', background: 'neon' },
  { file: 'assets/yeti-mint-crown-snow.png',             fur: 'mint',    accessory: 'crown',      background: 'arctic' },
  { file: 'assets/yeti-mint-crown-sky.png',              fur: 'mint',    accessory: 'crown',      background: 'sky' },
  { file: 'assets/yeti-mint-crown-night.png',            fur: 'mint',    accessory: 'crown',      background: 'night' },
  { file: 'assets/yeti-mint-crown-carnival.png',         fur: 'mint',    accessory: 'crown',      background: 'carnival' },
  { file: 'assets/yeti-mint-crown-neon.png',             fur: 'mint',    accessory: 'crown',      background: 'neon' },
  { file: 'assets/yeti-mint-headphones-snow.png',        fur: 'mint',    accessory: 'headphones', background: 'arctic' },
  { file: 'assets/yeti-mint-headphones-sky.png',         fur: 'mint',    accessory: 'headphones', background: 'sky' },
  { file: 'assets/yeti-mint-headphones-night.png',       fur: 'mint',    accessory: 'headphones', background: 'night' },
  { file: 'assets/yeti-mint-headphones-carnival.png',    fur: 'mint',    accessory: 'headphones', background: 'carnival' },
  { file: 'assets/yeti-mint-headphones-neon.png',        fur: 'mint',    accessory: 'headphones', background: 'neon' },
  { file: 'assets/yeti-mint-beanie-snow.png',            fur: 'mint',    accessory: 'beanie',     background: 'arctic' },
  { file: 'assets/yeti-mint-beanie-sky.png',             fur: 'mint',    accessory: 'beanie',     background: 'sky' },
  { file: 'assets/yeti-mint-beanie-night.png',           fur: 'mint',    accessory: 'beanie',     background: 'night' },
  { file: 'assets/yeti-mint-beanie-carnival.png',        fur: 'mint',    accessory: 'beanie',     background: 'carnival' },
  { file: 'assets/yeti-mint-beanie-neon.png',            fur: 'mint',    accessory: 'beanie',     background: 'neon' },
  { file: 'assets/yeti-pink-plain-snow.png',             fur: 'pink',    accessory: 'none',       background: 'arctic' },
  { file: 'assets/yeti-pink-plain-sky.png',              fur: 'pink',    accessory: 'none',       background: 'sky' },
  { file: 'assets/yeti-pink-plain-night.png',            fur: 'pink',    accessory: 'none',       background: 'night' },
  { file: 'assets/yeti-pink-plain-carnival.png',         fur: 'pink',    accessory: 'none',       background: 'carnival' },
  { file: 'assets/yeti-pink-plain-neon.png',             fur: 'pink',    accessory: 'none',       background: 'neon' },
  { file: 'assets/yeti-pink-sunglasses-snow.png',        fur: 'pink',    accessory: 'sunglasses', background: 'arctic' },
  { file: 'assets/yeti-pink-sunglasses-sky.png',         fur: 'pink',    accessory: 'sunglasses', background: 'sky' },
  { file: 'assets/yeti-pink-sunglasses-night.png',       fur: 'pink',    accessory: 'sunglasses', background: 'night' },
  { file: 'assets/yeti-pink-sunglasses-carnival.png',    fur: 'pink',    accessory: 'sunglasses', background: 'carnival' },
  { file: 'assets/yeti-pink-sunglasses-neon.png',        fur: 'pink',    accessory: 'sunglasses', background: 'neon' },
  { file: 'assets/yeti-pink-crown-snow.png',             fur: 'pink',    accessory: 'crown',      background: 'arctic' },
  { file: 'assets/yeti-pink-crown-sky.png',              fur: 'pink',    accessory: 'crown',      background: 'sky' },
  { file: 'assets/yeti-pink-crown-night.png',            fur: 'pink',    accessory: 'crown',      background: 'night' },
  { file: 'assets/yeti-pink-crown-carnival.png',         fur: 'pink',    accessory: 'crown',      background: 'carnival' },
  { file: 'assets/yeti-pink-crown-neon.png',             fur: 'pink',    accessory: 'crown',      background: 'neon' },
  { file: 'assets/yeti-pink-headphones-snow.png',        fur: 'pink',    accessory: 'headphones', background: 'arctic' },
  { file: 'assets/yeti-pink-headphones-sky.png',         fur: 'pink',    accessory: 'headphones', background: 'sky' },
  { file: 'assets/yeti-pink-headphones-night.png',       fur: 'pink',    accessory: 'headphones', background: 'night' },
  { file: 'assets/yeti-pink-headphones-carnival.png',    fur: 'pink',    accessory: 'headphones', background: 'carnival' },
  { file: 'assets/yeti-pink-headphones-neon.png',        fur: 'pink',    accessory: 'headphones', background: 'neon' },
  { file: 'assets/yeti-pink-beanie-snow.png',            fur: 'pink',    accessory: 'beanie',     background: 'arctic' },
  { file: 'assets/yeti-pink-beanie-sky.png',             fur: 'pink',    accessory: 'beanie',     background: 'sky' },
  { file: 'assets/yeti-pink-beanie-night.png',           fur: 'pink',    accessory: 'beanie',     background: 'night' },
  { file: 'assets/yeti-pink-beanie-carnival.png',        fur: 'pink',    accessory: 'beanie',     background: 'carnival' },
  { file: 'assets/yeti-pink-beanie-neon.png',            fur: 'pink',    accessory: 'beanie',     background: 'neon' },
  { file: 'assets/yeti-purple-plain-snow.png',           fur: 'purple',  accessory: 'none',       background: 'arctic' },
  { file: 'assets/yeti-purple-plain-sky.png',            fur: 'purple',  accessory: 'none',       background: 'sky' },
  { file: 'assets/yeti-purple-plain-night.png',          fur: 'purple',  accessory: 'none',       background: 'night' },
  { file: 'assets/yeti-purple-plain-carnival.png',       fur: 'purple',  accessory: 'none',       background: 'carnival' },
  { file: 'assets/yeti-purple-plain-neon.png',           fur: 'purple',  accessory: 'none',       background: 'neon' },
  { file: 'assets/yeti-purple-sunglasses-snow.png',      fur: 'purple',  accessory: 'sunglasses', background: 'arctic' },
  { file: 'assets/yeti-purple-sunglasses-sky.png',       fur: 'purple',  accessory: 'sunglasses', background: 'sky' },
  { file: 'assets/yeti-purple-sunglasses-night.png',     fur: 'purple',  accessory: 'sunglasses', background: 'night' },
  { file: 'assets/yeti-purple-sunglasses-carnival.png',  fur: 'purple',  accessory: 'sunglasses', background: 'carnival' },
  { file: 'assets/yeti-purple-sunglasses-neon.png',      fur: 'purple',  accessory: 'sunglasses', background: 'neon' },
  { file: 'assets/yeti-purple-crown-snow.png',           fur: 'purple',  accessory: 'crown',      background: 'arctic' },
  { file: 'assets/yeti-purple-crown-sky.png',            fur: 'purple',  accessory: 'crown',      background: 'sky' },
  { file: 'assets/yeti-purple-crown-night.png',          fur: 'purple',  accessory: 'crown',      background: 'night' },
  { file: 'assets/yeti-purple-crown-carnival.png',       fur: 'purple',  accessory: 'crown',      background: 'carnival' },
  { file: 'assets/yeti-purple-crown-neon.png',           fur: 'purple',  accessory: 'crown',      background: 'neon' },
  { file: 'assets/yeti-purple-headphones-snow.png',      fur: 'purple',  accessory: 'headphones', background: 'arctic' },
  { file: 'assets/yeti-purple-headphones-sky.png',       fur: 'purple',  accessory: 'headphones', background: 'sky' },
  { file: 'assets/yeti-purple-headphones-night.png',     fur: 'purple',  accessory: 'headphones', background: 'night' },
  { file: 'assets/yeti-purple-headphones-carnival.png',  fur: 'purple',  accessory: 'headphones', background: 'carnival' },
  { file: 'assets/yeti-purple-headphones-neon.png',      fur: 'purple',  accessory: 'headphones', background: 'neon' },
  { file: 'assets/yeti-purple-beanie-snow.png',          fur: 'purple',  accessory: 'beanie',     background: 'arctic' },
  { file: 'assets/yeti-purple-beanie-sky.png',           fur: 'purple',  accessory: 'beanie',     background: 'sky' },
  { file: 'assets/yeti-purple-beanie-night.png',         fur: 'purple',  accessory: 'beanie',     background: 'night' },
  { file: 'assets/yeti-purple-beanie-carnival.png',      fur: 'purple',  accessory: 'beanie',     background: 'carnival' },
  { file: 'assets/yeti-purple-beanie-neon.png',          fur: 'purple',  accessory: 'beanie',     background: 'neon' },
  { file: 'assets/yeti-gold-plain-snow.png',             fur: 'gold',    accessory: 'none',       background: 'arctic' },
  { file: 'assets/yeti-gold-plain-sky.png',              fur: 'gold',    accessory: 'none',       background: 'sky' },
  { file: 'assets/yeti-gold-plain-night.png',            fur: 'gold',    accessory: 'none',       background: 'night' },
  { file: 'assets/yeti-gold-plain-carnival.png',         fur: 'gold',    accessory: 'none',       background: 'carnival' },
  { file: 'assets/yeti-gold-plain-neon.png',             fur: 'gold',    accessory: 'none',       background: 'neon' },
  { file: 'assets/yeti-gold-sunglasses-snow.png',        fur: 'gold',    accessory: 'sunglasses', background: 'arctic' },
  { file: 'assets/yeti-gold-sunglasses-sky.png',         fur: 'gold',    accessory: 'sunglasses', background: 'sky' },
  { file: 'assets/yeti-gold-sunglasses-night.png',       fur: 'gold',    accessory: 'sunglasses', background: 'night' },
  { file: 'assets/yeti-gold-sunglasses-carnival.png',    fur: 'gold',    accessory: 'sunglasses', background: 'carnival' },
  { file: 'assets/yeti-gold-sunglasses-neon.png',        fur: 'gold',    accessory: 'sunglasses', background: 'neon' },
  { file: 'assets/yeti-gold-crown-snow.png',             fur: 'gold',    accessory: 'crown',      background: 'arctic' },
  { file: 'assets/yeti-gold-crown-sky.png',              fur: 'gold',    accessory: 'crown',      background: 'sky' },
  { file: 'assets/yeti-gold-crown-night.png',            fur: 'gold',    accessory: 'crown',      background: 'night' },
  { file: 'assets/yeti-gold-crown-carnival.png',         fur: 'gold',    accessory: 'crown',      background: 'carnival' },
  { file: 'assets/yeti-gold-crown-neon.png',             fur: 'gold',    accessory: 'crown',      background: 'neon' },
  { file: 'assets/yeti-gold-headphones-snow.png',        fur: 'gold',    accessory: 'headphones', background: 'arctic' },
  { file: 'assets/yeti-gold-headphones-sky.png',         fur: 'gold',    accessory: 'headphones', background: 'sky' },
  { file: 'assets/yeti-gold-headphones-night.png',       fur: 'gold',    accessory: 'headphones', background: 'night' },
  { file: 'assets/yeti-gold-headphones-carnival.png',    fur: 'gold',    accessory: 'headphones', background: 'carnival' },
  { file: 'assets/yeti-gold-headphones-neon.png',        fur: 'gold',    accessory: 'headphones', background: 'neon' },
  { file: 'assets/yeti-gold-beanie-snow.png',            fur: 'gold',    accessory: 'beanie',     background: 'arctic' },
  { file: 'assets/yeti-gold-beanie-sky.png',             fur: 'gold',    accessory: 'beanie',     background: 'sky' },
  { file: 'assets/yeti-gold-beanie-night.png',           fur: 'gold',    accessory: 'beanie',     background: 'night' },
  { file: 'assets/yeti-gold-beanie-carnival.png',        fur: 'gold',    accessory: 'beanie',     background: 'carnival' },
  { file: 'assets/yeti-gold-beanie-neon.png',            fur: 'gold',    accessory: 'beanie',     background: 'neon' },
];

/* ---------------- trait metadata ---------------- */
const FUR = {
  white:  { label: 'White',  swatch: '#F5F7F9', score: 0 },
  blue:   { label: 'Blue',   swatch: '#8FC3EA', score: 0 },
  mint:   { label: 'Mint',   swatch: '#A9E8C9', score: 1 },
  pink:   { label: 'Pink',   swatch: '#FFB8D4', score: 1 },
  purple: { label: 'Purple', swatch: '#C9A8F0', score: 2 },
  gold:   { label: 'Gold',   swatch: '#FFD76A', score: 3 },
};

const ACCESSORIES = {
  none:       { label: 'None',       score: 0 },
  beanie:     { label: 'Beanie',     score: 1 },
  headphones: { label: 'Headphones', score: 1 },
  sunglasses: { label: 'Sunglasses', score: 1 },
  crown:      { label: 'Crown',      score: 2 },
};

const BACKGROUNDS = {
  arctic:   { label: 'Arctic Snow',  score: 0 },
  sky:      { label: 'Gradient Sky', score: 0 },
  night:    { label: 'Starry Night', score: 0 },
  carnival: { label: 'Carnival',     score: 1 },
  neon:     { label: 'Neon City',    score: 1 },
};

/* ---------------- state ---------------- */
/* Default = the classic preview: white fur, sunglasses, arctic snow. */
const state = {
  fur: 'white',
  accessory: 'sunglasses',
  background: 'arctic',
};

let current = LIBRARY[0]; // the image currently shown

/* ---------------- matching ---------------- */
/* Score: fur 4, accessory 2, background 1. Exact = 7. Fur always wins
   over accessory+background combined, so the shown Yeti is always the
   requested fur; then same fur + accessory, then same fur + background,
   then same fur. First best in library order wins ties, so results are
   stable and deterministic. */
function pickFor(sel) {
  let best = null, bestScore = -1;
  for (const item of LIBRARY) {
    let score = 0;
    if (item.fur === sel.fur) score += 4;
    if (item.accessory === sel.accessory) score += 2;
    if (item.background === sel.background) score += 1;
    if (score > bestScore) { best = item; bestScore = score; }
  }
  return { item: best, score: bestScore, exact: bestScore === 7 };
}

function rarityOf(item) {
  const total = FUR[item.fur].score + ACCESSORIES[item.accessory].score;
  if (total >= 4) return 'Legendary';
  if (total === 3) return 'Epic';
  if (total === 2) return 'Rare';
  return 'Common';
}

/* ---------------- render ---------------- */
const img = document.getElementById('yetiImg');
const traitList = document.getElementById('traitList');
const matchNote = document.getElementById('matchNote');

function render() {
  const { item, exact } = pickFor(state);
  current = item;
  img.src = item.file;
  img.alt = 'Pixel Yeti — ' + FUR[item.fur].label + ' fur, ' +
    ACCESSORIES[item.accessory].label + ', ' + BACKGROUNDS[item.background].label;
  const num = String(LIBRARY.indexOf(item) + 1).padStart(2, '0');
  const rarity = rarityOf(item);
  const rows = [
    ['FUR', FUR[item.fur].label],
    ['ACCESSORY', ACCESSORIES[item.accessory].label],
    ['BACKGROUND', BACKGROUNDS[item.background].label],
    ['YETI', '#' + num + ' / ' + LIBRARY.length],
    ['RARITY', '<span class="badge ' + rarity + '">' + rarity.toUpperCase() + '</span>'],
  ];
  traitList.innerHTML = rows.map(([k, v]) =>
    '<div class="trait-row"><span class="trait-name">' + k + '</span>' +
    '<span class="trait-value">' + v + '</span></div>'
  ).join('');
  if (exact) {
    matchNote.textContent = '';
    matchNote.style.display = 'none';
  } else {
    const missing = [];
    if (item.accessory !== state.accessory) missing.push(ACCESSORIES[state.accessory].label);
    if (item.background !== state.background) missing.push(BACKGROUNDS[state.background].label);
    matchNote.textContent = 'Closest match — no ' + missing.join(' + ') +
      ' yeti in this set for ' + FUR[state.fur].label + ' fur yet.';
    matchNote.style.display = 'block';
  }
}

/* ---------------- UI ---------------- */
/* The ONLY way to browse: draw a random portrait from the whole
   library. No picking, no filtering — every Yeti is a surprise. */
function randomize() {
  const next = LIBRARY[Math.floor(Math.random() * LIBRARY.length)];
  state.fur = next.fur;
  state.accessory = next.accessory;
  state.background = next.background;
  render();
}

/* Show one specific library item (by index). Used by sui-mint.js to
   display the Yeti the chain just drew for the minter. */
function showIndex(idx) {
  const item = LIBRARY[Number(idx)];
  if (!item) return;
  state.fur = item.fur;
  state.accessory = item.accessory;
  state.background = item.background;
  render();
}

document.getElementById('randomizeBtn').addEventListener('click', randomize);
render();

/* Preload the rest of the library in the background so switching is instant. */
setTimeout(() => {
  for (const item of LIBRARY) {
    const pre = new Image();
    pre.src = item.file;
  }
}, 50);

/* test hooks (used by the automated verification, harmless in production) */
window.__yeti = {
  state,
  library: LIBRARY,
  current() { return current; },
  currentFile() { return current.file; },
  pickFor,
  rarityOf,
  randomize,
  showIndex,
};
