// BIS ARCANE SPEC:
// Head - Spellweaver's Turban
// Neck - Diana's Pearl Necklace
// Shoulder - Burial Shawl
// Back - Spritecaster Cape
// Chest - Robe of the Archmage
// Wrists - none
// Hands - Hands of Power
// Waist - Ban'thok Sash
// Legs - Wolfshear Leggings
// Feet - Omnicast Boots
// Ring 1 - Don Mauricio's Band of Domination
// Ring 2 - Eye of Orgrimmar
// Trinket 1 - Eye of the Beast
// Trinket 2 - Briarwood Reed
// Weapon - Witchblade
// Offhand - Tome of the Lost
// Wand - Bonecreeper Stylus

let arcane_BIS = {
    name: 'Arcane BIS',
    spirit: 40,
    stamina: 54,
    intelect: 112,
    spell_hit: 3,
    spell_dmg: 306,
    spell_crit: 4,
    mana_per_5_in_seconds: 1.7
}
console.log(arcane_BIS);

let net_bis = {
    name: 'Net BIS',
    stamina: 48,
    intelect: 95,
    spirit: 19,
    spell_dmg: 272,
    spell_hit: 2,
    spell_crit: 1,
    mana_per_5_in_seconds: 0
}
let magister_set = {
    name: 'Magister Set',
    stamina: 66,
    intelect: 167,
    spirit: 76,
    spell_dmg: 23,
    spell_hit: 0,
    spell_crit: 0,
    mana_per_5_in_seconds: 0
}
let arcanist_set = {
    name: 'Arcanist Set',
    stamina: 109,
    intelect: 160,
    spirit: 72,
    spell_dmg: 126 + 18,
    spell_hit: 1,
    spell_crit: 2,
    mana_per_5_in_seconds: 2.2
}

function fight_dps(spec, gear) {

    // Undead basic stats at lvl 60
    let intelect = 131 - 2;
    let spirit = 145 + 5;
    let spell_hit_chance = 96;
    let spell_critical_chance = 0;
    let in_combat_mana_regen = 0;
    let out_of_combat_mana_regen_per_sec = 0;
    let plus_spell_dmg = 0;

    // Adding Gear
    intelect += gear.intelect;
    spirit += gear.spirit;
    spell_hit_chance += gear.spell_hit;
    plus_spell_dmg += gear.spell_dmg;
    spell_critical_chance += gear.spell_crit;
    in_combat_mana_regen += gear.mana_per_5_in_seconds;


    let character_max_mana = intelect * 15;
    let mana_regen_from_spirit = (13 + (spirit / 4)) / 2;
    out_of_combat_mana_regen_per_sec += mana_regen_from_spirit;
    spell_critical_chance += (5 + Math.round(intelect / 59));

    // fighting Boss lvl 63
    spell_hit_chance -= 13;

    // Using Mage Armor + Arcane Intelect + Mana Ruby
    in_combat_mana_regen += out_of_combat_mana_regen_per_sec * 0.3;
    character_max_mana += 31 * 15;
    character_max_mana += 1100;

    
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

    if (spec === 'raid_arc') {
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


        // spell - Frostbolt
        let frostbolt_cast_time = 2.5;
        let frostbolt_dmg_per_cast = (429 + 463) / 2;
        frostbolt_dmg_per_cast += plus_spell_dmg * 0.814;
        let frostbolt_cost = 260;
        let frostbolt_crit_multiplier = 1.5;

        // Elemental Precision 3/3
        spell_hit_chance -= 4;
        // Ice Shards 5/5
        frostbolt_crit_multiplier = 2;
        // Piercing Ice 3/3 + Arcane Instability 3/3
        frostbolt_dmg_per_cast += frostbolt_dmg_per_cast * 0.09;
        // Frost Chanelling 3/3 + Clearcasting 5/5
        frostbolt_cost -= frostbolt_cost * 0.25;
        // Winter's Chill 5/5 from other player
        spell_critical_chance += 10;

        fight(frostbolt_cast_time, frostbolt_dmg_per_cast, frostbolt_cost, frostbolt_crit_multiplier);
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
        let character_current_mana = character_max_mana;
        let time_in_seconds = 0;
        let total_dmg = 0;

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
            while (character_current_mana > 0) {
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

        console.log(`Specialisation - ${spec.toUpperCase()} \nGear used - ${gear.name} `);
        console.log(`Total damage done: ${total_dmg} `);
        console.log(`Damage Per Second: ${Math.round(total_dmg / time_in_seconds)} `);
        console.log(`Time elapsed: ${time_in_seconds} \n`);
    }

}
fight_dps('raid_arc', arcane_BIS);


// MC Boss fights ~ 3 min
// MC Mage avrg DPS ~ 362