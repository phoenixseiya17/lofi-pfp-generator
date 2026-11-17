# assets/ — the Yeti portrait library

150 square pixel-art portraits of Lofi the Yeti (1600×1600 PNG), all in the
same style: head-and-shoulders, big blue face, fluffy fur, bold outlines.

## What is in here

| Fur | Portraits |
|---|---|
| White | sunglasses + snow · plain + snow · beanie + sky |
| Blue | headphones + carnival · plain + sky · sunglasses + neon · crown + snow |
| Gold | crown + neon · plain + sky · headphones + carnival |
| Pink | plain + snow · sunglasses + neon · crown + carnival |
| Mint | plain + sky · beanie + snow · headphones + night |
| Purple | plain + neon · sunglasses + carnival · crown + night |

`app.js` filters this set by fur color, accessory and background. The file
names are the trait triples: `yeti-<fur>-<accessory>-<background>.png`.

## Why these PNGs are not in the GitHub repo

The repo is pushed through the GitHub web flow, which only accepts text
files, so binary PNGs cannot be committed that way. The code in this repo
references `assets/` by relative path. To run the app locally, download the
asset pack (see the main README) or regenerate the set with the prompts in
`PROMPTS.md`.
