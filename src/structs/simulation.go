package data

type ChampionItemReader struct {
	Version		string
	Items		[]ChampionItem
}

type ChampionItem struct {
	Id					int
	Name				string
	Cost				int
	
	AttackDamage		float64
	AttackSpeed			float64
	CriticalStrikePct	float64
//	BuildsFrom			[]int
}

type StageCriteria struct {
	Gold		int
	Champion	PlayerChampion
	Enemy		PlayerChampion
}

type PermutationResult struct {
	Fitness		float64
	Valid		bool
	Items		[]ChampionItem
	
	ChampNoItems	PlayerChampion
	ChampWItems		PlayerChampion
}

type PlayerChampionReader struct {
	Version		string
	NumChamps	int
	Champions	[]ChampionDefinition
}

/**
 * Base stats for a champion. This is transformed into a PlayerChampion,
 * which has a certain level associated with it (vs per-level modifiers).
 */
type ChampionDefinition struct {
	Name					string
	BaseAttackDamage		float64
	AttackDamagePerLevel	float64
	
	BaseAttackSpeed			float64
	AttackSpeedPerLevel		float64
	
	BaseCriticalStrikePct	float64
	CriticalStrikePctPerLevel	float64
	
	BaseAttackSpeedDelay	float64

	BaseArmor				float64
	ArmorPerLevel			float64
}

type PlayerChampion struct {
	Name				string
	// Champion-specific base value. Modified by items.
	AttackDamage		float64
	BonusAttackDamage	float64
	// Champion-specific base value. Modified by items.
	AttackSpeed			float64
	BonusAttackSpeed	float64
	// Champion-specific value. Is not modified by items.
	AttackSpeedDelay	float64
	CriticalStrikePct	float64
	CriticalStrikeModifier	float64
	
	ArmorPenetrationPct	float64
	ArmorPenetration	float64
	
	Armor				float64
}

func Summon(def ChampionDefinition, level int) PlayerChampion {
	champ := PlayerChampion{
		Name: def.Name,
		AttackDamage: def.BaseAttackDamage + (float64(level) * def.AttackDamagePerLevel),
		AttackSpeed: def.BaseAttackSpeed + (float64(level) * def.AttackSpeedPerLevel),
		AttackSpeedDelay: def.BaseAttackSpeedDelay,
		CriticalStrikePct: def.BaseCriticalStrikePct + (float64(level) * def.CriticalStrikePctPerLevel),
		ArmorPenetrationPct: 0.0,
		ArmorPenetration: 0.0,
		Armor: def.BaseArmor + (float64(level) * def.ArmorPerLevel),
	}
	
	return champ
}
