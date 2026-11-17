#[test_only]
module lofi_yeti::lofi_yeti_tests;

use lofi_yeti::lofi_yeti::{
    Self, Collection, Yeti, init_for_testing, mint_with_seed, has_minted,
    total_minted, yeti_index, yeti_name, yeti_fur, yeti_accessory, yeti_background,
    yeti_rarity,
};
use std::string;
use sui::address;
use sui::test_scenario as ts;

const A: address = @0xA;
const B: address = @0xB;

/// Distinct sender address for loop index `n` (n < 256): 0x00..00<n>
/// as a 64-char hex string, parsed by `sui::address::from_ascii_bytes`.
fun addr_of(n: u64): address {
    let hex = b"0123456789abcdef";
    let mut s = vector[];
    let mut i: u64 = 0;
    while (i < 62) {
        s.push_back(hex[0]);
        i = i + 1;
    };
    s.push_back(hex[(n >> 4) & 0xF]);
    s.push_back(hex[n & 0xF]);
    address::from_ascii_bytes(&s)
}

fun fur_of(idx: u64): vector<u8> {
    let f = idx / 25;
    if (f == 0) b"white"
    else if (f == 1) b"blue"
    else if (f == 2) b"mint"
    else if (f == 3) b"pink"
    else if (f == 4) b"purple"
    else b"gold"
}

fun accessory_of(idx: u64): vector<u8> {
    let a = (idx / 5) % 5;
    if (a == 0) b"none"
    else if (a == 1) b"sunglasses"
    else if (a == 2) b"crown"
    else if (a == 3) b"headphones"
    else b"beanie"
}

fun background_of(idx: u64): vector<u8> {
    let b = idx % 5;
    if (b == 0) b"arctic"
    else if (b == 1) b"sky"
    else if (b == 2) b"night"
    else if (b == 3) b"carnival"
    else b"neon"
}

fun rarity_of(idx: u64): vector<u8> {
    let f = idx / 25;
    let a = (idx / 5) % 5;
    let fs = if (f == 2 || f == 3) 1 else if (f == 4) 2 else if (f == 5) 3 else 0;
    let as_ = if (a == 2) 2 else if (a == 0) 0 else 1;
    let t = fs + as_;
    if (t >= 4) b"Legendary"
    else if (t == 3) b"Epic"
    else if (t == 2) b"Rare"
    else b"Common"
}

fun expected_name(idx: u64): vector<u8> {
    let n = idx + 1;
    let mut s = b"Lofi Yeti #";
    if (n < 10) s.append(b"00") else if (n < 100) s.append(b"0");
    // u64 -> decimal digits
    let mut digits = vector[];
    let mut m = n;
    while (m > 0) {
        digits.push_back(((m % 10) as u8) + 48);
        m = m / 10;
    };
    digits.reverse();
    s.append(digits);
    s
}

#[test]
fun random_mint_yields_valid_yeti_with_consistent_traits() {
    let mut scenario = ts::begin(A);
    init_for_testing(scenario.ctx());
    scenario.next_tx(A);
    let mut collection = scenario.take_shared<Collection>();
    mint_with_seed(&mut collection, b"test-seed-1", scenario.ctx());
    assert!(total_minted(&collection) == 1, 0);
    assert!(has_minted(&collection, A), 0);
    // The minted index must be claimed; read it from the Yeti below.
    ts::return_shared(collection);
    scenario.next_tx(A);
    let yeti = scenario.take_from_sender<Yeti>();
    let idx = yeti_index(&yeti);
    assert!(idx < 150, 0);
    assert!(*yeti_name(&yeti) == string::utf8(expected_name(idx)), 0);
    assert!(*yeti_fur(&yeti) == string::utf8(fur_of(idx)), 0);
    assert!(*yeti_accessory(&yeti) == string::utf8(accessory_of(idx)), 0);
    assert!(*yeti_background(&yeti) == string::utf8(background_of(idx)), 0);
    assert!(*yeti_rarity(&yeti) == string::utf8(rarity_of(idx)), 0);
    scenario.return_to_sender(yeti);
    scenario.end();
}

#[test]
fun two_wallets_get_different_yetis() {
    let mut scenario = ts::begin(A);
    init_for_testing(scenario.ctx());
    scenario.next_tx(A);
    let mut collection = scenario.take_shared<Collection>();
    mint_with_seed(&mut collection, b"seed-a", scenario.ctx());
    ts::return_shared(collection);
    scenario.next_tx(A);
    let yeti_a = scenario.take_from_sender<Yeti>();
    let idx_a = yeti_index(&yeti_a);
    scenario.return_to_sender(yeti_a);
    scenario.next_tx(B);
    let mut collection = scenario.take_shared<Collection>();
    mint_with_seed(&mut collection, b"seed-b", scenario.ctx());
    assert!(total_minted(&collection) == 2, 0);
    ts::return_shared(collection);
    scenario.next_tx(B);
    let yeti_b = scenario.take_from_sender<Yeti>();
    let idx_b = yeti_index(&yeti_b);
    assert!(idx_a != idx_b, 0);
    scenario.return_to_sender(yeti_b);
    scenario.end();
}

#[test, expected_failure(abort_code = 2)]
fun cannot_mint_twice_from_same_wallet() {
    let mut scenario = ts::begin(A);
    init_for_testing(scenario.ctx());
    scenario.next_tx(A);
    let mut collection = scenario.take_shared<Collection>();
    mint_with_seed(&mut collection, b"seed-a", scenario.ctx());
    ts::return_shared(collection);
    scenario.next_tx(A);
    let mut collection = scenario.take_shared<Collection>();
    mint_with_seed(&mut collection, b"seed-b", scenario.ctx()); // same wallet -> abort 2
    ts::return_shared(collection);
    scenario.end();
}

#[test, expected_failure(abort_code = 3)]
fun sold_out_aborts() {
    let mut scenario = ts::begin(A);
    init_for_testing(scenario.ctx());
    // Mint all 150 Yetis from 150 distinct wallets.
    let mut i = 0;
    while (i < 150) {
        scenario.next_tx(addr_of(i));
        let mut collection = scenario.take_shared<Collection>();
        mint_with_seed(&mut collection, b"loop-seed", scenario.ctx());
        ts::return_shared(collection);
        i = i + 1;
    };
    // The 151st mint, from a wallet that never minted (addr 200 is
    // outside the loop's 0..149 senders), must abort with ESoldOut (3).
    scenario.next_tx(addr_of(200));
    let mut collection = scenario.take_shared<Collection>();
    mint_with_seed(&mut collection, b"loop-seed", scenario.ctx());
    ts::return_shared(collection);
    scenario.end();
}
