// On Load set BIS before MC stats
// window.onload = function () {
//     document.getElementById('input_intelect').value = 283;
//     document.getElementById('input_spirit').value = 194;
//     document.getElementById('input_mana_per_5').value = 8;
//     document.getElementById('input_spell_dmg').value = 220;
//     document.getElementById('input_spell_hit').value = 2;
//     document.getElementById('input_spell_crit').value = 3;
// }

let character_stats = {};

// Mage Spell Info before Dire Maul
const spells = {
    // FrostBolt Rank 10
    frost_bolt: {
        name: 'Frostbolt',
        dmg: (429 + 464) / 2,
        cost: 260,
        cast_time: 3,
        add_spd: function () {
            return this.dmg + (character_stats.spell_dmg * 0.814)
        }
    },
    // Arcane Missiles Rank 7
    arcane_missiles: {
        name: 'Arcane Missiles',
        dmg: 192 * 5,
        cost: 595,
        cast_time: 5,
        add_spd: function () {
            return this.dmg + character_stats.spell_dmg
        }
    },
    // Fire Ball Rank 11
    fire_ball: {
        name: 'Fire Ball',
        dmg: (561 + 716) / 2,
        cost: 395,
        cast_time: 3.5,
        add_spd: function () {
            return this.dmg + character_stats.spell_dmg
        }
    },
    // Scorch Rank 7
    scorch: {
        name: 'Scorch',
        dmg: (233 + 276) / 2,
        cost: 150,
        cast_time: 1.5,
        add_spd: function () {
            return this.dmg + character_stats.spell_dmg
        }
    }
}

function get_input() {
    character_stats = {};
    character_stats.enemy_lvl = Number(document.getElementById('enemy_lvl').value);
    character_stats.intelect = Number(document.getElementById('input_intelect').value);
    character_stats.spirit = Number(document.getElementById('input_spirit').value);
    character_stats.mana_per_5 = Number(document.getElementById('input_mana_per_5').value);
    character_stats.spell_dmg = Number(document.getElementById('input_spell_dmg').value);
    character_stats.hit_chance = Number(document.getElementById('input_spell_hit').value);
    character_stats.crit_chance = Number(document.getElementById('input_spell_crit').value);
};

