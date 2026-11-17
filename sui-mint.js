/* Lofi PFP Generator — "Mint as NFT" flow (Sui testnet, no backend).
   RANDOM mint: the chain picks one of the still-unclaimed Yetis with
   Sui on-chain randomness (`sui::random::Random`, shared object 0x8).
   Nobody picks a Yeti — not the user, not the app, not even by
   calling the contract directly. One mint per wallet, free (gas only).
   After the mint, the created Yeti is read back on-chain and shown
   (number, traits, rarity) in the preview.
   - Reads the shared Collection object to show how many Yetis are
     minted and whether the currently shown Yeti is already claimed.
   - Connects a Sui wallet via the Wallet Standard (Slush / Sui Wallet).
   - The generator itself is RANDOM-ONLY (no trait pickers, user
     decision 17 Nov 2026): preview is free, only minters own a Yeti,
     and the minter's PNG download lives in the post-mint note.
   - The generator itself keeps working with zero network if this
     module fails to load (e.g. CDN offline): the NFT section just
     shows "unavailable" and filter/randomize/download are untouched.
   Uses @mysten/sui v2 via esm.sh (same SDK version used to deploy
   and verify the contract) and @mysten/wallet-standard for wallets.
   NOTE: the wallet-connect + signing path is implemented per the
   documented Wallet Standard API but could not be tested end-to-end
   in this environment (no browser wallet available here). The
   on-chain read path (claimed indicator + counter) is tested live
   against testnet, and the mint transaction shape is identical to
   the successful CLI test mints (only the signer differs: wallet
   instead of test keypair). */
'use strict';

const cfg = window.LOFI_SUI || null;
const $ = (id) => document.getElementById(id);
/* The shared Sui Random object (sui::random::Random). Passed as an
   argument to the mint call; the contract draws from it. */
const RANDOM_OBJECT_ID = '0x0000000000000000000000000000000000000000000000000000000000000008';
const GRAPHQL_URL = 'https://graphql.testnet.sui.io/graphql';

const statusEl = $('nftStatus');
const claimedEl = $('nftClaimed');
const connectBtn = $('connectWalletBtn');
const noteEl = $('nftNote');

let SuiGrpcClient = null;
let Transaction = null;
let getWallets = null;
let client = null;
let collection = null; // { claimed: Set<number>, minters: Set<string>, totalMinted: number }
let wallet = null; // connected wallet-standard wallet
let walletAddress = null;
let currentIndex = -1;
let minting = false;
/* Set after a successful mint so the reveal note survives the next
   render() (the generator's internal `current` still points at the
   pre-mint Yeti until the user browses). Cleared on the next browse. */
let keepNote = false;

function setStatus(text) { if (statusEl) statusEl.textContent = text; }
function setNote(html) { if (noteEl) noteEl.innerHTML = html; }

function currentYetiIndex() {
  try {
    const yeti = window.__yeti;
    if (!yeti || typeof yeti.current !== 'function') return -1;
    return yeti.library.indexOf(yeti.current());
  } catch (_) {
    return -1;
  }
}

function shortAddr(addr) {
  return addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '';
}

const LABELS = {
  fur: { white: 'White', blue: 'Blue', mint: 'Mint', pink: 'Pink', purple: 'Purple', gold: 'Gold' },
  accessory: { none: 'None', sunglasses: 'Sunglasses', crown: 'Crown', headphones: 'Headphones', beanie: 'Beanie' },
  background: { arctic: 'Arctic Snow', sky: 'Gradient Sky', night: 'Starry Night', carnival: 'Carnival', neon: 'Neon City' },
};
function label(kind, value) {
  return (LABELS[kind] && LABELS[kind][value]) || value;
}

/* Single-button flow (user decision 17 Nov 2026): ONE button does
   everything — CONNECT SUI WALLET when disconnected, then it turns
   into MINT RANDOM YETI (FREE) once a wallet is connected. No
   separate mint button; the button's click action follows its label. */
