/// Lofi Yeti — 150 unique pixel-Yeti NFTs on Sui testnet.
///
/// Each index 0..149 maps 1:1 to the Lofi PFP Generator library order:
///   index = fur_idx * 25 + accessory_idx * 5 + background_idx
///   fur:        0 white, 1 blue, 2 mint, 3 pink, 4 purple, 5 gold
///   accessory:  0 none, 1 sunglasses, 2 crown, 3 headphones, 4 beanie
///   background: 0 arctic, 1 sky, 2 night, 3 carnival, 4 neon
/// Traits, rarity and image URL are derived on-chain from the index, so a
/// mint call needs no index and nobody can mint a Yeti with
/// made-up traits — or choose a specific one.
///
/// Minting is RANDOM: the chain picks one of the still-unclaimed
/// indices with Sui on-chain randomness (`sui::random::Random`, the
/// shared object at 0x8). The minter cannot pick, predict, or grind
/// for a specific Yeti, and nobody can snipe a rare one first. The
/// draw is exactly uniform over the remaining unclaimed Yetis.
///
/// Rules enforced on-chain:
///   * each index can be minted exactly once (only unclaimed indices
///     can ever be drawn)
///   * each wallet address may mint at most ONE Yeti in total
///   * minting is free — only gas (no payment, no admin, no allowlist)
///
/// Display uses Display V2 (`sui::display_registry`). After publishing,
/// the deployer calls `setup_display` once with the system
/// DisplayRegistry (0xd) and the Publisher to register the display.
module lofi_yeti::lofi_yeti;

use std::string::{Self, String};
use sui::display_registry::{Self, DisplayRegistry};
use sui::package::{Self, Publisher};
use sui::random::{Self, Random, RandomGenerator};
use sui::vec_set::{Self, VecSet};

/// One-time witness for the collection.
public struct LOFI_YETI has drop {}

/// A single unique Lofi Yeti NFT.
public struct Yeti has key, store {
    id: UID,
    index: u64,
    name: String,
    fur: String,
    accessory: String,
    background: String,
    rarity: String,
    image_url: String,
}

/// Shared registry enforcing uniqueness. Anyone can read it to see which
/// indices are claimed and how many Yetis have been minted.
/// `remaining` holds the still-unclaimed indices so each mint can draw
/// one uniformly at random in O(1) (swap-remove); `claimed` is kept
/// alongside it as the public record the frontend reads.
public struct Collection has key {
    id: UID,
    claimed: VecSet<u64>,
    minters: VecSet<address>,
    total_minted: u64,
    remaining: vector<u64>,
}

const MAX_SUPPLY: u64 = 150;

const EAlreadyClaimed: u64 = 1;
const EAlreadyMinted: u64 = 2;
const ESoldOut: u64 = 3;

fun init(witness: LOFI_YETI, ctx: &mut TxContext) {
    let publisher = package::claim(witness, ctx);
    transfer::public_transfer(publisher, ctx.sender());

    let mut remaining = vector[];
    let mut i = 0;
    while (i < MAX_SUPPLY) {
        vector::push_back(&mut remaining, i);
        i = i + 1;
    };
    let collection = Collection {
        id: object::new(ctx),
        claimed: vec_set::empty(),
        minters: vec_set::empty(),
        total_minted: 0,
        remaining,
    };
    transfer::share_object(collection);
}

