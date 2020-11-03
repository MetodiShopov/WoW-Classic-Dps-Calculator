let character_stats = {};
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
            return Math.round(this.dmg + (character_stats.spell_dmg * 0.814))
        }
    },
    // Frostbolt Rank 11
    frostbolt_11: {
        name: 'Frostbolt R11',
        dmg: (515 + 555) / 2,
        cost: 290,
        cast_time: 3,
        add_spell_damage: function () {
            return Math.round(this.dmg + (character_stats.spell_dmg * 0.814))
        }
    },
    // Arcane Missiles Rank 7
    arcane_missiles_7: {
        name: 'Arcane Missiles R7',
        dmg: 196 * 5,
        cost: 595,
        cast_time: 5,
        add_spell_damage: function () {
            return Math.round(this.dmg + character_stats.spell_dmg)
        }
    },
    // Arcane Missiles Rank 8
    arcane_missiles_8: {
        name: 'Arcane Missiles R8',
        dmg: 230 * 5,
        cost: 655,
        cast_time: 5,
        add_spell_damage: function () {
            return Math.round(this.dmg + character_stats.spell_dmg)
        }
    },
    // Fireball Rank 11
    fireball_11: {
        name: 'Fireball R11',
        dmg: (561 + 715) / 2,
        cost: 395,
        cast_time: 3.5,
        add_spell_damage: function () {
            return Math.round(this.dmg + character_stats.spell_dmg)
        }
    },
    // Fireball Rank 12
    fireball_12: {
        name: 'Fireball R12',
        dmg: (596 + 760) / 2,
        cost: 410,
        cast_time: 3.5,
        add_spell_damage: function () {
            return Math.round(this.dmg + character_stats.spell_dmg)
        }
    },
    // Scorch Rank 7
    scorch: {
        name: 'Scorch',
        dmg: (237 + 280) / 2,
        cost: 150,
        cast_time: 1.5,
        add_spell_damage: function () {
            return Math.round(this.dmg + (character_stats.spell_dmg * 0.4285))
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
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/2300450310031531--053500030013';
            form_action_script.action = "javascript:calculate_dps('Arc_frost');";
            spell_usead.innerHTML = `<option value="frostbolt_11">Frostbolt R11</option><option value="frostbolt_10">Frostbolt R10</option>`;
            spell_usead.value = "frostbolt_11";
            break;
        case "Arc_fire":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/2300450310031531-5050020123-002';
            form_action_script.action = "javascript:calculate_dps('Arc_fire');";
            spell_usead.innerHTML = `<option value="fireball_12" >Fireball R12</option><option value="fireball_11" >Fireball R11</option>`
            spell_usead.value = "fireball_12";
            break;
        case "Fire":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/230025030003-5050020123033151-002';
            form_action_script.action = "javascript:calculate_dps('Fire');";
            spell_usead.innerHTML = `<option value="fireball_12" >Fireball R12</option><option value="fireball_11" >Fireball R11</option>`
            spell_usead.value = "fireball_12";
            break;
        case "Frost":
            a_element.href = 'https://classic.wowhead.com/talent-calc/mage/230025030003--05350003002301351';
            form_action_script.action = "javascript:calculate_dps('Frost');";
            spell_usead.innerHTML = `<option value="frostbolt_11">Frostbolt R11</option><option value="frostbolt_10">Frostbolt R10</option>`;
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
    character_stats.evocation_enabled = document.getElementById('input_evocation').checked;
    character_stats.chosen_spell = document.getElementById('chosen_spell').value;
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
    result.innerHTML = `<h3>RESULTS:</h3><p>Before use of Evocation:</p>`;

    get_input();
    create_character_stats();

    // Using Mage Armor + Arcane Intellect
    character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.3;
    character_stats.max_mana += 31 * 15;

    // Spell info    
    let spell_cast_time = spells[character_stats.chosen_spell].cast_time;
    let spell_dmg_per_cast = spells[character_stats.chosen_spell].add_spell_damage();
    let spell_cost = spells[character_stats.chosen_spell].cost;
    let spell_crit_multiplier = 1.5;

    if (spec === 'Arc_frost') {
        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;
        // Arcane Mind 5/5
        character_stats.max_mana += character_stats.max_mana * 0.1;

        // Frostbolt
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

        fight(spell_cast_time, Math.round(spell_dmg_per_cast), Math.round(spell_cost), spell_crit_multiplier);
    } else if (spec === "Arc_fire") {
        let scorch_spell = {};
        scorch_spell.dmg = spells.scorch.add_spell_damage();
        scorch_spell.cost = spells.scorch.cost;
        scorch_spell.cast_time = spells.scorch.cast_time;
        scorch_spell.crit_multiplier = spell_crit_multiplier;
        scorch_spell.crit_chance = character_stats.crit_chance;

        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;
        // Arcane Mind 5/5
        character_stats.max_mana += character_stats.max_mana * 0.1;

        // Fireball
        // Clear Casting 5/5
        spell_cost -= spell_cost * 0.1;
        scorch_spell.cost -= spell_cost * 0.1;
        scorch_spell.cost = Math.round(scorch_spell.cost);
        // Arcane Instability 3/3
        spell_dmg_per_cast += spell_dmg_per_cast * 0.03;
        scorch_spell.dmg += scorch_spell.dmg * 0.03;
        scorch_spell.dmg = Math.round(scorch_spell.dmg);
        character_stats.crit_chance += 3;
        scorch_spell.crit_chance += 3;
        // Improved fireball
        spell_cast_time -= 0.5;
        // Ignite
        spell_crit_multiplier = 2.1;
        scorch_spell.crit_multiplier = 2.1;
        // Incinerate
        scorch_spell.crit_chance += 4;
        // Elemental Precision 3/3
        character_stats.hit_chance += 4;

        fight(spell_cast_time, Math.round(spell_dmg_per_cast), Math.round(spell_cost), spell_crit_multiplier, scorch_spell);
    } else if (spec === "Fire") {
        let scorch_spell = {};
        scorch_spell.dmg = spells.scorch.add_spell_damage();
        scorch_spell.cost = spells.scorch.cost;
        scorch_spell.cast_time = spells.scorch.cast_time;
        scorch_spell.crit_multiplier = spell_crit_multiplier;
        scorch_spell.crit_chance = character_stats.crit_chance;

        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;

        // Fireball
        // Clear Casting 5/5
        spell_cost -= spell_cost * 0.1;
        scorch_spell.cost -= spell_cost * 0.1;
        // Improved Fireball
        spell_cast_time -= 0.5;
        // Ignite
        spell_crit_multiplier = 2.1;
        scorch_spell.crit_multiplier = 2.1;
        // Critical Mass
        character_stats.crit_chance += 6;
        scorch_spell.crit_chance += 6;
        // Incinerate
        scorch_spell.crit_chance += 4;
        // Master of Elements
        spell_cost = ((100 - character_stats.crit_chance) * spell_cost + (character_stats.crit_chance * spell_cost * 0.7)) / 100;
        scorch_spell.cost = ((100 - scorch_spell.crit_chance) * scorch_spell.cost + (scorch_spell.crit_chance * scorch_spell.cost * 0.7)) / 100;
        scorch_spell.cost = Math.round(scorch_spell.cost);
        // Fire Power
        spell_dmg_per_cast += spell_dmg_per_cast * 0.1;
        scorch_spell.dmg += scorch_spell.dmg * 0.1;
        scorch_spell.dmg = Math.round(scorch_spell.dmg);
        // Elemental Precision 3/3
        character_stats.hit_chance += 4;

        fight(spell_cast_time, Math.round(spell_dmg_per_cast), Math.round(spell_cost), spell_crit_multiplier, scorch_spell);

    } else if (spec === "Frost") {
        // TALENTS
        // Arcane Meditation 3/3
        character_stats.in_combat_mana_regen += character_stats.out_of_combat_mana_regen_per_sec * 0.15;

        // Frostbolt
        if (spells[character_stats.chosen_spell].name === 'Frostbolt R10' || spells[character_stats.chosen_spell].name === 'Frostbolt R11') {
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

        fight(spell_cast_time, Math.round(spell_dmg_per_cast), Math.round(spell_cost), spell_crit_multiplier);
    }

    function fight(cast_time, dmg, cost, crit_multiplier, scorch_obj) {
        let time_in_seconds = 0;
        let total_dmg_done = 0;
        let character_current_mana = character_stats.max_mana;
        let evocation_used = false;
        let mana_ruby_used = false;
        let mana_citrine_used = false;
        let mana_jade_used = false;
        let mana_agate_used = false;
        let mana_gem_timer = 0;
        let hit_percent = check_correct_hit_chance(character_stats.hit_chance, character_stats.enemy_lvl);
        // Decreasing Spell dmg because of hit/misses
        let spell_final_dmg = dmg * hit_percent / 100;
        // increasing Spell dmg because of Crits
        spell_final_dmg = ((100 - character_stats.crit_chance) * spell_final_dmg + (spell_final_dmg * character_stats.crit_chance * crit_multiplier)) / 100;
        spell_final_dmg = Math.round(spell_final_dmg);

        if (spec === 'Frost') {
            while (character_current_mana >= cost) {
                // Useing Mana Gems
                use_mana_gem();

                total_dmg_done += spell_final_dmg;
                character_current_mana -= cost;
                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time);
                // Check if Evocation Evocation should be used
                use_evocation()
            }
        } else if (spec === 'Arc_frost') {
            let is_arc_power_on = false;
            let arc_power_duration = 0;
            let arc_power_cd = 0;

            while (character_current_mana > cost) {
                // Useing Mana Gems
                use_mana_gem();

                // Cast Arcane Power
                if (arc_power_cd <= time_in_seconds) {
                    is_arc_power_on = true;
                    arc_power_duration = 15;
                    arc_power_cd = time_in_seconds + 180;
                }

                // Check if Arc Power is On
                if (is_arc_power_on && arc_power_duration >= cast_time) {
                    total_dmg_done += spell_final_dmg * 1.3;
                    character_current_mana -= cost * 1.3;
                    arc_power_duration -= cast_time;
                } else {
                    total_dmg_done += spell_final_dmg;
                    character_current_mana -= cost;
                    is_arc_power_on = false;
                }

                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time)
                // Check if Evocation Evocation should be used
                use_evocation()
            }
        } else if (spec === 'Arc_fire') {
            let is_arc_power_on = false;
            let arc_power_duration = 0;
            let arc_power_cd = 0;
            let scorch_debuff_time = 0;
            // Decreasing Spell dmg because of hit/misses
            let scorch_final_dmg = scorch_obj.dmg * hit_percent / 100;
            // increasing Spell dmg because of Crits
            scorch_final_dmg = ((100 - scorch_obj.crit_chance) * scorch_final_dmg + (scorch_final_dmg * scorch_obj.crit_chance * scorch_obj.crit_multiplier)) / 100;
            scorch_final_dmg = Math.round(scorch_final_dmg);

            while (character_current_mana > cost) {
                // Useing Mana Gems
                use_mana_gem();

                // Check Scorch Debuff
                if (time_in_seconds === 0) {
                    for (let i = 0; i < 5; i++) {
                        let fire_vul = i * 3 / 100;
                        total_dmg_done += scorch_final_dmg * (1 + fire_vul);
                        character_current_mana -= scorch_obj.cost;
                        time_in_seconds += scorch_obj.cast_time;
                        scorch_debuff_time = 30;
                    }
                } else if (scorch_debuff_time < 5) {
                    total_dmg_done += scorch_final_dmg * 1.15;
                    character_current_mana -= scorch_obj.cost;
                    time_in_seconds += scorch_obj.cast_time;
                    scorch_debuff_time = 30;
                    continue
                }

                // Cast Arcane Power
                if (arc_power_cd <= time_in_seconds && scorch_debuff_time >= 17) {
                    is_arc_power_on = true;
                    arc_power_duration = 15;
                    arc_power_cd = time_in_seconds + 180;
                }

                // Check if Arc Power is On
                if (is_arc_power_on && arc_power_duration >= cast_time) {
                    total_dmg_done += spell_final_dmg * 1.3 * 1.15;
                    character_current_mana -= cost * 1.3;
                    arc_power_duration -= cast_time;
                } else {
                    total_dmg_done += spell_final_dmg * 1.15;
                    character_current_mana -= cost;
                    is_arc_power_on = false;
                }

                scorch_debuff_time -= cast_time;
                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time)
                // Check if Evocation Evocation should be used
                use_evocation()
            }
        } else if (spec === 'Fire') {
            let combustion_cd = 0;
            let scorch_debuff_time = 0;
            // Decreasing Spell dmg because of hit/misses
            let scorch_final_dmg = scorch_obj.dmg * hit_percent / 100;
            // increasing Spell dmg because of Crits
            scorch_final_dmg = ((100 - scorch_obj.crit_chance) * scorch_final_dmg + (scorch_final_dmg * scorch_obj.crit_chance * scorch_obj.crit_multiplier)) / 100;
            scorch_final_dmg = Math.round(scorch_final_dmg);

            while (character_current_mana > cost) {
                // Useing Mana Gems
                use_mana_gem();

                // Check Scorch Debuff
                if (time_in_seconds === 0) {
                    for (let i = 0; i < 5; i++) {
                        let fire_vul = i * 3 / 100;
                        total_dmg_done += scorch_final_dmg * (1 + fire_vul);
                        character_current_mana -= scorch_obj.cost;
                        time_in_seconds += scorch_obj.cast_time;
                        scorch_debuff_time = 30;
                    }
                } else if (scorch_debuff_time < 5) {
                    total_dmg_done += scorch_final_dmg * 1.15;
                    character_current_mana -= scorch_obj.cost;
                    time_in_seconds += scorch_obj.cast_time;
                    scorch_debuff_time = 30;
                    continue
                }
                
                // Use Combustion
                if (scorch_debuff_time >= 24 && combustion_cd <= time_in_seconds) {
                    // Decreasing Spell dmg because of hit/misses
                    let critical_fireball = dmg * hit_percent / 100;
                    // Dmg = 3 x critical hits
                    critical_fireball = critical_fireball * crit_multiplier;
                    
                    total_dmg_done += critical_fireball * 1.15 * 3;
                    character_current_mana -= cost * 3;
                    scorch_debuff_time -= cast_time * 3;
                    time_in_seconds += cast_time * 3;
                    character_current_mana += (character_stats.in_combat_mana_regen * cast_time * 3);
                    combustion_cd = 180 + time_in_seconds;
                    continue
                }

                
                total_dmg_done += spell_final_dmg * 1.15;
                character_current_mana -= cost;
                scorch_debuff_time -= cast_time;
                time_in_seconds += cast_time;
                character_current_mana += (character_stats.in_combat_mana_regen * cast_time);
                // Check if Evocation Evocation should be used
                use_evocation()
            }

        };

        printResult(total_dmg_done, Math.round(time_in_seconds));

        function use_mana_gem() {
            if (mana_ruby_used === false && character_current_mana <= character_stats.max_mana - 1200) {
                character_current_mana += 1100;
                mana_gem_timer = time_in_seconds + 120;
                mana_ruby_used = true;
            } else if (mana_gem_timer <= time_in_seconds && mana_citrine_used === false && mana_ruby_used === true && character_current_mana <= character_stats.max_mana - 850) {
                character_current_mana += 850;
                mana_gem_timer = time_in_seconds + 120;
                mana_citrine_used = true;
            } else if (mana_gem_timer <= time_in_seconds && mana_jade_used === false && mana_citrine_used === true && character_current_mana <= character_stats.max_mana - 600) {
                character_current_mana += 600;
                mana_gem_timer = time_in_seconds + 120;
                mana_jade_used = true;
            } else if (mana_gem_timer <= time_in_seconds && mana_agate_used === false && mana_jade_used === true && character_current_mana <= character_stats.max_mana - 400) {
                character_current_mana += 400;
                mana_agate_used = true;
            }
        };

        function use_evocation() {
            if (character_stats.evocation_enabled && character_current_mana < cost && evocation_used == false) {
                printResult(total_dmg_done, Math.round(time_in_seconds));
                evocation_used = true;
                character_current_mana += character_stats.out_of_combat_mana_regen_per_sec * 15 * 8;
                character_current_mana += character_stats.mana_per_5 / 5 * 8;
                time_in_seconds += 8;
                result.innerHTML += `<p>Evocation used at: ${Math.round(time_in_seconds)}</p>`;
                result.innerHTML += `<p>With use of Evocation:</p>`;
            }
        }
    }

    function printResult(total, seconds) {
        result.innerHTML += `<div class="result_box">
                            <p>Damage done: ${Math.round(total)}</p>
                            <p>DPS: ${Math.round(total / seconds)}</p>
                            <p>Time elapsed: ${seconds}</p>
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
// - Add Stat Weight

// Bugs
// - Form button Reset does not reset chosen spell correctly on different talant specs selected
// - Reset button does not reset result text