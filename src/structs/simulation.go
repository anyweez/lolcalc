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
	CurrentGold	int
	CurrentDPS	float32
	
	InventorySize	int
}

func (s* SimulatorEvent) String() string {
	if s.EventType == NoEvent {
		return fmt.Sprintf("Event [t=%d,g=%d]: do nothing, inv=%d", s.When, s.CurrentGold, s.InventorySize)
	} else if s.EventType == BuyEvent {
		return fmt.Sprintf("Event [t=%d,g=%d]: Buy %s (%d gold), inv=%d", s.When, s.CurrentGold, s.TargetItem.Name, s.TargetItem.Cost, s.InventorySize)
	} else if s.EventType == UpgradeEvent {
		return fmt.Sprintf("Upgrade Event")
	}
	
	return "Error: unknown event type"
}
