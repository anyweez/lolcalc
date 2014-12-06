package data

type ChampionItemReader struct {
	Version		string
	Items		[]ChampionItem
}

type ChampionItem struct {
	Id					int
	Name				string
	Cost				int
	
	Attack				int
	AttackSpeed			float64
	CriticalStrikePct	float64
//	BuildsFrom			[]int
}

type StageConstraints struct {
	Gold		int
}

type PermutationResult struct {
	Fitness		float64
	Valid		bool
	Items		[]ChampionItem
}
