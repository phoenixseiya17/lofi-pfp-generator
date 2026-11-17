/* Lofi PFP Generator — "Mint as NFT" flow (Sui testnet, no backend).
   - Reads the shared Collection object to show how many Yetis are
     minted and whether the currently shown Yeti is already claimed.
   - Connects a Sui wallet via the Wallet Standard (Slush / Sui Wallet).
   - Mints the shown Yeti with a free moveCall (gas only, testnet SUI).
   - The generator itself keeps working with zero network if this
     module fails to load (e.g. CDN offline): the NFT section just
     shows "unavailable" and filter/randomize/download are untouched.
   Uses @mysten/sui v2 via esm.sh (same SDK version used to deploy
   and verify the contract) and @mysten/wallet-standard for wallets.
   NOTE: the wallet-connect + signing path is implemented per the
   documented Wallet Standard API but could not be tested end-to-end
   in this environment (no browser wallet available here). The
   on-chain read path (claimed indicator + counter) is tested live
   against testnet. */
'use strict';

const cfg = window.LOFI_SUI || null;
const $ = (id) => document.getElementById(id);

const statusEl = $('nftStatus');
const claimedEl = $('nftClaimed');
const connectBtn = $('connectWalletBtn');
const mintBtn = $('mintBtn');
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

function render() {
  const idx = currentYetiIndex();
  const changed = idx !== currentIndex;
  currentIndex = idx;

  if (!collection) {
    setStatus('On-chain status unavailable.');
    if (claimedEl) { claimedEl.textContent = ''; claimedEl.className = 'nft-badge'; }
    if (mintBtn) mintBtn.disabled = true;
    return;
  }

  const left = cfg.maxSupply - collection.totalMinted;
  setStatus(collection.totalMinted + ' / ' + cfg.maxSupply + ' minted · ' + left + ' left');

  if (idx < 0) {
    if (claimedEl) { claimedEl.textContent = ''; claimedEl.className = 'nft-badge'; }
    if (mintBtn) mintBtn.disabled = true;
    return;
  }

  const claimed = collection.claimed.has(idx);
  const ownMinted = walletAddress ? collection.minters.has(walletAddress.toLowerCase()) : false;

  if (claimedEl) {
    if (claimed) {
      claimedEl.textContent = '✕ ALREADY CLAIMED';
      claimedEl.className = 'nft-badge claimed';
    } else {
      claimedEl.textContent = '✓ AVAILABLE TO MINT';
      claimedEl.className = 'nft-badge available';
    }
  }

  if (!mintBtn) return;
  if (minting) {
    mintBtn.disabled = true;
    mintBtn.textContent = 'MINTING…';
    return;
  }
  if (!wallet) {
    mintBtn.disabled = true;
    mintBtn.textContent = 'CONNECT WALLET TO MINT';
  } else if (ownMinted) {
    mintBtn.disabled = true;
    mintBtn.textContent = 'YOU ALREADY OWN A YETI';
  } else if (claimed) {
    mintBtn.disabled = true;
    mintBtn.textContent = 'THIS YETI IS TAKEN';
  } else {
    mintBtn.disabled = false;
    mintBtn.textContent = 'MINT THIS YETI (FREE)';
  }
  if (changed && !claimed && wallet && !ownMinted) setNote('');
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
    connectBtn.textContent = 'WALLET ' + shortAddr(walletAddress);
    connectBtn.disabled = true;
    setNote('Connected: ' + shortAddr(walletAddress) + '. You can mint one Yeti, free (testnet gas only).');
    render();
  } catch (e) {
    setNote('Could not connect wallet: ' + (e && e.message ? e.message : e));
  }
}

async function mintCurrent() {
  if (!wallet || !walletAddress || currentIndex < 0 || minting) return;
  const idx = currentIndex;
  minting = true;
  render();
  setNote('Waiting for wallet approval…');
  try {
    const signFeature = wallet.features['sui:signAndExecuteTransaction'];
    if (!signFeature) throw new Error('wallet does not support sui:signAndExecuteTransaction');
    const tx = new Transaction();
    tx.moveCall({
      target: cfg.packageId + '::' + cfg.module + '::mint',
      arguments: [tx.object(cfg.collectionId), tx.pure.u64(idx)],
    });
    tx.setSender(walletAddress);
    const res = await signFeature.signAndExecuteTransaction({
      transaction: tx,
      chain: 'sui:testnet',
    });
    const digest = res && (res.digest || (res.Transaction && res.Transaction.digest));
    if (digest) {
      setNote(
        'Minted! Lofi Yeti #' + String(idx + 1).padStart(3, '0') +
        ' is yours. <a href="https://suiscan.xyz/testnet/tx/' + digest +
        '" target="_blank" rel="noopener">View on SuiScan</a>',
      );
    } else {
      setNote('Mint submitted. Check your wallet for the transaction.');
    }
    await refreshCollection();
  } catch (e) {
    const msg = (e && e.message) || String(e);
    if (/already claimed|abort code: 1/i.test(msg)) {
      setNote('This Yeti was just claimed by someone else. Pick another one!');
    } else if (/already minted|abort code: 2/i.test(msg)) {
      setNote('This wallet already minted a Yeti. One per wallet.');
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
    if (mintBtn) mintBtn.disabled = true;
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
    if (mintBtn) mintBtn.disabled = true;
    return;
  }

  try {
    client = new SuiGrpcClient({ network: 'testnet', baseUrl: cfg.rpcUrl });
  } catch (e) {
    setStatus('NFT minting unavailable (could not reach testnet).');
    return;
  }

  if (connectBtn) connectBtn.addEventListener('click', connectWallet);
  if (mintBtn) mintBtn.addEventListener('click', mintCurrent);

  setStatus('Checking on-chain status…');
  await refreshCollection();
  // Keep the claimed indicator live as the user browses Yetis.
  setInterval(() => { if (currentYetiIndex() !== currentIndex) render(); }, 500);
  setInterval(refreshCollection, 20000);
}

init();