function create_character_stats() {
    character_stats.max_mana = (character_stats.intelect * 15) + 933;
    character_stats.in_combat_mana_regen = character_stats.mana_per_5 / 5;
    // Calculate regeneretion from Spirit
    character_stats.mana_regen_from_spirit = (13 + (character_stats.spirit / 4)) / 2;
    character_stats.out_of_combat_mana_regen_per_sec = character_stats.mana_regen_from_spirit;
    // Adding Crit chance from base and intelecct
    character_stats.crit_chance += (5 + Math.round(character_stats.intelect / 59.5));
}
function calculate_dps(spec) {
    get_input();
    create_character_stats();

    let result = document.getElementById('result');
    result.innerHTML = '<h3>RESULTS:</h3>';

    // Using Mage Armor + Arcane Intelect + Mana Ruby
    character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.3;
    character_stats.max_mana += 31 * 15;
    character_stats.max_mana += 1100;

    if (spec === 'raid_arc') {
        // spell - Arcane Missiles
        let spell_cast_time = 5;
        let spell_dmg_per_cast = (195 * 5);
        spell_dmg_per_cast += character_stats.spell_dmg;
        let spell_cost = 595;
        let spell_crit_multiplier = 1.5;

        // TALENTS
        // Arcane Focus 5/5
        character_stats.hit_chance += 10;
        // Clear Casting 5/5
        spell_cost = spell_cost / 2;
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;
        // Arcane Mind 5/5
        character_stats.max_mana += character_stats.max_mana * 0.1;
        // Arcane Instability 3/3
        spell_dmg_per_cast += spell_dmg_per_cast * 0.03;
        character_stats.crit_chance += 3;

        // fight(spell_cast_time, Math.round(spell_dmg_per_cast), spell_cost, spell_crit_multiplier);

        // spell - Frostbolt
        let frostbolt_cast_time = 2.5;
        let frostbolt_dmg_per_cast = (429 + 463) / 2;
        frostbolt_dmg_per_cast += character_stats.spell_dmg * 0.814;
        let frostbolt_cost = 260;
        let frostbolt_crit_multiplier = 1.5;

        // Elemental Precision 3/3
        character_stats.hit_chance -= 4;
        // Ice Shards 5/5
        frostbolt_crit_multiplier = 2;
        // Piercing Ice 3/3 + Arcane Instability 3/3
        frostbolt_dmg_per_cast += frostbolt_dmg_per_cast * 0.09;
        // Frost Chanelling 3/3 + Clearcasting 5/5
        frostbolt_cost -= frostbolt_cost * 0.25;
        // Winter's Chill 5/5 from other player
        character_stats.crit_chance += 10;

        fight(frostbolt_cast_time, Math.round(frostbolt_dmg_per_cast), frostbolt_cost, frostbolt_crit_multiplier);
    }

    // All these spec wirh with old stats input. Needs to work with: character_stats
    if (spec === 'current') {
        // Gear at lvl 40
        intelect = 206;
        spirit = 160;
        spell_hit_chance = 99;
        spell_critical_chance = (5 + Math.round(intelect / 59));
        // Mage Armor
        in_combat_mana_regen = out_of_combat_mana_regen_per_sec * 0.3;
        character_max_mana = intelect * 15;
        plus_spell_dmg = 23;

        //spell - Arcane Missiles
        let spell_cast_time = 5;
        let spell_dmg_per_cast = 119 * 5;
        let spell_cost = 410;
        let spell_crit_multiplier = 1.5;

        // TALENTS
        // Arcane Focus 2/5
        spell_hit_chance = 99;
        // Clear Casting 5/5
        spell_cost = spell_cost / 2;
        // Arcane Mind 4/5
        character_max_mana += character_max_mana * 0.08;
        // Arcane Instability 2/3
        spell_dmg_per_cast += spell_dmg_per_cast * 0.03;
        spell_critical_chance += 3;


        fight(spell_cast_time, spell_dmg_per_cast, spell_cost, spell_crit_multiplier);
    }
    // Specs at lvl 40 - Need correction
    if (spec === 'arcane') {
        // spell - Arcane Missiles
        let spell_cast_time = 5;
        let spell_dmg_per_cast = (195 * 5);
        spell_dmg_per_cast += plus_spell_dmg;
        let spell_cost = 595;
        let spell_crit_multiplier = 1.5;

        // TALENTS
        // Arcane Focus 5/5
        spell_hit_chance += 10;
        // Clear Casting 5/5
        spell_cost = spell_cost / 2;
        // Arcane Meditation 3/3
        in_combat_mana_regen += out_of_combat_mana_regen_per_sec * 0.15;
        // Arcane Mind 5/5
        character_max_mana += character_max_mana * 0.1;
        // Arcane Instability 3/3
        spell_dmg_per_cast += spell_dmg_per_cast * 0.03;
        spell_critical_chance += 3;

        fight(spell_cast_time, spell_dmg_per_cast, spell_cost, spell_crit_multiplier);
    }
    if (spec === 'fire') {
        // spell - Fireball
        let spell_cast_time = 3;
        let spell_dmg_per_cast = (561 + 715) / 2;
        spell_dmg_per_cast += plus_spell_dmg;
        let spell_cost = 395;
        let spell_crit_multiplier = 1.5;

        // spell - Scorch
        var scorch_cast_time = 1.5;
        var scorch_dmg_per_cast = (233 + 275) / 2;
        scorch_dmg_per_cast += plus_spell_dmg * 0.429;
        var scorch_cost = 150;
        var scorch_crit_multiplier = 1.5;

        //TALENTS
        // Elemental Precision 3/3
        spell_hit_chance += 6;
        // Critical Mass 3/3
        spell_critical_chance += 6;
        // Master of Elements 3/3
        spell_cost -= spell_cost * 0.3 * (spell_critical_chance / 100);
        scorch_cost -= scorch_cost * 0.3 * (spell_critical_chance / 100);
        // Fire Power 5/5 + Improved Scorch 3/3
        spell_dmg_per_cast = spell_dmg_per_cast * 1.25;
        scorch_dmg_per_cast = scorch_dmg_per_cast * 1.25;
        // Ignite 5/5
        spell_crit_multiplier = 2.1;
        scorch_crit_multiplier = 2.1;

        fight(spell_cast_time, spell_dmg_per_cast, spell_cost, spell_crit_multiplier)
    }
    if (spec === 'frost') {
        // spell - Frost Bolt
        let spell_cast_time = 2.5;
        let spell_dmg_per_cast = (437 + 473) / 2;
        spell_dmg_per_cast += plus_spell_dmg * 0.814;
        let spell_cost = 260;
        let spell_crit_multiplier = 1.5;

        // TALENTS
        // Elemental Precision 3/3
        spell_hit_chance += 6;
        // Piercing Ice 3/3
        spell_dmg_per_cast += spell_dmg_per_cast * 0.06;
        // Ice Shards 5/5
        spell_crit_multiplier = 2;
        // Frost Chanelling 3/3
        spell_cost -= spell_cost * 0.15;
        // Winter's Chill 5/5
        spell_critical_chance += 10;

        fight(spell_cast_time, spell_dmg_per_cast, spell_cost, spell_crit_multiplier);
    }

    function fight(cast_time, dmg, cost, crit_multiplier) {
        let time_in_seconds = 0;
        let total_dmg = 0;

        // Fire not working with new stats: character_stats
        if (spec === 'fire') {
            while (character_current_mana > 0) {
                let scorch_timer = 0
                if (time_in_seconds === 0) {
                    let dmg_with_hit_chance = scorch_dmg_per_cast - (scorch_dmg_per_cast * (100 - spell_hit_chance) / 100);
                    let dmg_done_per_cast = ((((100 - spell_critical_chance) * dmg_with_hit_chance) + (spell_critical_chance * (dmg_with_hit_chance * scorch_crit_multiplier))) / 100);
                    total_dmg += Math.round(dmg_done_per_cast * 5);
                    time_in_seconds += scorch_cast_time * 5;
                    character_current_mana += (in_combat_mana_regen * scorch_cast_time * 5)
                    character_current_mana -= scorch_cost * 5;
                    scorch_timer = 30;
                } else if (scorch_timer <= 5) {
                    let dmg_with_hit_chance = scorch_dmg_per_cast - (scorch_dmg_per_cast * (100 - spell_hit_chance) / 100);
                    let dmg_done_per_cast = ((((100 - spell_critical_chance) * dmg_with_hit_chance) + (spell_critical_chance * (dmg_with_hit_chance * scorch_crit_multiplier))) / 100);
                    total_dmg += Math.round(dmg_done_per_cast);
                    time_in_seconds += scorch_cast_time;
                    character_current_mana += (in_combat_mana_regen * scorch_cast_time)
                    character_current_mana -= scorch_cost;
                    scorch_timer = 30;
                } else {
                    //Calc. avarage dmage per cast with hit chance
                    let dmg_with_hit_chance = dmg - (dmg * (100 - spell_hit_chance) / 100);
                    // Adding crit chance
                    let dmg_done_per_cast = ((((100 - spell_critical_chance) * dmg_with_hit_chance) + (spell_critical_chance * (dmg_with_hit_chance * crit_multiplier))) / 100);
                    total_dmg += Math.round(dmg_done_per_cast);
                    time_in_seconds += cast_time;
                    character_current_mana += (in_combat_mana_regen * cast_time)
                    character_current_mana -= cost;
                }
            }
        } else {
            for (let i = 0; i < 500; i++) {
                let character_current_mana = character_stats.max_mana;
                while (character_current_mana > 0) {
                    let hit_percent = check_correct_hit_chance(character_stats.hit_chance, character_stats.enemy_lvl);
                    // Calculating if it Hits
                    if (successful_roll(hit_percent)) {
                        // Calculating if it Crits
                        if (successful_roll(character_stats.crit_chance)) {
                            total_dmg += dmg * crit_multiplier;
                        } else {
                            total_dmg += dmg;
                        }
                    };

                    time_in_seconds += cast_time;
                    character_current_mana += (character_stats.in_combat_mana_regen * cast_time)
                    character_current_mana -= cost;
                }
            }
        }

        printResult(total_dmg / 500, time_in_seconds / 500);
    }

    function printResult(total, seconds) {
        result.innerHTML = '<h3>RESULTS:</h3>';
        result.innerHTML += `<div class="result_box">
                            <h4>Total damage done: ${Math.round(total)}</h4>
                            <h3>Damage Per Second: ${Math.round(total / seconds)}</h3>
                            <h4>Time elapsed: ${seconds}</h4>
                            </div>`;
    };

    function check_correct_hit_chance(char_hit, enemy_lvl) {
        let num = 96 + char_hit;
        // Calc. hit chance and enemy lvl
        if (enemy_lvl === 63) {
            num -= 13;
            if (num > 99) {
                num = 99
            }
        } else {
            if (num > 99) {
                num = 99
            }
        }

        return num
    };

    function successful_roll(chance) {
        let roll = Math.floor(Math.random() * 100) + 1;

        if (roll <= chance) {
            return true
        } else {
            return false
        }
    };
}

// MC Boss fights ~ 3 min
// MC Mage avrg DPS ~ 362

// TODO:
// - Add Clear Casting
// - Add Arc Power + Trinket!
// - Spirit tick on 2 sec
// - Add FireBlast casting option
// - Random spell Dmg?
// Char Mana isnt based only on int!