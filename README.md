# Lofi PFP Generator ❄️

**Draw a random pixel art Lofi Yeti. Free forever, no sign-up — only minters own their Yeti.**

🎬 **[Watch the demo video (4:20)](https://youtu.be/ZOI9udddGok)** — a full walkthrough, including a live
free NFT mint on Sui testnet.

🌐 **Live demo: [phoenixseiya17.github.io/lofi-pfp-generator](https://phoenixseiya17.github.io/lofi-pfp-generator/)**

An entry for the [CLAY Hackathon III](https://hackathon.lofitheyeti.com) by the Lofi Foundation (Sui Network).

![Lofi PFP Generator](logo.png)

## What it does

Hit **RANDOMIZE** to draw a surprise Yeti from a set of **150 hand-checked pixel portraits** of Lofi the
Yeti. There is nothing to pick — every draw is random. Preview is free; to own a Yeti, mint it as an NFT
on Sui testnet (random draw, one per wallet, free). The minter gets a download link for their Yeti's PNG.

Every Yeti shows its trait list with a rarity label, just like a real NFT
collection:

| Trait | Options | Rarities |
|---|---|---|
| Fur | White, Blue, Mint, Pink, Purple, Gold | Common → Legendary |
| Accessory | None, Beanie, Headphones, Sunglasses, Crown | Common → Legendary |
| Background | Arctic Snow, Gradient Sky, Starry Night, Carnival, Neon City | Common / Rare |

## Examples

| Classic | Blue + Headphones | Gold + Crown |
|---|---|---|
| White fur, sunglasses, arctic snow | Blue fur, headphones, carnival | Gold fur, crown, neon city |

## Own it as an NFT (Sui testnet)

The Yetis are real NFTs on Sui testnet — 150 total, one per wallet, free
(gas only). Minting is random: the chain draws one of the still-unclaimed
Yetis with Sui on-chain randomness, so nobody can pick, predict, or snipe
a specific one.

- **Package:** [`0xc56541c03a04b74a4e0450536b94a369acc6f489bd2861a997d7a96c8f5e7b70`](https://suiscan.xyz/testnet/object/0xc56541c03a04b74a4e0450536b94a369acc6f489bd2861a997d7a96c8f5e7b70)
- **Collection:** [`0x2c15cb5b07d7c089db410fa10871c6e6981be92388ac0b41825c48b562ed712d`](https://suiscan.xyz/testnet/object/0x2c15cb5b07d7c089db410fa10871c6e6981be92388ac0b41825c48b562ed712d)
- **Contract source:** [`move/`](move/) — the exact code that was deployed,
  with `Move.toml` and tests. Building it from `move/` reproduces the
  deployed bytecode (verified: byte-identical to the on-chain module).
- **How to mint:** open the live demo, click **CONNECT SUI WALLET**, then
  **MINT RANDOM YETI (FREE)**. Your Yeti's traits, rarity and PNG download
  appear in the success note.

## How it works

The Yetis are **real pixel-art portraits**, not drawn in code: 150 square
1600×1600 images in `assets/`, all generated in the same style as the
original preview portraits of Lofi (head-and-shoulders, big blue face,
fluffy fur, bold outlines) and each one visually checked before it entered
the set. See `assets/PROMPTS.md` for how every portrait was made.

- **Zero dependencies, zero network requests, zero API key** for the
  preview. Just static HTML, CSS, JavaScript and local images. (Minting
  talks to Sui testnet through the wallet you connect.)
- **Works offline.** Open `index.html` in any modern browser, or serve the folder with any static server:
  ```bash
  python3 -m http.server
  # then open http://localhost:8000
  ```
- **Private by design.** Nothing you make ever leaves your device, unless
  you choose to mint.

## Project structure

```
index.html   — page layout, controls, trait list
style.css    — pixel-art UI styling (no external fonts or assets)
app.js       — the portrait library, random draw, UI logic
sui-config.js — deployed package + collection IDs (Sui testnet)
sui-mint.js  — wallet connect + random mint flow
move/        — the NFT smart contract (sources, tests, Move.toml)
assets/      — 150 Yeti portraits (PNG) + PROMPTS.md + README.md
logo.png     — 512×512 PNG version of the classic Yeti (for the hackathon form)
```

## Why a PFP generator?

Lofi the Yeti is a community mascot, and every community runs on profile
pictures. This tool lets anyone draw their own unique pixel Yeti in seconds
— no design skills, no fees. And if you want to truly own the one you drew,
the random mint on Sui testnet makes it yours, one of only 150.

## License

MIT — do whatever you want with it, just keep the Lofi love.
