
var items = [
  {
	id: 0,
    name: "Bilgewater Cutlass",
    cost: 1400,
    attack: 25,
    attack_speed: 0,
    crit: 0,
    builds_from: [3]
  },
  {
	id: 1,
    name: "Atma's Impaler",
    cost: 2300,
    attack: 0,
    attack_speed: 0,
    crit: .15,
    builds_from: []
  },
  {
	id: 2,
    name: "Blade of the Ruined King",
    cost: 3200,
    attack: 25,
    attack_speed: .40,
    crit: 0,
    builds_from: []
  },
  {
	id: 3,
    name: "Small sword",
    cost: 350,
    attack: 10,
    attack_speed: 0,
    crit: 0,
    builds_from: []
  },
]

var item_data = {};
// Create a dynamic mapping between item ID's and the item data itself.
for (var i = 0; i < items.length; i++) {
	item_data[i] = items[i];
}