function setActionBtn(label, enabled, accent) {
  if (!connectBtn) return;
  connectBtn.textContent = label;
  connectBtn.disabled = !enabled;
  connectBtn.classList.toggle('btn-accent', !!accent);
  connectBtn.classList.toggle('btn-primary', !accent);
}

function render() {
  const idx = currentYetiIndex();
  const changed = idx !== currentIndex;
  currentIndex = idx;

  if (!collection) {
    setStatus('On-chain status unavailable.');
    if (claimedEl) { claimedEl.textContent = ''; claimedEl.className = 'nft-badge'; }
    setActionBtn(wallet ? 'MINT RANDOM YETI (FREE)' : 'CONNECT SUI WALLET', false, !!wallet);
    return;
  }

  const left = cfg.maxSupply - collection.totalMinted;
  setStatus(collection.totalMinted + ' / ' + cfg.maxSupply + ' minted · ' + left + ' left');

  if (idx >= 0 && claimedEl) {
    if (collection.claimed.has(idx)) {
      claimedEl.textContent = '✕ ALREADY CLAIMED';
      claimedEl.className = 'nft-badge claimed';
    } else {
      claimedEl.textContent = '✓ AVAILABLE TO MINT';
      claimedEl.className = 'nft-badge available';
    }
  } else if (claimedEl) {
    claimedEl.textContent = '';
    claimedEl.className = 'nft-badge';
  }

  if (minting) {
    setActionBtn('MINTING…', false, true);
    return;
  }
  const ownMinted = walletAddress ? collection.minters.has(walletAddress.toLowerCase()) : false;
  if (!wallet) {
    setActionBtn('CONNECT SUI WALLET', true, false);
  } else if (ownMinted) {
    setActionBtn('YOU ALREADY OWN A YETI', false, false);
  } else if (collection.totalMinted >= cfg.maxSupply) {
    setActionBtn('SOLD OUT', false, false);
  } else {
    setActionBtn('MINT RANDOM YETI (FREE)', true, true);
  }
  if (changed && wallet && !ownMinted) {
    if (keepNote) { keepNote = false; } else { setNote(''); }
  }
}

async function refreshCollection() {
  if (!client) return;
  try {
    const res = await client.getObject({
      objectId: cfg.collectionId,
      include: { json: true },
    });
    const json = res && res.object && res.object.json;
    if (!json) throw new Error('empty object');
    collection = {
      claimed: new Set((json.claimed?.contents || []).map(Number)),
      minters: new Set((json.minters?.contents || []).map((a) => String(a).toLowerCase())),
      totalMinted: Number(json.total_minted || 0),
    };
  } catch (e) {
    collection = null;
    setStatus('On-chain status unavailable (network error).');
  }
  render();
}

async function connectWallet() {
  try {
    const wallets = getWallets().get();
    if (!wallets.length) {
      setNote('No Sui wallet found. Install <a href="https://slush.app" target="_blank" rel="noopener">Slush</a> (Sui Wallet) and try again.');
      return;
    }
    // Prefer Slush / Sui Wallet when several are installed.
    wallet =
      wallets.find((w) => /slush|sui wallet/i.test(w.name)) || wallets[0];
    const connect = wallet.features['standard:connect'];
    if (!connect) throw new Error('wallet does not support standard:connect');
    await connect.connect();
    const accounts = wallet.accounts || [];
    if (!accounts.length) throw new Error('wallet returned no accounts');
    walletAddress = accounts[0].address;
    setNote('Connected: ' + shortAddr(walletAddress) + '. Hit MINT RANDOM YETI (FREE) to draw your random Yeti — free (testnet gas only).');
    render();
  } catch (e) {
    setNote('Could not connect wallet: ' + (e && e.message ? e.message : e));
  }
}

/* Find the created Yeti object ID for a mint transaction.
   Tries the wallet's own response first, then the public testnet
   GraphQL indexer. Returns null when neither reveals it. */
