package fitness

import (
	structs "structs"
)

/**
 * Computes the damage per second generated from auto-attacks. This
 * is only a partial formula; it accounts for attack damage, critical
 * strike percentages, and attack speed.
 * 
 * Formula from http://forums.na.leagueoflegends.com/board/showthread.php?t=3871747.
 */
func Dps(items []structs.ChampionItem, criteria structs.StageCriteria) (float64, structs.PlayerChampion) {
	champion := criteria.Champion 
	enemy := criteria.Enemy
	
	for _, item := range items {
		champion.AttackDamage += item.AttackDamage
		champion.AttackSpeed += item.AttackSpeed
		champion.CriticalStrikePct += item.CriticalStrikePct
	}

	// Critical strike maxes out at 100%.
	// http://leagueoflegends.wikia.com/wiki/Critical_strike
	if champion.CriticalStrikePct > 1 {
		champion.CriticalStrikePct = 1
	}

	// The big ass formula. See above link for reference and structs/simulation.go
	// for documentation on each field.
	dps := champion.AttackSpeed / (1 + champion.AttackSpeedDelay) *
			(1 + champion.BonusAttackSpeed) *
			// Calculate expected damage given crits
			(
				// Calculate damage of non-crit * P(1 - crit).
				(champion.AttackDamage + champion.BonusAttackDamage) *
				(1 - champion.CriticalStrikePct) +
				// Calculate damage of crit * P(crit).
				(champion.AttackDamage + champion.BonusAttackDamage) *
				champion.CriticalStrikePct * champion.CriticalStrikeModifier) *
			(
				1 -
				// Armor drop-off formula 
				(enemy.Armor * (1 - champion.ArmorPenetrationPct) - champion.ArmorPenetration) /
				(100 + (enemy.Armor * (1 - champion.ArmorPenetrationPct) - champion.ArmorPenetration)))
	
	return dps, champion
}
