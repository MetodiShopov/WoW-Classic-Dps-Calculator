let character_stats = {};

function get_input() {
    character_stats = {};
    character_stats.intelect = 211 + 31 + 12;
    character_stats.spirit = 190;
    character_stats.mana_per_5 = 18;
    character_stats.spell_dmg = 68;
    character_stats.hit_chance = 0;
    character_stats.crit_chance = 2;
    character_stats.enemy_lvl = 63;
};

function create_character_stats() {
    character_stats.max_mana = (character_stats.intelect * 15) + 1240;
    character_stats.in_combat_mana_regen = character_stats.mana_per_5 / 5;
    // Calculate regeneretion from Spirit
    character_stats.mana_regen_from_spirit = (15 + (character_stats.spirit / 5)) / 2;
    character_stats.out_of_combat_mana_regen_per_sec = character_stats.mana_regen_from_spirit;
    // Adding Crit chance from base and intelect
    character_stats.crit_chance += (5 + Math.round(character_stats.intelect / 59.5));
}
function calculate_dps(spec) {
    get_input();
    create_character_stats();

    // let result = document.getElementById('result');
    // result.innerHTML = '<h3>RESULTS:</h3>';

    // Using Mana Spring Totem R4
    character_stats.in_combat_mana_regen += 5;


    if (spec === 'elemental') {
        // spell - Lightning Bolt R10
        let lightning_bolt_cast_time = 3;
        let lightning_bolt_dmg_per_cast = (428 + 477) / 2;
        lightning_bolt_dmg_per_cast += character_stats.spell_dmg * 0.8571;
        let lightning_bolt_cost = 265;
        let lightning_bolt_crit_multiplier = 1.5;

        // spell - Chain Lightning
        let chain_lightning_cast_time = 2.5;
        let chain_lightning_dmg_per_cast = (505 + 564) / 2;
        chain_lightning_dmg_per_cast += character_stats.spell_dmg * 0.7142;
        let chain_lightning_cost = 605;
        let chain_lightning_crit_multiplier = 1.5;

        // TALENTS
        // Concussion 5/5
        lightning_bolt_dmg_per_cast += lightning_bolt_dmg_per_cast * 0.05;
        chain_lightning_dmg_per_cast += chain_lightning_dmg_per_cast * 0.05;
        // Convection 5/5
        lightning_bolt_cost -= lightning_bolt_cost * 0.1;
        chain_lightning_cost -= chain_lightning_cost * 0.1;
        // Elemental Focus 1/1
        lightning_bolt_cost -= lightning_bolt_cost * 0.1;
        chain_lightning_cost -= chain_lightning_cost * 0.1;
        // Call of Tuneder 5/5
        character_stats.crit_chance + 6;
        // Elemental Fury 1/1
        lightning_bolt_crit_multiplier = 2;
        chain_lightning_crit_multiplier = 2;
        // Lightning Mastery 5/5
        lightning_bolt_cast_time -= 1;
        chain_lightning_cast_time -= 1;

        // Nature's Guidance 3/3
        character_stats.hit_chance += 3;
        // Tidal Mastery 5/5
        character_stats.crit_chance += 5;

        fight(lightning_bolt_cast_time, Math.round(lightning_bolt_dmg_per_cast), lightning_bolt_cost, lightning_bolt_crit_multiplier);

        // fight(frostbolt_cast_time, Math.round(frostbolt_dmg_per_cast), frostbolt_cost, frostbolt_crit_multiplier);
    }

    function fight(cast_time, dmg, cost, crit_multiplier) {
        let hit_percent = check_correct_hit_chance(character_stats.hit_chance, character_stats.enemy_lvl);
        let elapsed_time_in_seconds = 0;
        let total_dmg = 0;
        let elemental_mastery_cd = 0;
        let mana_spring_timer = 0;
        let tranquil_air_timer = 0;
        let chain_lightning_cd = 0;
        let mana_potion_cd = 0

        for (let i = 0; i < 500; i++) {
            let character_current_mana = character_stats.max_mana;
            while (character_current_mana > 0) {
                if (character_current_mana < character_stats.max_mana - 1800 && mana_potion_cd <= 0) {
                    character_current_mana += 1800;
                    mana_potion_cd = 120;
                }
                // Cast Mana Sprint Totem
                if (mana_spring_timer <= 1.5) {
                    character_current_mana -= 75;
                    mana_spring_timer = 60;
                    mana_spring_timer -= 1.5;
                    tranquil_air_timer -= 1.5;
                    elemental_mastery_cd -= 1.5;
                    chain_lightning_cd -= 1.5;
                    mana_potion_cd -= 1.5;
                }
                // Cast Tranquil Air Totem
                if (tranquil_air_timer <= 1.5) {
                    character_current_mana -= 91;
                    tranquil_air_timer = 120;
                    tranquil_air_timer -= 1.5;
                    mana_spring_timer -= 1.5;
                    elemental_mastery_cd -= 1.5;
                    chain_lightning_cd -= 1.5;
                    mana_potion_cd -= 1.5;
                }

                // Cast Elemental Mastery
                if (elemental_mastery_cd % 360 === 0) {
                    elemental_mastery_cd = 360;

                    // Calculating if Spell Hits
                    if (successful_roll(hit_percent)) {
                        // Spell is 100% Crit
                        total_dmg += dmg * crit_multiplier;
                        character_current_mana -= cost;
                    } else {
                        character_current_mana -= cost;
                    }
                } else {
                    // Calculating if Spell Hits
                    if (successful_roll(hit_percent)) {
                        // Calculating if Spell Crits
                        if (successful_roll(character_stats.crit_chance)) {
                            total_dmg += dmg * crit_multiplier;
                            character_current_mana -= cost;
                        } else {
                            total_dmg += dmg;
                            character_current_mana -= cost;
                        }
                    } else {
                        character_current_mana -= cost;
                    }
                }

                mana_spring_timer -= cast_time;
                tranquil_air_timer -= cast_time;
                elemental_mastery_cd -= cast_time;
                chain_lightning_cd -= cast_time;
                mana_potion_cd -= cast_time;
                elapsed_time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time)
            }
        }
        printResult(total_dmg / 500, Math.round(elapsed_time_in_seconds / 500));
    }

    function printResult(total, seconds) {
        // result.innerHTML = '<h3>RESULTS:</h3>';
        // result.innerHTML += `<div class="result_box">
        //                     <h4>Total damage done: ${Math.round(total)}</h4>
        //                     <h3>Damage Per Second: ${Math.round(total / seconds)}</h3>
        //                     <h4>Time elapsed: ${seconds}</h4>
        //                     </div>`;

        console.log('RESULTS:');
        console.log('Total damage done: ' + Math.round(total));
        console.log('Damage Per Second: ' + Math.round(total / seconds));
        console.log('Time elapsed: ' + seconds);

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

calculate_dps('elemental');

// MC Boss fights ~ 3 min
// MC Mage avrg DPS ~ 362

// TODO:
// - Mana potion?
// - Implement Clear Casting mechanics?
// - Add Trinket?
// - Spirit tick on 2 sec
// - Add Frost Shock casting option
// - Random spell Dmg?