async function findMintedYetiId(res, digest) {
  const candidates = [];
  try {
    const created = (res && res.effects && res.effects.created) || [];
    for (const c of created) {
      const id = (c && c.reference && c.reference.objectId) || (c && c.objectId);
      if (id) candidates.push(id);
    }
    const changes = (res && res.objectChanges) || [];
    for (const c of changes) {
      if (c && c.type === 'created' && c.objectId) candidates.push(c.objectId);
    }
  } catch (_) { /* fall through to GraphQL */ }
  if (digest) {
    try {
      const q = JSON.stringify({ query: `{ transaction(digest: "${digest}") { effects { effectsJson } } }` });
      for (let i = 0; i < 10; i++) {
        const gg = await fetch(GRAPHQL_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: q });
        const gj = await gg.json();
        const ej = gj && gj.data && gj.data.transaction && gj.data.transaction.effects && gj.data.transaction.effects.effectsJson;
        if (ej) {
          for (const o of ej.changedObjects || []) {
            if (o.idOperation === 'CREATED' && (o.objectType || '').indexOf('::lofi_yeti::Yeti') !== -1) {
              candidates.push(o.objectId);
            }
          }
          break;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    } catch (_) { /* GraphQL unreachable; reveal falls back to the tx link */ }
  }
  return candidates.length ? candidates[0] : null;
}

/* Show the minted Yeti in the generator preview (image + traits),
   so the minter immediately sees which one the chain drew. Drives
   the generator to it through showIndex() (random-only UI: no picker
   buttons anymore); the direct DOM update underneath is a safety net
   if showIndex is ever missing. */
function showMintedYeti(yeti) {
  try {
    const idx = Number(yeti.index);
    const item = window.__yeti && window.__yeti.library && window.__yeti.library[idx];
    if (!item) return;
    if (window.__yeti && typeof window.__yeti.showIndex === 'function') {
      window.__yeti.showIndex(idx);
    }
    const img = document.getElementById('yetiImg');
    if (img) {
      img.src = item.file;
      img.alt = 'Your pixel Yeti — ' + label('fur', item.fur) + ' fur, ' +
        label('accessory', item.accessory) + ', ' + label('background', item.background);
    }
    const rarity = window.__yeti.rarityOf(item);
    const num = String(idx + 1).padStart(2, '0');
    const traitList = document.getElementById('traitList');
    if (traitList) {
      const rows = [
        ['FUR', label('fur', item.fur)],
        ['ACCESSORY', label('accessory', item.accessory)],
        ['BACKGROUND', label('background', item.background)],
        ['YETI', '#' + num + ' / ' + window.__yeti.library.length],
        ['RARITY', '<span class="badge ' + rarity + '">' + rarity.toUpperCase() + '</span>'],
      ];
      traitList.innerHTML = rows.map(([k, v]) =>
        '<div class="trait-row"><span class="trait-name">' + k + '</span>' +
        '<span class="trait-value">' + v + '</span></div>'
      ).join('');
    }
    const matchNote = document.getElementById('matchNote');
    if (matchNote) { matchNote.textContent = ''; matchNote.style.display = 'none'; }
    currentIndex = idx;
  } catch (_) { /* preview update is best-effort; the note below still names the Yeti */ }
}

async function mintRandom() {
  if (!wallet || !walletAddress || minting) return;
  minting = true;
  render();
  setNote('Waiting for wallet approval…');
  try {
    const signFeature = wallet.features['sui:signAndExecuteTransaction'];
    if (!signFeature) throw new Error('wallet does not support sui:signAndExecuteTransaction');
    const tx = new Transaction();
    tx.moveCall({
      target: cfg.packageId + '::' + cfg.module + '::mint',
      arguments: [tx.object(RANDOM_OBJECT_ID), tx.object(cfg.collectionId)],
    });
    tx.setSender(walletAddress);
    const res = await signFeature.signAndExecuteTransaction({
      transaction: tx,
      chain: 'sui:testnet',
    });
    const digest = res && (res.digest || (res.Transaction && res.Transaction.digest));
    let revealed = null;
    if (digest) {
      const yetiId = await findMintedYetiId(res, digest);
      if (yetiId && client) {
        try {
          const obj = await client.getObject({ objectId: yetiId, include: { json: true } });
          const j = obj && obj.object && obj.object.json;
          if (j && typeof j.index !== 'undefined') revealed = j;
        } catch (_) { /* fall through to the tx-link note */ }
      }
    }
    if (revealed) {
      const n = String(Number(revealed.index) + 1).padStart(3, '0');
      showMintedYeti(revealed);
      /* Only the minter gets the PNG: a download link for THEIR Yeti
         (random-only UI has no download button anymore). */
      const lib = window.__yeti && window.__yeti.library;
      const mintedItem = lib && lib[Number(revealed.index)];
      const dl = mintedItem
        ? '<a href="' + mintedItem.file + '" download="lofi-yeti-' + n + '.png">Download your Yeti PNG</a> · '
        : '';
      setNote(
        'You minted <b>Lofi Yeti #' + n + '</b> — ' +
        label('fur', revealed.fur) + ' fur, ' + label('accessory', revealed.accessory) +
        ', ' + label('background', revealed.background) + ', <b>' +
        String(revealed.rarity).toUpperCase() + '</b>! ' + dl +
        (digest ? '<a href="https://suiscan.xyz/testnet/tx/' + digest +
          '" target="_blank" rel="noopener">View on SuiScan</a>' : ''),
      );
      keepNote = true;
    } else if (digest) {
      setNote(
        'Mint submitted! <a href="https://suiscan.xyz/testnet/tx/' + digest +
        '" target="_blank" rel="noopener">View on SuiScan</a> to see which Yeti you got.',
      );
    } else {
      setNote('Mint submitted. Check your wallet for the transaction.');
    }
    await refreshCollection();
  } catch (e) {
    const msg = (e && e.message) || String(e);
    if (/already minted|abort code: 2/i.test(msg)) {
      setNote('This wallet already minted a Yeti. One per wallet.');
    } else if (/sold out|abort code: 3/i.test(msg)) {
      setNote('All 150 Yetis are minted. Sold out!');
    } else if (/already claimed|abort code: 1/i.test(msg)) {
      setNote('Mint failed: that draw was already claimed. Try again!');
    } else {
      setNote('Mint failed: ' + msg);
    }
    await refreshCollection();
  } finally {
    minting = false;
    render();
  }
}

async function init() {
  if (!cfg || !cfg.packageId || !cfg.collectionId) {
    setStatus('NFT minting is not configured yet.');
    if (connectBtn) connectBtn.disabled = true;
    return;
  }
  try {
    const sui = await import('https://esm.sh/@mysten/sui@2/grpc');
    const txmod = await import('https://esm.sh/@mysten/sui@2/transactions');
    const ws = await import('https://esm.sh/@mysten/wallet-standard@0.21.38');
    SuiGrpcClient = sui.SuiGrpcClient;
    Transaction = txmod.Transaction;
    getWallets = ws.getWallets;
  } catch (e) {
    setStatus('NFT minting unavailable (could not load Sui SDK).');
    if (connectBtn) connectBtn.disabled = true;
    return;
  }

  try {
    client = new SuiGrpcClient({ network: 'testnet', baseUrl: cfg.rpcUrl });
  } catch (e) {
    setStatus('NFT minting unavailable (could not reach testnet).');
    return;
  }

  /* One button, action follows its label: connect first, then mint. */
  if (connectBtn) connectBtn.addEventListener('click', () => {
    if (!wallet) connectWallet();
    else mintRandom();
  });

  setStatus('Checking on-chain status…');
  await refreshCollection();
  // Keep the claimed indicator live as the user browses Yetis.
  setInterval(() => { if (currentYetiIndex() !== currentIndex) render(); }, 500);
  setInterval(refreshCollection, 20000);
}

init();
