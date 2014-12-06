package fitness

import (
	structs "structs"
)

/**
 * Computes the damage per second generated from auto-attacks. This
 * is only a partial formula; it accounts for attack damage, critical
 * strike percentages, and attack speed.
 */
func Dps(items []structs.ChampionItem) float64 {
	dps := 0.0

	for _, item := range items {
		dps += float64(item.Attack)
	}
	
	critPct := 0.0
	for _, item := range items {
		critPct += item.CriticalStrikePct
	}
	
	// Critical strike maxes out at 100%.
	// http://leagueoflegends.wikia.com/wiki/Critical_strike
	if critPct > 1 {
		critPct = 1
	}
	
	// A critical strike does double damage. Increase DPS by the expected
	// value given a certain critical strike percentage.
	dps += (dps * critPct)

	// Number of attacks per second.
	for _, item := range items {
		dps *= 1 + item.AttackSpeed
	}
	
	return dps
}