/// One-time display setup (Display V2). Call once after publishing with
/// the system DisplayRegistry (0xd) and the Publisher from `init`.
/// Aborts if a display for Yeti already exists.
public fun setup_display(
    registry: &mut DisplayRegistry,
    publisher: &mut Publisher,
    ctx: &mut TxContext,
) {
    let (mut display, cap) =
        display_registry::new_with_publisher<Yeti>(registry, publisher, ctx);
    display_registry::set(&mut display, &cap, string::utf8(b"name"), string::utf8(b"{name}"));
    display_registry::set(
        &mut display,
        &cap,
        string::utf8(b"description"),
        string::utf8(b"A unique pixel Yeti from the Lofi PFP Generator. One of 150 hand-checked pixel portraits. Minted at random by the chain: each mint draws one of the remaining unclaimed Yetis, so nobody can choose or snipe a specific one."),
    );
    display_registry::set(&mut display, &cap, string::utf8(b"image_url"), string::utf8(b"{image_url}"));
    display_registry::set(&mut display, &cap, string::utf8(b"fur"), string::utf8(b"{fur}"));
    display_registry::set(&mut display, &cap, string::utf8(b"accessory"), string::utf8(b"{accessory}"));
    display_registry::set(&mut display, &cap, string::utf8(b"background"), string::utf8(b"{background}"));
    display_registry::set(&mut display, &cap, string::utf8(b"rarity"), string::utf8(b"{rarity}"));
    display_registry::set(
        &mut display,
        &cap,
        string::utf8(b"project_url"),
        string::utf8(b"https://phoenixseiya17.github.io/lofi-pfp-generator/"),
    );
    display_registry::share(display);
    transfer::public_transfer(cap, ctx.sender());
}

/// Mint a RANDOM unclaimed Yeti. Free — only gas. The chain draws
/// the index with Sui on-chain randomness, so the minter cannot pick,
/// predict, or grind for a specific Yeti. Aborts if the sender
/// already minted a Yeti (2) or the collection is sold out (3).
/// `r` is the shared Sui Random object (0x8).
public fun mint(r: &Random, collection: &mut Collection, ctx: &mut TxContext) {
    let mut g = random::new_generator(r, ctx);
    mint_with_generator(&mut g, collection, ctx)
}

fun mint_with_generator(
    g: &mut RandomGenerator,
    collection: &mut Collection,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    assert!(!collection.minters.contains(&sender), EAlreadyMinted);

    // Draw uniformly from the still-unclaimed indices: pick a random
    // position in `remaining` and swap-remove it. This is exactly
    // uniform over what is left, O(1) per mint, and terminates by
    // construction even when only one Yeti remains — an empty
    // `remaining` aborts (sold out) instead of looping forever.
    assert!(!collection.remaining.is_empty(), ESoldOut);
    let pos = random::generate_u64_in_range(g, 0, collection.remaining.length() - 1);
    let index = vector::swap_remove(&mut collection.remaining, pos);
    // Unreachable by construction (swap-remove only ever returns an
    // unclaimed index), kept as a defensive invariant.
    assert!(!collection.claimed.contains(&index), EAlreadyClaimed);

    collection.claimed.insert(index);
    collection.minters.insert(sender);
    collection.total_minted = collection.total_minted + 1;

    let fur_idx = index / 25;
    let acc_idx = (index / 5) % 5;
    let bg_idx = index % 5;

    let fur = fur_name(fur_idx);
    let accessory = accessory_name(acc_idx);
    let background = background_name(bg_idx);
    let rarity = rarity_of(fur_idx, acc_idx);

    let mut image_url = string::utf8(b"https://phoenixseiya17.github.io/lofi-pfp-generator/assets/yeti-");
    image_url.append(fur);
    image_url.append(string::utf8(b"-"));
    image_url.append(file_accessory(acc_idx));
    image_url.append(string::utf8(b"-"));
    image_url.append(file_background(bg_idx));
    image_url.append(string::utf8(b".png"));

    let mut name = string::utf8(b"Lofi Yeti #");
    let n = index + 1;
    if (n < 10) {
        name.append(string::utf8(b"00"));
    } else if (n < 100) {
        name.append(string::utf8(b"0"));
    };
    name.append(u64_to_string(n));

    let yeti = Yeti {
        id: object::new(ctx),
        index,
        name,
        fur,
        accessory,
        background,
        rarity,
        image_url,
    };
    transfer::public_transfer(yeti, sender);
}

