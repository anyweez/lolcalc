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
	"encoding/json"
	"io/ioutil"
	"flag"
	"fmt"
	"log"
)

var DURATION = flag.Int("duration", 10, "The duration of the simulated game (in minutes).")
var ATTACKER = flag.String("attacker", "", "The name of the champion that's attacking.")
//var DEFENDER = flag String("defender", "", "The name of the champions that's defending (currently not relevant.")

var itemList = make(map[int]structs.ChampionItem)
var simulator_steps = 0

/**
 * Temporarily ghetto. This should read from a data file and load the items
 * into the itemList map. For now its just manually populating.
 */
func loadItems() {
	// Read the items from an external data file.
	data, _ := ioutil.ReadFile("data/items.json")
	reader := structs.ChampionItemReader{}
	json.Unmarshal(data, &reader)
	
	for _, item := range reader.Items {
		itemList[item.Id] = item
	}
}

func main() {
	flag.Parse()
	log.Println("Loading simulator data...")

	// Load all of the items includede in the simulation from an
	// external data file.
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
	fmt.Println("Simulator steps:", simulator_steps)
	output, _ := json.Marshal(simulation)
	ioutil.WriteFile("output/simulation.json", output, 0644)
}

/**
 * Recursive function that explores all of the items that can be purchased to find
 * the one that results in the greatest value for the optimization function (currently
 * maximize DPS).
 * 
 * Returns a simulation that tracks the events, items purchased, DPS, etc.
 */
func simulate(attacker structs.Champion, defender structs.Champion, current int, total int) structs.Simulation {
	simulator_steps += 1
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
			}, structs.PurchaseQuote{})

		bestSim := simulate(a, defender, current+1, total);
		
		// Check to see if it's better to buy any items than it is to
		// go with nothing.
		for _, item := range itemList {
			quote := getQuote(attacker, item)

			// If this item costs more than the simulated user has, don't
			// both exploring this option.
			// If the user already has a full inventory then don't bother
			// exploring new purchasing options.
			if (attacker.Gold >= quote.Cost) && (len(attacker.Items) < 6)  {			
				event := structs.SimulatorEvent{
					When: current,
					TargetItem: item,
				}
				
				// Check to see if this is an upgrade or a direct buy.
				if quote.Cost != item.Cost {
					event.EventType = structs.UpgradeEvent
				} else {
					event.EventType = structs.BuyEvent
				}
				
				a = buy(attacker, defender, event, quote)
				sim := simulate(a, defender, current+1, total)
				
//				if current == 15 {
//					log.Println(quote.Cost, sim.Attacker.Attack)
//				}
						
				if sim.Fitness >= bestSim.Fitness {
					bestSim = sim
				}
				
			}
		}
			
		return bestSim
	}
}

func getQuote(a structs.Champion, item structs.ChampionItem) structs.PurchaseQuote {
	if item.Id == 0 {
		return structs.PurchaseQuote{
			Cost: 0,
		}
	}
	
	playerItems := make([]int, 0, 6)
	removals := make([]int, 0, 6)
	cost := item.Cost

	// Get the list of items that the player has in their inventory.
	for _, pi := range a.Items {
		playerItems = append(playerItems, pi.Id)
	}
		
	// Loop through all of the items that the target can be built from.
	// Check to see if any of them exist in the user's inventory, and
	// if so then discount the cost of the item.
	for _, ti := range item.BuildsFrom {
		// Check to see if ti is in playerItems. If so, remove it. Make sure
		// you don't remove the same item twice (unless it's listed in the
		// BuildsFrom list twice).
		exists := false
		for i, pi := range playerItems {
			if pi == ti && !exists {
				playerItems = append(playerItems[:i], playerItems[i+1:]...)
				removals = append(removals, pi)
				
				// Remove the cost of the upgradeable item.
				cost -= itemList[pi].Cost
				exists = true				
			} 
		}		
	}
	
	return structs.PurchaseQuote{
		Cost: cost,
		Removed: removals,
	}

}

/**
 * The default fitness function computes DPS using damage functions that I
 * found online. Note that this only computes autoattack DPS and doesn't take
 * into account the damage done by individual abilities.
 */
func fitness(a structs.Champion, d structs.Champion) float32 {
/*
	// Calculate damage per attack
	damagePerAttack := float32(a.Attack * ( 1 - ((d.Armor - a.ArmorPenetration) / (100 + d.Armor)) ));
	// Add a critical strike multiplier. represent this with E(critical strike).
	damagePerAttack += (a.CriticalStrikePct * damagePerAttack);
  
	return damagePerAttack * a.AttacksPerSecond;  
	* */
	return float32(a.Attack)
}

/**
 * Returns the amount of income that the player generates during this turn.
 */
func income(player structs.Champion, when int) int {
	return 200
}

func buy(a structs.Champion, d structs.Champion, event structs.SimulatorEvent, quote structs.PurchaseQuote) structs.Champion {
	// If we're upgrading, remove the items that need to be removed, adjust gold, and apply effects and countereffects.
	if event.EventType == structs.UpgradeEvent {
		// Remove items
		for _, rid := range quote.Removed {
			removed := false
			for i, iid := range a.Items {
				// Remove the item
				if rid == iid.Id && !removed {
					// TODO: Is it OK to remove the items in the middle of the
					// loop?
					a.Items = append(a.Items[:i], a.Items[i+1:]...)
					
					// Remove effects
					a.Attack -= itemList[rid].Attack
					a.AttacksPerSecond -= itemList[rid].AttackSpeed
					a.CriticalStrikePct -= itemList[rid].CriticalStrikePct
					
					removed = true
				}
			}
			
			if removed == false {
				log.Fatal("Couldn't find expected item during upgrade")
			}
		}
		
		// Adjust gold
		a.Gold -= quote.Cost
		// Adjust effects
		a.Attack += event.TargetItem.Attack
		a.AttacksPerSecond += event.TargetItem.AttackSpeed
		a.CriticalStrikePct += event.TargetItem.CriticalStrikePct	

	// If we're buying an item fresh, charge the user for it and apply it's properties.		
	} else if event.EventType == structs.BuyEvent {
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
	event.Quote = quote
	// Add the event to the event queue for this player instance.
	a.Events = append(a.Events, event)
	
	return a
}
