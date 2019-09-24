let character_stats = {};

function get_input() {
    character_stats = {};
    character_stats.intelect = Number(document.getElementById('input_intellect').value);
    character_stats.spirit = Number(document.getElementById('input_spirit').value);
    character_stats.mana_per_5 = Number(document.getElementById('input_mana_per_5').value);
    character_stats.spell_dmg = Number(document.getElementById('input_spell_dmg').value);
    character_stats.hit_chance = Number(document.getElementById('input_spell_hit').value);
    character_stats.crit_chance = Number(document.getElementById('input_spell_crit').value);
    character_stats.enemy_lvl = Number(document.getElementById('enemy_lvl').value);
    character_stats.evocation_enabled = document.getElementById('input_evocation').checked;
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
        // spell - Frostbolt
        let frostbolt_cast_time = 2.5;
        let frostbolt_dmg_per_cast = (429 + 463) / 2;
        frostbolt_dmg_per_cast += character_stats.spell_dmg * 0.814;
        let frostbolt_cost = 260;
        let frostbolt_crit_multiplier = 1.5;

        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;
        // Arcane Mind 5/5
        character_stats.max_mana += character_stats.max_mana * 0.1;
        // Elemental Precision 3/3
        character_stats.hit_chance += 6;
        // Ice Shards 5/5
        frostbolt_crit_multiplier = 2;
        // Piercing Ice 3/3 + Arcane Instability 3/3
        frostbolt_dmg_per_cast += frostbolt_dmg_per_cast * 0.09;
        character_stats.crit_chance += 3;
        // Frost Chanelling 3/3 + Clearcasting 5/5
        frostbolt_cost -= frostbolt_cost * 0.25;
        // Winter's Chill 5/5 from other player
        character_stats.crit_chance += 10;

        attack_enemy(frostbolt_cast_time, Math.round(frostbolt_dmg_per_cast), frostbolt_cost, frostbolt_crit_multiplier);
    }

    function attack_enemy(cast_time, dmg, cost, crit_multiplier) {
        let hit_percent = check_correct_hit_chance(character_stats.hit_chance, character_stats.enemy_lvl);
        let time_in_seconds = 0;
        let total_dmg = 0;
        let is_arc_power_on = false;
        let arc_power_timer = 0;

        for (let i = 0; i < 500; i++) {
            let character_current_mana = character_stats.max_mana;
            let evocation_used = character_stats.evocation_enabled;
            while (character_current_mana >= cost) {
                // Cast Arcane Power
                if (time_in_seconds % 180 === 0) {
                    is_arc_power_on = true;
                    arc_power_timer = 15;
                }

                // Calculating if it Hits
                if (successful_roll(hit_percent)) {
                    // Calculating if it Crits
                    if (successful_roll(character_stats.crit_chance)) {
                        if (is_arc_power_on && arc_power_timer > 0) {
                            total_dmg += dmg * crit_multiplier * 1.3;
                            character_current_mana -= cost * 1.3;
                        } else {
                            total_dmg += dmg * crit_multiplier;
                            character_current_mana -= cost;
                        }
                    } else {
                        if (is_arc_power_on && arc_power_timer > 0) {
                            total_dmg += dmg * 1.3;
                            character_current_mana -= cost * 1.3;
                        } else {
                            total_dmg += dmg;
                            character_current_mana -= cost;
                        }
                    }
                } else {
                    character_current_mana -= cost;
                }

                arc_power_timer -= cast_time;
                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time)

                // Check if Evocation should be used
                if (character_current_mana < cost && evocation_used) {
                    // Casting Evocation
                    evocation_used = false;
                    character_current_mana = character_stats.out_of_combat_mana_regen_per_sec * 8 * 15;
                    if (character_current_mana > character_stats.max_mana) {
                        character_current_mana = character_stats.max_mana;
                    }
                    time_in_seconds += 8;
                }
            }
        }


        printResult(total_dmg / 500, Math.round(time_in_seconds / 500));
    }

    function printResult(total, seconds) {
        result.innerHTML = '<h3>RESULTS:</h3>';
        result.innerHTML += `<div class="text_box">
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