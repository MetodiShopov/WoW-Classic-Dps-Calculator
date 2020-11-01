let character_stats = {};
let talents_chosen;
let chosen_spell;

// Mage Spell
const spells = {
    // Frostbolt Rank 10
    frostbolt_10: {
        name: 'Frostbolt R10',
        dmg: (440 + 475) / 2,
        cost: 260,
        cast_time: 3,
        add_spell_damage: function () {
            return this.dmg + (character_stats.spell_dmg * 0.814)
        }
    },
    // Frostbolt Rank 11
    frostbolt_11: {
        name: 'Frostbolt R11',
        dmg: (515 + 555) / 2,
        cost: 290,
        cast_time: 3,
        add_spell_damage: function () {
            return this.dmg + (character_stats.spell_dmg * 0.814)
        }
    },
    // Arcane Missiles Rank 7
    arcane_missiles_7: {
        name: 'Arcane Missiles R7',
        dmg: 196 * 5,
        cost: 595,
        cast_time: 5,
        add_spell_damage: function () {
            return this.dmg + character_stats.spell_dmg
        }
    },
    // Arcane Missiles Rank 8
    arcane_missiles_8: {
        name: 'Arcane Missiles R8',
        dmg: 230 * 5,
        cost: 655,
        cast_time: 5,
        add_spell_damage: function () {
            return this.dmg + character_stats.spell_dmg
        }
    },
    // Fireball Rank 11
    fireball_11: {
        name: 'Fireball R11',
        dmg: (561 + 715) / 2,
        cost: 395,
        cast_time: 3.5,
        add_spell_damage: function () {
            return this.dmg + character_stats.spell_dmg
        }
    },
    // Fireball Rank 12
    fireball_12: {
        name: 'Fireball R12',
        dmg: (596 + 760) / 2,
        cost: 410,
        cast_time: 3.5,
        add_spell_damage: function () {
            return this.dmg + character_stats.spell_dmg
        }
    },
    // Scorch Rank 7
    scorch: {
        name: 'Scorch',
        dmg: (237 + 280) / 2,
        cost: 150,
        cast_time: 1.5,
        add_spell_damage: function () {
            return this.dmg + (character_stats.spell_dmg * 0.4285)
        }
    }
}
function talent_html() {
    let selected_spec = document.getElementById("chosen_talents").value;
    let a_element = document.getElementById("talent_link");
    let form_action_script = document.getElementById("calculation_form");
    let spell_usead = document.getElementById('chosen_spell');
    switch (selected_spec) {
        case "Arc_frost":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/2300450310031531--053500030013'
            form_action_script.action = "javascript:calculate_dps('Arc_frost');";
            spell_usead.value = "frostbolt_11";
            break;
        case "Arc_fire":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/2300450310031531-5050020123';
            form_action_script.action = "javascript:calculate_dps('Arc_fire');";
            spell_usead.value = "fireball_12";
            break;
        case "Fire":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/230025030003-5050020123033151-002'
            form_action_script.action = "javascript:calculate_dps('Fire');";
            spell_usead.value = "fireball_12";
            break;
        case "Frost":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/230025030003--05350003002301351'
            form_action_script.action = "javascript:calculate_dps('Frost');";
            spell_usead.value = "frostbolt_11";
            break;
        default:
            break;
    }
}

function get_input() {
    character_stats.intellect = Number(document.getElementById('input_intellect').value);
    character_stats.spirit = Number(document.getElementById('input_spirit').value);
    character_stats.mana_per_5 = Number(document.getElementById('input_mana_per_5').value);
    character_stats.spell_dmg = Number(document.getElementById('input_spell_dmg').value);
    character_stats.hit_chance = Number(document.getElementById('input_spell_hit').value);
    character_stats.crit_chance = Number(document.getElementById('input_spell_crit').value);
    character_stats.enemy_lvl = Number(document.getElementById('enemy_lvl').value);
    talents_chosen = document.getElementById('chosen_talents').value;
    chosen_spell = document.getElementById('chosen_spell').value;
};

