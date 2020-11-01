let attack_power = 262 + 122;
let weapon_dps = 73.4;
let crit_percent = 24.74;
let initial_hit = 5 + 3;
let initial_haste = 2 + 3;
let weapon_speed = 3.4;
let attacks_per_min = Math.floor(60 / weapon_speed);

let new_item_attack_power = 26-58;
let new_item_agi = 14;
let new_item_crit = 2-1;
let new_item_hit = 0;
let new_item_haste = 0;

let base_dps = calc_DPS(attack_power, weapon_dps, crit_percent, initial_hit);
// base_dps += base_dps * initial_haste / 100;
let new_item_dps = calc_DPS(attack_power + new_item_attack_power, weapon_dps, crit_percent + new_item_agi / 20 + new_item_crit, initial_hit + new_item_hit);

// let str_dps = calc_DPS(attack_power + 1 * 2, weapon_dps, crit_percent, initial_hit);
// let agi_dps = calc_DPS(attack_power, weapon_dps, (crit_percent + 1 / 20), initial_hit);
// let one_crit_dps = calc_DPS(attack_power, weapon_dps, crit_percent + 1, initial_hit);
// let one_hit_dps = calc_DPS(attack_power, weapon_dps, crit_percent, initial_hit + 1);

// function new_attribute_dps(ap, agi, crit, hit, haste) {
//     let result = calc_DPS(ap, weapon_dps, (crit_percent + agi / 20 + crit), (initial_hit + hit));
//     // result += result * (initial_haste + haste) / 100;
//     return result
// }

function calc_DPS(ap, wpn_dps, crit, hit) {
    if (hit > 9) {
        hit = 9;
    }
    let dps = (ap / 14 + wpn_dps) * 1.1;
    let res_with_miss = dps * (9 - hit) / 100;
    let crit_dmg_bonus = dps * (crit * 1.9) / 100;
    let result = dps - res_with_miss + crit_dmg_bonus;

    return result
}

console.log('Base DPS = ' + base_dps.toFixed(2));
console.log('New item DPS = ' + new_item_dps.toFixed(2));
console.log();
console.log('1 Str = ' + (calc_DPS(attack_power + 2, weapon_dps, crit_percent, initial_hit) - base_dps).toFixed(2) + ' dps');
console.log('1 Agi = ' + (calc_DPS(attack_power, weapon_dps, crit_percent + 1 / 20, initial_hit) - base_dps).toFixed(2) + ' dps');
console.log('1% Critical = ' + (calc_DPS(attack_power, weapon_dps, crit_percent + 1, initial_hit) - base_dps).toFixed(2) + ' dps');
console.log('1% Hit = ' + (calc_DPS(attack_power, weapon_dps, crit_percent, initial_hit + 1) - base_dps).toFixed(2) + ' dps');
// console.log('1% Haste = ' + (new_attribute_dps(0, 0, 0, 0, 1) - base_dps).toFixed(2));
console.log();
console.log(attacks_per_min + ' attacks per Minute, with ' + weapon_speed + ' weapon.');

// Add Storm strike in rotation
// Figure out haste