package load

import (
	"encoding/json"
	"log"
	"io/ioutil"
	structs "structs"
)

/**
 * Read items from an external data file and generate a list of items.
 */
func Items(filename string) []structs.ChampionItem {
	// Read the items from an external data file.
	data, err := ioutil.ReadFile(filename)
	
	if err != nil {
		log.Fatal("Couldn't find input item file.")
	}
	
	reader := structs.ChampionItemReader{}
	json.Unmarshal(data, &reader)
	
	return reader.Items
}

func Champs(filename string) []structs.ChampionDefinition {
	// Read the items from an external data file.
	data, err := ioutil.ReadFile(filename)
	
	if err != nil {
		log.Fatal("Couldn't find input champion file.")
	}
	
	reader := structs.PlayerChampionReader{}
	json.Unmarshal(data, &reader)
	
	return reader.Champions
}
