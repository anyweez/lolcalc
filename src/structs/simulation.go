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
