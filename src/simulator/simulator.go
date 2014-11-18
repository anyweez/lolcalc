package main

/**
 * The simulator is the core backend binary that generates optimal 
 * time-series power curves given the following inputs:
 *   - attacker champion
 *   - defender champion [not implemented]
 *   - game duration (in minutes)
 */

import (
	structs "structs"
	"flag"
	"fmt"
	"log"
)

var DURATION = flag.Int("duration", 10, "The duration of the simulated game (in minutes).")
var ATTACKER = flag.String("attacker", "", "The name of the champion that's attacking.")
//var DEFENDER = flag String("defender", "", "The name of the champions that's defending (currently not relevant.")

var itemList = make(map[int]structs.ChampionItem)

/**
 * Temporarily ghetto. This should read from a data file and load the items
 * into the itemList map. For now its just manually populating.
 */
func loadItems() {
	itemList[0] = structs.ChampionItem {
		Id: 3,
		Name: "Small sword",
		Cost: 350,
		Attack: 10,
		AttackSpeed: 0,
		CriticalStrikePct: 0,
		BuildsFrom: nil,
	}
	
	itemList[1] = structs.ChampionItem {
		Id: 1,
		Name: "Blade of the Ruined King",
		Cost: 3200,
		Attack: 25,
		AttackSpeed: .40,
		CriticalStrikePct: 0,
		BuildsFrom: nil,	
	}	

	itemList[2] = structs.ChampionItem {
		Id: 2,
		Name: "Bilgewater Cutlass",
		Cost: 1400,
		Attack: 25,
		AttackSpeed: 0,
		CriticalStrikePct: 0,
		BuildsFrom: nil,	
	}	
}

func main() {
	flag.Parse()
	log.Println("Loading simulator data...")

	loadItems()
	
	// TODO: Replace this with something generated from *ATTACKER
	attacker := structs.Champion {
		Gold: 0,
		Attack: 20, 
		AttacksPerSecond: 1.5,
	}
	defender := structs.Champion {
		Gold: 0,
		Armor: 5,
	}
	
	log.Println(fmt.Sprintf("Running %d-minute simulation...", *DURATION)) 
	simulation := simulate(attacker, defender, 1, *DURATION)
	
	// Print the events.
	for _, event := range simulation.Attacker.Events {
		fmt.Println(event.String())
	}
}

/**
 * Recursive function that explores all of the items that can be purchased to find
 * the one that results in the greatest value for the optimization function (currently
 * maximize DPS).
 * 
 * Returns a simulation that tracks the events, items purchased, DPS, etc.
 */
func simulate(attacker structs.Champion, defender structs.Champion, current int, total int) structs.Simulation {
	attacker.Gold += income(attacker, current)
	
	// Base case
	if total - current < 0 {
		return structs.Simulation {
			Attacker: attacker,
			Fitness: fitness(attacker, defender),
		}
	} else {	
		// First evaluate the max fitness if I don't buy anything this turn.
		// Buying an item has to be greater than or equal to this. If buying
		// is the same as staying, go ahead and buy (otherwise the solutions
		// of buying item X now and buying X later are equivalent, and in
		// practice the former is better).
		a := buy(attacker, defender, 
			structs.SimulatorEvent{
				EventType: structs.NoEvent, 
				When: current, 
				TargetItem: structs.ChampionItem{},
			}, 0)

		bestSim := simulate(a, defender, current+1, total);
		
		// Check to see if it's better to buy any items than it is to
		// go with nothing.
		for _, item := range itemList {
			// TODO: get quote
			
			// If this item costs more than the simulated user has, don't
			// both exploring this option.
			// If the user already has a full inventory then don't bother
			// exploring new purchasing options.
			if (attacker.Gold >= item.Cost) && (len(attacker.Items) < 6)  {			
				a = buy(attacker, defender, 
					structs.SimulatorEvent{
						EventType: structs.BuyEvent, 
						When: current, 
						TargetItem: item,
					}, item.Cost)
			
				sim := simulate(a, defender, current+1, total)
			
				if sim.Fitness >= bestSim.Fitness {
					bestSim = sim
				}
			}
		}
			
		return bestSim
	}
}

/**
 * The default fitness function computes DPS using damage functions that I
 * found online. Note that this only computes autoattack DPS and doesn't take
 * into account the damage done by individual abilities.
 */
func fitness(a structs.Champion, d structs.Champion) float32 {
	// Calculate damage per attack
	damagePerAttack := float32(a.Attack * ( 1 - ((d.Armor - a.ArmorPenetration) / (100 + d.Armor)) ));
	// Add a critical strike multiplier. represent this with E(critical strike).
	damagePerAttack += (a.CriticalStrikePct * damagePerAttack);
  
	return damagePerAttack * a.AttacksPerSecond;  
}

/**
 * Returns the amount of income that the player generates during this turn.
 */
func income(player structs.Champion, when int) int {
	return 200
}

func buy(a structs.Champion, d structs.Champion, event structs.SimulatorEvent, quote int) structs.Champion {
	// If we're buying an item fresh, charge the user for it and apply it's properties.
	if event.EventType == structs.BuyEvent {
		a.Items = append(a.Items, event.TargetItem)

		a.Gold -= event.TargetItem.Cost
		a.Attack += event.TargetItem.Attack
		a.AttacksPerSecond += event.TargetItem.AttackSpeed
		a.CriticalStrikePct += event.TargetItem.CriticalStrikePct	
	}

	// Update the event and log it with the player.
	event.InventorySize = len(a.Items)
	event.CurrentGold = a.Gold
	event.CurrentDPS = fitness(a, d)
	// Add the event to the event queue for this player instance.
	a.Events = append(a.Events, event)
	
	return a
}
