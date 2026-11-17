# Lofi Yeti NFT contract (Sui testnet)

The on-chain half of the Lofi PFP Generator: 150 unique pixel-Yeti NFTs.
This folder holds the exact source code of the deployed contract, so anyone
can read it and verify it against the on-chain package.

## Deployed contract

- **Package:** `0xc56541c03a04b74a4e0450536b94a369acc6f489bd2861a997d7a96c8f5e7b70`
- **Collection (shared object):** `0x2c15cb5b07d7c089db410fa10871c6e6981be92388ac0b41825c48b562ed712d`
- **Network:** Sui testnet
- **Deploy tx:** https://suiscan.xyz/testnet/tx/BtDHTuwJxfnjumtPiVBbUvwAMjXVjUFYCtQp2SgH6ZXZ
- **View it:** https://suiscan.xyz/testnet/object/0xc56541c03a04b74a4e0450536b94a369acc6f489bd2861a997d7a96c8f5e7b70

## How it works

- `sources/lofi_yeti.move` — the contract. Index 0..149 maps 1:1 to the
  generator's portrait library (fur x accessory x background). Traits,
  rarity and image URL are derived on-chain from the index.
- Minting is **random**: the chain draws one of the still-unclaimed Yetis
  with Sui on-chain randomness (`sui::random::Random`, shared object `0x8`).
  Nobody can pick, predict, or snipe a specific Yeti.
- Rules enforced on-chain: each index mintable exactly once, each wallet at
  most one mint total, minting is free (gas only, no payment, no allowlist).
- `tests/lofi_yeti_tests.move` — 4 unit tests (valid random mint, two
  wallets get different Yetis, same wallet twice aborts, sold-out aborts).

## Build and test

```bash
cd move
sui move build
sui move test
```

The `Move.toml` pins the Sui framework to tag `testnet-v1.84.0`, the exact
commit the contract was deployed with, so a build from this folder
reproduces the deployed bytecode. The frontend (`../sui-config.js`) points
at the same package ID above — the contract is already deployed, do not
publish it again.
