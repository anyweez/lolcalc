package main

import (
	structs "structs"
	fitness "fitness"
	"encoding/json"
	"io/ioutil"
	"fmt"
	"flag"
	"math"
	"runtime"
	"sync"
	"time"
)

var wg sync.WaitGroup
var GOLD = flag.Int("gold", 500, "The amount of gold that the simulation is limited to spending.")
var CORES = flag.Int("cores", 1, "The number of cores to use for the simulation.")
var BENCHMARK = flag.Bool("benchmark", false, "Whether to make this a benchmark run or a full run.")

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

func compare(queue chan []int, initialConstraints structs.StageConstraints, items []structs.ChampionItem, output chan structs.PermutationResult) {
	defer wg.Done()
	best := structs.PermutationResult{ Fitness: -1.0, Valid: false }

	for combo := range queue {
		constraints := initialConstraints
		result := structs.PermutationResult{
			Valid: true,
		}

		itemSet := make([]structs.ChampionItem, 0, len(combo))

		// Remove the gold cost of this item configuration and mark the
		// configuration as invalid if it's not affordable.
		for _, itemId := range combo {
			// Skip the null item; for all other items, check that this
			// is actually a valid combination. If it's not then we're
			// going to skip most of the work later.
			if items[itemId].Id >= 0 {
				itemSet = append(itemSet, items[itemId])
			
				constraints.Gold -= items[itemId].Cost
		
				if constraints.Gold < 0 {
					result.Valid = false
				}
			}
		}
	
		// Run the fitness function on the item set.
		if result.Valid {
			result.Fitness = fitness.Dps(itemSet)
			// Load items that increase the size of the message now that
			// they'll actually be used.
			result.Items = itemSet
		
			if result.Fitness > best.Fitness {
				best = result
			}
		}
	}

	output <- best
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

func outputResult(result structs.PermutationResult) {
	fmt.Println("Maximum fitness:", result.Fitness)
	fmt.Println("Items:")
	for i, item := range result.Items {
		if item.Id >= 0 {
			fmt.Println( fmt.Sprintf("  %d. %s", i+1, item.Name) )
		}
	}	
}

func main() {
	flag.Parse()
	runtime.GOMAXPROCS(*CORES)

	// Start time for benchmarking purposes
	start := int64(time.Nanosecond) * time.Now().UnixNano() / int64(time.Millisecond)
	numIterations := 10000000

	// Build the constraints object that's used to steer the simulation.
	constraints := structs.StageConstraints{ 
		Gold: *GOLD, 
	}
	
	items := loadItems()
	items = filter(items, constraints)
	// Add a null item that represents "nothing" (empty space in inventory)
	items = append(items, structs.ChampionItem{ Id: -1 })
	
	queue := make(chan []int)
	best := make(chan structs.PermutationResult, *CORES)
	
	for i := 0; i < *CORES; i++ {
		wg.Add(1)
		go compare(queue, constraints, items, best)
	}
	
	// For each permutation, fork a goroutine to examine viability and
	// and pass the findings to the centralized joiner. There can be up
	// to six items in a user's inventory so we should check out
	count := 0
	total := uint(math.Pow(float64(len(items)), float64(6)))

	// TODO: this is currently generating too many combinations because
	// [1, 0, 0, 0, 0, 0] == [0, 1, 0, 0, 0, 0]. I need to compute
	// combinations instead of permutations.
	for a := 0; a < len(items); a++ {
		for b := 0; b < len(items); b++ {
			for c := 0; c < len(items); c++ {
				for d := 0; d < len(items); d++ {
					for e := 0; e < len(items); e++ {
						for f := 0; f < len(items); f++ {			
							set := make([]int, 0, 6)
							
							// Add items if they're supposed to be added.
							if items[a].Id >= 0 {
								set = append(set, a)
							}
							if items[b].Id >= 0 {
								set = append(set, b)
							}
							if items[c].Id >= 0 {
								set = append(set, c)
							}
							if items[d].Id >= 0 {
								set = append(set, d)
							}
							if items[e].Id >= 0 {
								set = append(set, e)
							}
							if items[f].Id >= 0 {
								set = append(set, f)
							}
							
							// Go time!
							queue <- set							
							count += 1
							
							if *BENCHMARK && count == numIterations {
								break
							}
							
							if count % 1000 == 0 {
								fmt.Print( fmt.Sprintf("[%.1f%%] Running...\r", 100 * (float64(count) / float64(total))) )				
							}
						}
					}
				}
			}
			
		}
	}
	close(queue)
	wg.Wait()
	
	// Retrieve the top result from each comparer and find the global best.
	// Then output that result.
	winner := structs.PermutationResult{ Fitness: -1.0, Valid: false }
	for i := 0; i < *CORES; i++ {
		result := <- best
		
		if result.Fitness > winner.Fitness {
			winner = result
		}
	}
	
	outputResult(winner)
	end := int64(time.Nanosecond) * time.Now().UnixNano() / int64(time.Millisecond)
	
	if *BENCHMARK {
		duration := float64(end - start) / 1000.0
		fmt.Println()
		fmt.Println("[BENCHMARKING]")
		fmt.Println( fmt.Sprintf("  time: %.1fs", duration) )
		fmt.Println( fmt.Sprintf("  rate: %.1f comparisons/s", float64(count) / duration) )
	}

}
