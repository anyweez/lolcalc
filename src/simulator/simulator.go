package main

import (
	structs "structs"
	fitness "fitness"
	"encoding/json"
	"io/ioutil"
//	"log"
	"fmt"
	"flag"
	"math"
	"runtime"
//	"os"
	"sync"
)

var wg sync.WaitGroup
var GOLD = flag.Int("gold", 500, "The amount of gold that the simulation is limited to spending.")
var CORES = flag.Int("cores", 1, "The number of cores to use for the simulation.")

/**
 * Read items from an external data file and generate a list of items.
 */
func loadItems() []structs.ChampionItem {
	// Read the items from an external data file.
	data, _ := ioutil.ReadFile("data/items.json")
	reader := structs.ChampionItemReader{}
	json.Unmarshal(data, &reader)
	
	return reader.Items
}

func joiner(results chan structs.PermutationResult, count uint) {
	var current uint = 0
	bestResult := structs.PermutationResult{}
	
	fmt.Println( fmt.Sprintf("Total permutations needed: %d", count) )
	for current < count {
		result := <- results
		
		// Ignore the result unless it's valid.
		if result.Valid {
			// If this combo has the highest score, remember it.
			if result.Fitness > bestResult.Fitness {
				bestResult = result
			}
		}

		current += 1
		
		// Only update once per X joins.
		if current % 1000 == 0 {
			if bestResult.Valid {
				fmt.Print( fmt.Sprintf("[%.1f%%] Best option has fitness: %.1f\r", 100 * (float64(current) / float64(count)), bestResult.Fitness) )		
			} else {
				fmt.Print( fmt.Sprintf("[%.1f%%] Running...\r", 100 * (float64(current) / float64(count))) )
			}
		}
	}

	fmt.Println()
	for i, item := range bestResult.Items {
		fmt.Println( fmt.Sprintf("  %d. %s", i+1, item.Name) )
	}	
	fmt.Println()
}

func compare(items []structs.ChampionItem, constraints structs.StageConstraints, jchan chan structs.PermutationResult, done chan bool) {
	defer wg.Done()
	result := structs.PermutationResult{
		Valid: true,
	}
	
	// Remove the gold cost of this item configuration and mark the
	// configuration as invalid if it's not affordable.
	for _, item := range items {
		constraints.Gold -= item.Cost
		
		if constraints.Gold < 0 {
			result.Valid = false
		}
	}
	
	// Run the fitness function on the item set.
	if result.Valid {
		result.Fitness = fitness.Dps(items)

		// Load items that increase the size of the message now that
		// they'll actually be used.
		result.Items = items
	}
	
	jchan <- result
	done <- true
} 

/**
 * Filter out items that cannot be chosen based on the constraints (cost
 * more than the available gold, for example.
 */
func filter(items []structs.ChampionItem, constraints structs.StageConstraints) []structs.ChampionItem {
	finished := make([]structs.ChampionItem, 0, len(items))
	
	for _, item := range items {
		if item.Cost <= constraints.Gold {
			finished = append(finished, item)
		}
	}
	
	return finished
}

func main() {
	flag.Parse()
	runtime.GOMAXPROCS(*CORES)

	// Build the constraints object that's used to steer the simulation.
	constraints := structs.StageConstraints{ 
		Gold: *GOLD, 
	}
	
	items := loadItems()
	items = filter(items, constraints)
	// Add a null item that represents "nothing" (empty space in inventory)
	items = append(items, structs.ChampionItem{ Id: -1 })
	

	jchan := make(chan structs.PermutationResult, 2000)
	queue := make(chan bool, 1000)
	
	for i := 0; i < 1000; i++ {
		queue <- true
	}
	
	go joiner( jchan, uint(math.Pow(float64(len(items)), float64(6))) )
	
	// For each permutation, fork a goroutine to examine viability and
	// and pass the findings to the centralized joiner. There can be up
	// to six items in a user's inventory so we should check out
	count := 0
	for a := 0; a < len(items); a++ {
		for b := 0; b < len(items); b++ {
			for c := 0; c < len(items); c++ {
				for d := 0; d < len(items); d++ {
					for e := 0; e < len(items); e++ {
						for f := 0; f < len(items); f++ {			
							set := make([]structs.ChampionItem, 0, 6)
							
							// Add items if they're supposed to be added.
							if items[a].Id >= 0 {
								set = append(set, items[a])
							}
							if items[b].Id >= 0 {
								set = append(set, items[b])
							}
							if items[c].Id >= 0 {
								set = append(set, items[c])
							}
							if items[d].Id >= 0 {
								set = append(set, items[d])
							}
							if items[e].Id >= 0 {
								set = append(set, items[e])
							}
							if items[f].Id >= 0 {
								set = append(set, items[f])
							}
							
							// Go time!
							wg.Add(1)
							<- queue
							go compare(set, constraints, jchan, queue)
							
							count += 1
						}
					}
				}
			}
			
		}
	}
	
	wg.Wait()
}
