package main

import (
	"flag"
	"fmt"
	"lib/load"
	"lib/lookup"
	structs "structs"
)

var DATA_LOCATION = flag.String("data", "data/", "The location in the filesystem where simulation data can be read from.")
var MIN_GOLD = flag.Int("mingold", 500, "The minimum amount of gold expected to have simulation results in place.")
var MAX_GOLD = flag.Int("maxgold", 15000, "The max amount of gold expected to have simulations in place.")

func main() {
	flag.Parse()
	
	champs := load.Champs(*DATA_LOCATION + "/champions.json")
	
	for _, champ := range champs {
		found := 0.0
		total := 0.0
		
		// Run through all gold values.
		for gold := *MIN_GOLD; gold <= *MAX_GOLD; gold += 100 {
			sc := structs.StageCriteria{
				Gold: gold,
				Champion: structs.Summon(champ, 1),
			}
			
			_, exists := lookup.Get( lookup.GetKey(sc) )
			total += 1.0
			if exists != nil {
				found += 1.0
			}
		}
		
		fmt.Println( fmt.Sprintf("%s:\t %.1f%%", champ.Name, (found / total) * 100) )
	}
}