/// Is `index` already claimed?
public fun is_claimed(collection: &Collection, index: u64): bool {
    collection.claimed.contains(&index)
}

/// Has `addr` already minted a Yeti?
public fun has_minted(collection: &Collection, addr: address): bool {
    collection.minters.contains(&addr)
}

/// How many Yetis have been minted so far?
public fun total_minted(collection: &Collection): u64 {
    collection.total_minted
}

/// Field getters for the Yeti NFT.
public fun yeti_index(y: &Yeti): u64 { y.index }
public fun yeti_name(y: &Yeti): &String { &y.name }
public fun yeti_fur(y: &Yeti): &String { &y.fur }
public fun yeti_accessory(y: &Yeti): &String { &y.accessory }
public fun yeti_background(y: &Yeti): &String { &y.background }
public fun yeti_rarity(y: &Yeti): &String { &y.rarity }
public fun yeti_image_url(y: &Yeti): &String { &y.image_url }

fun fur_name(idx: u64): String {
    if (idx == 0) string::utf8(b"white")
    else if (idx == 1) string::utf8(b"blue")
    else if (idx == 2) string::utf8(b"mint")
    else if (idx == 3) string::utf8(b"pink")
    else if (idx == 4) string::utf8(b"purple")
    else string::utf8(b"gold")
}

fun accessory_name(idx: u64): String {
    if (idx == 0) string::utf8(b"none")
    else if (idx == 1) string::utf8(b"sunglasses")
    else if (idx == 2) string::utf8(b"crown")
    else if (idx == 3) string::utf8(b"headphones")
    else string::utf8(b"beanie")
}

fun background_name(idx: u64): String {
    if (idx == 0) string::utf8(b"arctic")
    else if (idx == 1) string::utf8(b"sky")
    else if (idx == 2) string::utf8(b"night")
    else if (idx == 3) string::utf8(b"carnival")
    else string::utf8(b"neon")
}

/// Filename variants: trait "none" is "plain" in the file, "arctic" is "snow".
fun file_accessory(idx: u64): String {
    if (idx == 0) string::utf8(b"plain") else accessory_name(idx)
}

fun file_background(idx: u64): String {
    if (idx == 0) string::utf8(b"snow") else background_name(idx)
}

/// Rarity = fur score + accessory score.
/// fur: white 0, blue 0, mint 1, pink 1, purple 2, gold 3.
/// accessory: none 0, sunglasses 1, crown 2, headphones 1, beanie 1.
/// 0-1 Common, 2 Rare, 3 Epic, 4+ Legendary.
fun rarity_of(fur_idx: u64, acc_idx: u64): String {
    let fur_score: u64 = if (fur_idx == 2 || fur_idx == 3) 1
        else if (fur_idx == 4) 2
        else if (fur_idx == 5) 3
        else 0;
    let acc_score: u64 = if (acc_idx == 2) 2 else if (acc_idx == 0) 0 else 1;
    let total = fur_score + acc_score;
    if (total >= 4) string::utf8(b"Legendary")
    else if (total == 3) string::utf8(b"Epic")
    else if (total == 2) string::utf8(b"Rare")
    else string::utf8(b"Common")
}

fun u64_to_string(mut n: u64): String {
    if (n == 0) return string::utf8(b"0");
    let mut bytes = vector[];
    while (n > 0) {
        let digit = ((n % 10) as u8) + 48;
        vector::push_back(&mut bytes, digit);
        n = n / 10;
    };
    vector::reverse(&mut bytes);
    string::utf8(bytes)
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(LOFI_YETI {}, ctx);
}

/// Deterministic mint for tests: same logic as `mint`, but the random
/// draw comes from a fixed seed instead of the on-chain Random object.
#[test_only]
public fun mint_with_seed(
    collection: &mut Collection,
    seed: vector<u8>,
    ctx: &mut TxContext,
) {
    let mut g = random::new_generator_from_seed_for_testing(seed);
    mint_with_generator(&mut g, collection, ctx)
}
