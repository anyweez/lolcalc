package data

import (
	"fmt"
)

type Simulation struct {
	Attacker			Champion
	Fitness				float32
}

type Champion struct {
	// The amount of gold the champion currently has.
	Gold				int
	
	Attack 				int
	ArmorPenetration	int
	AttacksPerSecond	float32
	CriticalStrikePct	float32
	
	Armor				int
	
	Items				[]ChampionItem
	Events				[]SimulatorEvent
}

type ChampionItemReader struct {
	Version		string
	Items		[]ChampionItem
}

type ChampionItem struct {
	Id		int
	Name	string
	Cost	int
	
	Attack				int
	AttackSpeed			float32
	CriticalStrikePct	float32
	BuildsFrom			[]int
}

type SimulatorEventType int

const (
	NoEvent			SimulatorEventType	= iota
	BuyEvent		SimulatorEventType	= iota
	UpgradeEvent 	SimulatorEventType	= iota
)

type SimulatorEvent struct {
	EventType	SimulatorEventType
	// The minute where the event occurred
	When		int
	TargetItem	ChampionItem
	Quote		PurchaseQuote
	CurrentGold	int
	CurrentDPS	float32
	
	InventorySize	int
}

type PurchaseQuote struct {
	Cost	int
	// Item ID's that should be removed when the item is purchased.
	Removed	[]int
}


func (s* SimulatorEvent) String() string {
	if s.EventType == NoEvent {
		return fmt.Sprintf("Event [t=%d,g=%d,dps=%.1f]\t do nothing, inv=%d", s.When, s.CurrentGold, s.CurrentDPS, s.InventorySize)
	} else if s.EventType == BuyEvent {
		return fmt.Sprintf("Event [t=%d,g=%d,dps=%.1f]\t Buy %s (%d gold), inv=%d", s.When, s.CurrentGold, s.CurrentDPS, s.TargetItem.Name, s.Quote.Cost, s.InventorySize)
	} else if s.EventType == UpgradeEvent {
		return fmt.Sprintf("Event [t=%d,g=%d,dps=%.1f]\t Upgrade %s (%d gold), inv=%d", s.When, s.CurrentGold, s.CurrentDPS, s.TargetItem.Name, s.Quote.Cost, s.InventorySize)
	}
	
	return "Error: unknown event type"
}
