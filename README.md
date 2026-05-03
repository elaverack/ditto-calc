# DittoCalc

DittoCalc is a specialized [Pokémon Showdown damage calculator](https://github.com/smogon/damage-calc) fork for **Pokemon Champions**. It keeps the full damage engine but changes the **defender model** and adds **bulk ratings** so you can compare any two Pokemon's defenses and offenses on a consistent scale.

## Why it exists

In standard one-vs-one calcs you pick both the attacker and the defender and look at damage as a percentage of HP in a specific situation. I believe that game sense would develop more quickly if players had an independent metric of both damage and defense.

DittoCalc fixes the defender as a **typeless untrained Ditto** so damage numbers are on the same scale no matter the Pokemon, move, or spread.  **Physical Bulk** and **Special Bulk** are derived as single numbers from standardized hits everyone is measured against. It removes the difficulty in comparing the defensive capabilities between Pokemon with wildly different HP, SpDef, and Def stats.

The physical and special bulk values are tuned to be equivalent to Ditto HP, so damage calculations become a subtraction of one Pokemon's damage output in DittoHP (DittoDamage) from another's bulk, also in Ditto HP. Type matchups and additional factors must be accounted for by the player.

## How bulk calculation works

Bulk is **not** a simple calculation like HP × Defense. It is a scaled value in **“Ditto HP units”**. The logic for its calculation is as follows.

1. **Set Up Standard Attacker**  

   The calc builds a synthetic **Ditto** attacker that uses a neutral nature, no training and no item. Ditto is a convenient Pokemon for this as it has equal offensive and defensive stats both Physical and Special.

   Coding Quirk: the dummy’s typings replace `???` with Normal so the engine does not apply STAB on `???` moves (otherwise bulk would be understated by about 1.5×).

2. **Attack the Target**

    The attacking Ditto fires two calibration moves: 999 base power, type `???`, one Special (Thunderbolt-shaped) and one Physical (Body Slam-shaped). Type `???` avoids matchup noise from the move’s nominal typing. Damage against the selected Pokemon using this "standard big hit" is then calculated. An attack with a large damage result is used to minimize rounding errors.

3. **Bulk Ratio**  

   Let `HP` be the defender’s max HP and `D_phys` / `D_spec` be the minimum damages for the physical and special calibration hits respectively. Comparing this damage against the Pokemon's HP stat gives an absolute measure of its bulk that is unitless.

   - **Physical bulk ratio** ≈ `(HP / D_phys)`  
   - **Special bulk ratio** ≈ `(HP / D_spec)`

4. **Normalizing to Ditto HP**

    Having a unitless measure of a Pokemon's bulk allows us to scale it to any damage unit we choose. The most convenient unit to scale to is Ditto's own bulk. We can do this by multiplying each of the bulk ratios by the amount of damage our "Standard Ditto" would receive from our standard big hits. The min damage roll for this calc turns out to be **374**.

    - **Physical Bulk as Ditto HP** ≈ `(374 * HP / D_phys)`  
    - **Special Bulk as Ditto HP** ≈ `(374 * HP / D_spec)`

5. **Profit**

    We now have an independent measure of any Pokemon's physical and special bulk measured in DittoHP units. As a result, any damage amounts from other Pokemon to our standard Ditto are on the same scale, so damage calculations are a subtraction or division of the Ditto-Damage from the Ditto-Bulk of any Pokemon.

    Example 1:

    0 Def Aggron-Mega Body Press vs. 2 HP / 0 Def Incineroar: 138-164 (80.2 - 95.3%)

    0 Def Aggron-Mega Body Press vs. 0 HP / 0 Def Ditto: 111-131

    2 HP / 0 Def Incineroar Physical Bulk: 277

    (111-131) x 2 =  (222-262) Fighting vs. Dark Supereffective

    (222-262)/277 = (80.1% - 94.5%)

    Example 2:

    32+ Atk Aerodactyl Dual Wingbeat (2 hits) vs. 32 HP / 32 Def Sneasler: 144-172 (77 - 91.9%) -- guaranteed 2HKO

    32+ Atk Aerodactyl Dual Wingbeat (2 hits) vs. 0 HP / 0 Def Ditto: 116-138

    32 HP / 32 Def Sneasler Physical Bulk: 308

    (116 - 138)/308 * 2 = (75.3 - 89.6%)

    Rounding accounts for the difference between the raw calc and the DittoCalc derivation, but the goal is not to replicate exact damage calculations, but give players a knowledge base that allows key damage thresholds to be discovered by intuition. Unfamiliar matchups also become more navigable once absolute bulk and damage are calculated.

## Goals and Future Plans

My ultimate goal with publishing this calculator is to encourage the adoption of a standard damage and bulk metric in compentitive Pokemon, which I believe would reduce the barrier to    entry for new players, accelerate the development of the metagame, and increase the consistency of high level players. I unfortunately am not able to dedicate the time needed to develop this calculator to the level of usefulness provided by dedicated teams like those at Pikalytics and Smogon. If you find this tool helpful, please request that the concept be integrated into those platforms.



Upstream credits remain with the original Smogon calculator; DittoCalc-specific changes are layered on top.

## License

MIT (see upstream damage calculator for full history and contributor list).
