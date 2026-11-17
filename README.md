# Lofi PFP Generator ❄️

**Draw a random pixel art Lofi Yeti. Free forever, no wallet, no sign-up — only minters own their Yeti.**

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

## How it works

The Yetis are **real pixel-art portraits**, not drawn in code: 150 square
1600×1600 images in `assets/`, all generated in the same style as the
original preview portraits of Lofi (head-and-shoulders, big blue face,
fluffy fur, bold outlines) and each one visually checked before it entered
the set. Picking traits filters the set — exact match if it exists,
otherwise the closest match, same fur first. See `assets/PROMPTS.md` for
how every portrait was made.

- **Zero dependencies, zero network requests, zero API key.** Just static HTML, CSS, JavaScript and local images.
- **Works offline.** Open `index.html` in any modern browser, or serve the folder with any static server:
  ```bash
  python3 -m http.server
  # then open http://localhost:8000
  ```
- **Private by design.** Nothing you make ever leaves your device.

> **Note on the portrait files:** the 150 PNGs in `assets/` (246 MB) are not
> committed to this repo — the push flow used here only accepts text files,
> so binary images cannot be committed that way. The repo contains the full
> code plus `assets/PROMPTS.md`, so the set can be regenerated exactly.
> To run the app with the portraits, download the asset pack linked from
> the demo video description, or generate your own set with the prompts.

## Project structure

```
index.html   — page layout, controls, trait list
style.css    — pixel-art UI styling (no external fonts or assets)
app.js       — the portrait library, trait filter, UI logic
assets/      — 150 Yeti portraits (PNG) + PROMPTS.md + README.md
logo.png     — 512×512 PNG version of the classic Yeti (for the hackathon form)
```

## Why a PFP generator?

Lofi the Yeti is a community mascot, and every community runs on profile
pictures. This tool lets anyone make their own unique pixel Yeti in seconds
— no design skills, no minting, no fees. If the Lofi team ever wants to turn
the Yetis into a real collection, the trait and rarity system is already there.

## License

MIT — do whatever you want with it, just keep the Lofi love.
