package main

import (
//	"bufio"
	structs "structs"
	fitness "fitness"
	"encoding/json"
	"io/ioutil"
	"fmt"
	"flag"
	"log"
//	"math"
	"math/big"
	"runtime"
	"sync"
	"time"
//	"os"
)

var wg sync.WaitGroup
var GOLD = flag.Int("gold", 500, "The amount of gold that the simulation is limited to spending.")
var CORES = flag.Int("cores", 1, "The number of cores to use for the simulation.")
var BENCHMARK = flag.Bool("benchmark", false, "Whether to make this a benchmark run or a full run.")

const INVENTORY_SIZE int = 6

/**
 * Read items from an external data file and generate a list of items.
 */
func loadItems() []structs.ChampionItem {
	// Read the items from an external data file.
	data, err := ioutil.ReadFile("data/items.json")
	
	if err != nil {
		log.Fatal("Couldn't find input item file.")
	}
	
	reader := structs.ChampionItemReader{}
	json.Unmarshal(data, &reader)
	
	return reader.Items
}

func compare(queue chan []int, initialCriteria structs.StageCriteria, items []structs.ChampionItem, output chan structs.PermutationResult) {
	defer wg.Done()
	best := structs.PermutationResult{ Fitness: -1.0, Valid: false }

	for combo := range queue {
		criteria := initialCriteria
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
			
				criteria.Gold -= items[itemId].Cost
		
				if criteria.Gold < 0 {
					result.Valid = false
				}
			}
		}
	
		// Run the fitness function on the item set.
		if result.Valid {
			result.Fitness = fitness.Dps(itemSet, criteria)
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
func filter(items []structs.ChampionItem, criteria structs.StageCriteria) []structs.ChampionItem {
	finished := make([]structs.ChampionItem, 0, len(items))
	
	for _, item := range items {
		if item.Cost <= criteria.Gold {
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

func comb(max_val int, comb_length int, output chan []int) {
    s := make([]int, comb_length)
    last := comb_length - 1
    
    var rc func(int, int)
    rc = func(current, next int) {
        for j := next; j < max_val; j++ {
            s[current] = j
            if current == last {
				o := make([]int, len(s))
				copy(o, s)
                output <- o
            } else {
                rc(current+1, j)
            }
        }
    }
    
    rc(0, 0)
    close(output)
}

func getCombinations(max_val int, max_len int) chan []int {
	c := make(chan []int, 1000000)	
	go comb(max_val, max_len, c)
	
	return c
}

func fact(n int64) *big.Int {
	val := big.NewInt(n)
	
	for i := n-1; i > 0; i-- {
		val.Mul(val, big.NewInt(i))
	}
	
	return val
}

func getNumCombinations(num_items int, set_size int) *big.Int {
	// Combinations without replacement
	// http://rosettacode.org/wiki/Combinations
	numer := fact(int64(num_items + INVENTORY_SIZE - 1))
	denom1 := fact(int64(num_items - 1))
	denom2 := fact(int64(INVENTORY_SIZE))
	denom := denom1.Mul(denom1, denom2)

	return numer.Div(numer, denom)
}

func main() {
	flag.Parse()
	runtime.GOMAXPROCS(*CORES)
	
	// Start time for benchmarking purposes
	start := int64(time.Nanosecond) * time.Now().UnixNano() / int64(time.Millisecond)

	// Build the criteria object that's used to steer the simulation.
	criteria := structs.StageCriteria{ 
		Gold: *GOLD, 
		Champion: structs.PlayerChampion{
			Name: "Tristana",
			AttackDamage: 0,
			AttackSpeed: 1.0,
			CriticalStrikePct: 0.0,
		},
		Enemy: structs.PlayerChampion{
			Name: "Draven",
			Armor: 0,
		},
	}
	
	loadedItems := loadItems()
	loadedItems = filter(loadedItems, criteria)
	
	items := make([]structs.ChampionItem,  0, len(loadedItems) + 1)
	// Add a null item that represents "nothing" (empty space in inventory)
	items = append(items, structs.ChampionItem{ Id: -1 })
	items = append(items, loadedItems...)
	
	if len(items) == 1 {
		log.Fatal("No items are available for the amount of gold provided.")
	}
	
	queue := make(chan []int, 1000000)
	best := make(chan structs.PermutationResult, *CORES)

	// Output available item list if we're not benchmarking.
	if !*BENCHMARK {
		fmt.Println("Available items:")
		for i := 1; i < len(items); i++ {
			fmt.Println( fmt.Sprintf("  %d: %s", i, items[i].Name) )
		}
		fmt.Println()
	}
	
	for i := 0; i < *CORES; i++ {
		wg.Add(1)
		go compare(queue, criteria, items, best)
	}
	
	count := 0
	// Formula for # of combinations without replacement
	total := getNumCombinations(len(items), INVENTORY_SIZE)
	
	// Generate combinations with replacement.	
	for val := range getCombinations(len(items), INVENTORY_SIZE) {
		// Zeros will only appear at the beginning of a list based on the
		// way the combinations are generated. Move through the list until
		// you find a non-zero and send that slice into the queue.
		for i := 0; i < len(val); i++ {
			if val[i] != 0 {
				queue <- val[i:]
			}
		}
		
		count += 1
		if count % 2000 == 0 && !*BENCHMARK {
			fmt.Print( fmt.Sprintf("[%.1f%%] Running...\r", 100 * (float64(count) / float64(total.Int64()))) )				
		}
	}
	if !*BENCHMARK {
		fmt.Println( fmt.Sprintf("[%.1f%%] Complete", 100 * (float64(count) / float64(total.Int64()))) )				
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
	
	if !*BENCHMARK {
		outputResult(winner)
	}
	end := int64(time.Nanosecond) * time.Now().UnixNano() / int64(time.Millisecond)
	
	if *BENCHMARK {
		duration := float64(end - start) / 1000.0
		fmt.Println()
		fmt.Println("[BENCHMARKING]")
		fmt.Println( fmt.Sprintf("  time: %.1fs", duration) )
		fmt.Println( fmt.Sprintf("  rate: %.1f comparisons/s", *CORES, float64(count) / duration) )
		fmt.Println( fmt.Sprintf("%.1f", float64(count) / duration) )
	}
}