function create_character_stats() {
    character_stats.max_mana = (character_stats.intellect * 15) + 933;
    character_stats.in_combat_mana_regen = character_stats.mana_per_5 / 5;
    // Calculate regeneretion from Spirit
    character_stats.mana_regen_from_spirit = (13 + (character_stats.spirit / 4)) / 2;
    character_stats.out_of_combat_mana_regen_per_sec = character_stats.mana_regen_from_spirit;
    // Adding Crit chance from base and intellect
    character_stats.crit_chance += (5 + Math.round(character_stats.intellect / 59.5));
}
function calculate_dps(spec) {
    let result = document.getElementById('result');

    get_input();
    create_character_stats();

    // Using Mage Armor + Arcane Intellect
    character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.3;
    character_stats.max_mana += 31 * 15;

    if (spec === 'Arc_frost') {
        let spell_cast_time = spells[chosen_spell].cast_time;
        let spell_dmg_per_cast = spells[chosen_spell].add_spell_damage();
        let spell_cost = spells[chosen_spell].cost;
        let spell_crit_multiplier = 1.5;

        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;
        // Arcane Mind 5/5
        character_stats.max_mana += character_stats.max_mana * 0.1;

        // Frostbolt
        if (spells[chosen_spell].name === 'Frostbolt R10' || spells[chosen_spell].name === 'Frostbolt R11') {
            // Arcane Instability 3/3
            character_stats.crit_chance += 3;
            // Improved Frostbolt 5/5
            spell_cast_time -= 0.5;
            // Piercing Ice 3/3 + Arcane Instability 3/3
            spell_dmg_per_cast += spell_dmg_per_cast * 0.09;
            // Frost Chanelling 3/3 + Clearcasting 5/5
            spell_cost -= spell_cost * 0.25;
            // Elemental Precision 3/3
            character_stats.hit_chance += 6;
            // Ice Shards 5/5
            spell_crit_multiplier = 2;
        }

        // Arc Missiles
        if (spells[chosen_spell].name === 'Arcane Missiles R7' || spells[chosen_spell].name === 'Arcane Missiles R8') {
            // Arcane Focus 5/5
            character_stats.hit_chance += 6;
            // Clear Casting 5/5
            spell_cost -= spell_cost / 10;
            // Arcane Instability 3/3
            spell_dmg_per_cast += spell_dmg_per_cast * 0.03;
            character_stats.crit_chance += 3;
        }

        // Fireball
        if (spells[chosen_spell].name === 'Fireball R11' || spells[chosen_spell].name === 'Fireball R12') {
            // Clear Casting 5/5
            spell_cost -= spell_cost / 10;
            // Arcane Instability 3/3
            spell_dmg_per_cast += spell_dmg_per_cast * 0.03;
            character_stats.crit_chance += 3;
        }

        fight(spell_cast_time, Math.round(spell_dmg_per_cast), Math.round(spell_cost), spell_crit_multiplier);
    } else if (spec === "Arc_fire") {

    } else if (spec === "Fire") {

    } else if (spec === "Frost") {
        let spell_cast_time = spells[chosen_spell].cast_time;
        let spell_dmg_per_cast = spells[chosen_spell].add_spell_damage();
        let spell_cost = spells[chosen_spell].cost;
        let spell_crit_multiplier = 1.5;

        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;

        // Frostbolt
        if (spells[chosen_spell].name === 'Frostbolt R10' || spells[chosen_spell].name === 'Frostbolt R11') {
            // Improved Frostbolt 5/5
            spell_cast_time -= 0.5;
            // Elemental Precision 3/3
            character_stats.hit_chance += 6;
            // Ice Shards 5/5
            spell_crit_multiplier = 2;
            // Piercing Ice 3/3
            spell_dmg_per_cast += spell_dmg_per_cast * 0.06;
            // Frost Chanelling 3/3 + Clearcasting 5/5
            spell_cost -= spell_cost * 0.25;
            // Winter's Chill 5/5 from other player
            character_stats.crit_chance += 10;
        }

        // Fireball
        if (spells[chosen_spell].name === 'Fireball R11' || spells[chosen_spell].name === 'Fireball R12') {
            // Clear Casting 5/5
            spell_cost -= spell_cost / 10;
        }

        // Arc Missiles
        if (spells[chosen_spell].name === 'Arcane Missiles R7' || spells[chosen_spell].name === 'Arcane Missiles R8') {
            // Arcane Focus 5/5
            character_stats.hit_chance += 6;
            // Clear Casting 5/5
            spell_cost -= spell_cost / 10;
        }

        fight(spell_cast_time, Math.round(spell_dmg_per_cast), Math.round(spell_cost), spell_crit_multiplier);
    }

    function fight(cast_time, dmg, cost, crit_multiplier) {
        let time_in_seconds = 0;
        let total_dmg_done = 0;
        let character_current_mana = character_stats.max_mana;
        let mana_ruby_used = false;
        let mana_citrine_used = false;
        let mana_gem_timer = 0;
        let hit_percent = check_correct_hit_chance(character_stats.hit_chance, character_stats.enemy_lvl);
        // Decreasing Spell dmg because of hit/misses
        let spell_final_dmg = dmg * hit_percent / 100;
        // increasing Spell dmg because of Crits
        spell_final_dmg = crit_multiplier * character_stats.crit_chance + spell_final_dmg - character_stats.crit_chance;
        
        if (spec === 'Frost') {
            while (character_current_mana >= cost) {
                // Useing Mana Gems
                if (mana_ruby_used === false && character_current_mana <= character_stats.max_mana - 1200) {
                    character_current_mana += 1100;
                    mana_gem_timer = time_in_seconds;
                    mana_ruby_used = true;
                } else if (mana_gem_timer + 120 >= time_in_seconds && mana_citrine_used === false) {
                    character_current_mana += 850;
                    mana_citrine_used = true;
                }

                total_dmg_done += spell_final_dmg;
                character_current_mana -= cost;
                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time);
            }
        } else if (spec === 'Arc_frost') {
            let is_arc_power_on = false;
            let arc_power_timer = 0;

            while (character_current_mana > cost) {
                // Useing Mana Gems
                if (mana_ruby_used === false && character_current_mana <= character_stats.max_mana - 1200) {
                    character_current_mana += 1100;
                    mana_gem_timer = time_in_seconds;
                    mana_ruby_used = true;
                } else if (mana_gem_timer + 120 >= time_in_seconds && mana_citrine_used === false) {
                    character_current_mana += 850;
                    mana_citrine_used = true;
                }

                // Cast Arcane Power
                if (time_in_seconds % 180 === 0) {
                    is_arc_power_on = true;
                    arc_power_timer = 15;
                }

                // Check if Arc Power is On
                if (is_arc_power_on && arc_power_timer > 0) {
                    total_dmg_done += spell_final_dmg * 1.3;
                    character_current_mana -= cost * 1.3;
                } else {
                    total_dmg_done += spell_final_dmg;
                    character_current_mana -= cost;
                }

                arc_power_timer -= cast_time;
                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time)
            }
        } else if (spec === 'Arc_fire') {

        } else if (spec === 'Fire') {

        };

        printResult(total_dmg_done, Math.round(time_in_seconds));
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
        let hit_chance = 96 + char_hit;
        // Calc. hit chance and enemy lvl
        if (enemy_lvl === 63) {
            hit_chance -= 13;
            if (hit_chance > 99) {
                hit_chance = 99
            }
        } else {
            if (hit_chance > 99) {
                hit_chance = 99
            }
        }

        return hit_chance
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

// TODO:
// - Add Arc Power + Trinket!
// - Add FireBlast casting option
// - Add Evocation
// - Finish talants for Fire and Arc_Fire
// - Finish calculation for Fire and Arc_Fire
// - Arcane Power works only once per fight!!
// - Make a Function for Mana gem/ maybe Arc Power, Scorch debuff, Evo
// - Add Stat Weight
// - Form button Reset does not reset chosen spell correctly on different talant specs selected
// - Scorch crit multyplier on different specs