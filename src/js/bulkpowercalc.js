/**
 * Bulk ratings for Champions: defender's effective HP vs standardized 999 BP ???-type hits
 * from a dummy attacker patterned after the opponent. Scaled so bulk matches the legacy
 * reference (min damage 374 vs a standard Ditto target at level 50).
 */
var BULK_REFERENCE_MIN_DAMAGE = 374;

/** Types for the bulk dummy: must not include `???`, or ???-type moves get STAB. */
function bulkDummyTypes(opponentMon) {
	var mapped = opponentMon.types.map(function (ty) {
		return ty === '???' ? 'Normal' : ty;
	});
	if (mapped.length === 2 && mapped[0] === mapped[1]) {
		return [mapped[0]];
	}
	return mapped;
}

function createBulkAttackDummy(opponentMon) {
	var g = opponentMon.gen;
	var specialMove = new calc.Move(g, 'Thunderbolt', {
		overrides: {basePower: 999, type: '???', category: 'Special'}
	});
	var physicalMove = new calc.Move(g, 'Body Slam', {
		overrides: {basePower: 999, type: '???', category: 'Physical'}
	});
	var none = new calc.Move(g, '(No Move)', {});
	return new calc.Pokemon(g, 'Ditto', {
		level: opponentMon.level,
		ability: opponentMon.ability,
		abilityOn: opponentMon.abilityOn,
		nature: 'Hardy',
		ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
		evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
		boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: opponentMon.boosts.spe},
		status: '',
		isDynamaxed: false,
		item: undefined,
		gender: opponentMon.gender,
		moves: [specialMove, physicalMove, none, none],
		overrides: {
			types: bulkDummyTypes(opponentMon),
			weightkg: opponentMon.weightkg
		}
	});
}

function damageMinRoll(result) {
	return result.range()[0];
}

/** @returns {[number, number]} [physical bulk, special bulk] */
function calcBulk(defender, results, attackerSideIndex) {
	var spDamage = damageMinRoll(results[attackerSideIndex][0]);
	var physDamage = damageMinRoll(results[attackerSideIndex][1]);
	if (!spDamage) spDamage = 1;
	if (!physDamage) physDamage = 1;
	var hp = defender.maxHP();
	var spBulk = Math.round((BULK_REFERENCE_MIN_DAMAGE * hp) / spDamage);
	var physBulk = Math.round((BULK_REFERENCE_MIN_DAMAGE * hp) / physDamage);
	return [physBulk, spBulk];
}

/**
 * Uses clones + calculateAllMovesNoBoost so StatBoost* is not applied twice and the dummy
 * does not receive StatBoostR.
 */
function updateChampionsP1Bulk(gen, p1, p2, p1field, p2field) {
	if (!$('#p1BulkPhys').length) return;
	var p1c = p1.clone();
	var p2c = p2.clone();
	var attackerDummy = createBulkAttackDummy(p2c);
	var results = calculateAllMovesNoBoost(gen, p1c, p1field, attackerDummy, p2field);
	var bulk = calcBulk(p1c, results, 1);
	$('#p1BulkPhys').val(String(bulk[0]));
	$('#p1BulkSpec').val(String(bulk[1]));
}
