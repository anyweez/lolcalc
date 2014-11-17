
function format_benchmarks(gt, duration) {
	var d = [];
	for (var i = 0; i < duration; i++) {
		d.push( {x: (i+1) * 60, y: gt.num_steps[i]} );
	}
			   
	return d;
}

/**
 * Generate new ground truth data.
 */
function generate_gt(num_minutes) {
	var new_gt = {
		num_steps: [],
		timing: [],
		sims: []
	};
	
	for (var i = 0; i < num_minutes; i++) {
		$("#duration").val(i+1);
		var total_time = 0;
		
		// Run twenty times so that we can get a reasonable average runtime.
		for (var j = 0; j < 20; j++) {
			new_gt.sims[i] = prepare_simulation();
			new_gt.num_steps[i] = sim_step_counter;
			total_time += new Date().getTime() - sim_start_time;
		}
		// Average runtime.
		new_gt.timing[i] = total_time / 20; 
	}
	
	return new_gt;
}

function compare_events(e1, e2) {
	// If the timestamps aren't the same, return false.
	if (e1.when != e2.when) return false;
	// If neither event is set and the timestamps are the same, events match.
	if (e1.buy_item == null && e2.buy_item == null) return true;
	if (e1.buy_item == null || e2.buy_item == null) return false;
	
	// Otherwise, just use the name to verify that the items are the same.
	return (e1.buy_item.name == e2.buy_item.name && 
			e1.current_gold == e2.current_gold &&
			e1.current_dps == e2.current_dps);
}

function verify_correctness(test, gt, duration) {
	for (var i = 0; i < duration; i++) {
		var events = test.sims[i].attacker.events;
		
		for (var j = 0; j < events.length; j++) {
			// TODO: Will a simple comparison actually test what I need it to test?
			if ( !compare_events(events[j], gt.sims[i].attacker.events[j]) ) return false;
		}
	}
	
	return true;
}


//// GROUND TRUTH DATA ////
// Generate new ground truth data by running generate_gt().
var ground_truth = {
  "num_steps": [
    2,
    4,
    7,
    13,
    23,
    43,
    84,
    161,
    323,
    628,
    1283,
    2462,
    4718,
    9308,
    17644,
    33725,
    60736,
    104361,
    174468,
    290250
  ],
  "timing": [
    1.48,
    1.26,
    0.97,
    1.37,
    1.01,
    1.4,
    1.78,
    2.45,
    4.15,
    7.08,
    14.07,
    27.99,
    55.76,
    116.08,
    233.04,
    472.69,
    894.71,
    1610.97,
    2802.29,
    4812.16
  ],
  "sims": [
    {
      "attacker": {
        "gold": 400,
        "attack": 20,
        "items": [],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          }
        ]
      },
      "fitness": 15
    },
    {
      "attacker": {
        "gold": 250,
        "attack": 30,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          }
        ]
      },
      "fitness": 25
    },
    {
      "attacker": {
        "gold": 450,
        "attack": 30,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          }
        ]
      },
      "fitness": 25
    },
    {
      "attacker": {
        "gold": 300,
        "attack": 40,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          }
        ]
      },
      "fitness": 35
    },
    {
      "attacker": {
        "gold": 500,
        "attack": 40,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          }
        ]
      },
      "fitness": 35
    },
    {
      "attacker": {
        "gold": 350,
        "attack": 50,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          }
        ]
      },
      "fitness": 45
    },
    {
      "attacker": {
        "gold": 200,
        "attack": 60,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          }
        ]
      },
      "fitness": 55
    },
    {
      "attacker": {
        "gold": 400,
        "attack": 60,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          }
        ]
      },
      "fitness": 55
    },
    {
      "attacker": {
        "gold": 250,
        "attack": 70,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          }
        ]
      },
      "fitness": 65
    },
    {
      "attacker": {
        "gold": 450,
        "attack": 70,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          }
        ]
      },
      "fitness": 65
    },
    {
      "attacker": {
        "gold": 300,
        "attack": 80,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 80
          }
        ]
      },
      "fitness": 75
    },
    {
      "attacker": {
        "gold": 300,
        "attack": 80,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 80
          }
        ]
      },
      "fitness": 75
    },
    {
      "attacker": {
        "gold": 300,
        "attack": 80,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 80
          }
        ]
      },
      "fitness": 75
    },
    {
      "attacker": {
        "gold": 200,
        "attack": 85,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": null,
            "current_gold": 400,
            "current_dps": 60
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 600,
            "current_dps": 60
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 800,
            "current_dps": 60
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 1000,
            "current_dps": 60
          },
          {
            "when": 13,
            "buy_item": null,
            "current_gold": 1200,
            "current_dps": 60
          },
          {
            "when": 14,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 85
          }
        ]
      },
      "fitness": 80
    },
    {
      "attacker": {
        "gold": 400,
        "attack": 85,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": null,
            "current_gold": 400,
            "current_dps": 60
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 600,
            "current_dps": 60
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 800,
            "current_dps": 60
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 1000,
            "current_dps": 60
          },
          {
            "when": 13,
            "buy_item": null,
            "current_gold": 1200,
            "current_dps": 60
          },
          {
            "when": 14,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 85
          },
          {
            "when": 15,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 85
          }
        ]
      },
      "fitness": 80
    },
    {
      "attacker": {
        "gold": 250,
        "attack": 95,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 450,
            "current_dps": 70
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 650,
            "current_dps": 70
          },
          {
            "when": 13,
            "buy_item": null,
            "current_gold": 850,
            "current_dps": 70
          },
          {
            "when": 14,
            "buy_item": null,
            "current_gold": 1050,
            "current_dps": 70
          },
          {
            "when": 15,
            "buy_item": null,
            "current_gold": 1250,
            "current_dps": 70
          },
          {
            "when": 16,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 95
          }
        ]
      },
      "fitness": 90
    },
    {
      "attacker": {
        "gold": 250,
        "attack": 95,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 450,
            "current_dps": 70
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 650,
            "current_dps": 70
          },
          {
            "when": 13,
            "buy_item": null,
            "current_gold": 850,
            "current_dps": 70
          },
          {
            "when": 14,
            "buy_item": null,
            "current_gold": 1050,
            "current_dps": 70
          },
          {
            "when": 15,
            "buy_item": null,
            "current_gold": 1250,
            "current_dps": 70
          },
          {
            "when": 16,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 95
          }
        ]
      },
      "fitness": 90
    },
    {
      "attacker": {
        "gold": 250,
        "attack": 95,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 450,
            "current_dps": 70
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 650,
            "current_dps": 70
          },
          {
            "when": 13,
            "buy_item": null,
            "current_gold": 850,
            "current_dps": 70
          },
          {
            "when": 14,
            "buy_item": null,
            "current_gold": 1050,
            "current_dps": 70
          },
          {
            "when": 15,
            "buy_item": null,
            "current_gold": 1250,
            "current_dps": 70
          },
          {
            "when": 16,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 95
          }
        ]
      },
      "fitness": 90
    },
    {
      "attacker": {
        "gold": 250,
        "attack": 95,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 0,
            "current_dps": 60
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 60
          },
          {
            "when": 9,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 70
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 70
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 450,
            "current_dps": 70
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 650,
            "current_dps": 70
          },
          {
            "when": 13,
            "buy_item": null,
            "current_gold": 850,
            "current_dps": 70
          },
          {
            "when": 14,
            "buy_item": null,
            "current_gold": 1050,
            "current_dps": 70
          },
          {
            "when": 15,
            "buy_item": null,
            "current_gold": 1250,
            "current_dps": 70
          },
          {
            "when": 16,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 95
          }
        ]
      },
      "fitness": 90
    },
    {
      "attacker": {
        "gold": 350,
        "attack": 100,
        "items": [
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Small sword",
            "cost": 350,
            "attack": 10,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          },
          {
            "name": "Bilgewater Cutlass",
            "cost": 1400,
            "attack": 25,
            "attack_speed": 0,
            "crit": 0
          }
        ],
        "events": [
          {
            "when": 1,
            "buy_item": null,
            "current_gold": 200,
            "current_dps": 20
          },
          {
            "when": 2,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 50,
            "current_dps": 30
          },
          {
            "when": 3,
            "buy_item": null,
            "current_gold": 250,
            "current_dps": 30
          },
          {
            "when": 4,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 100,
            "current_dps": 40
          },
          {
            "when": 5,
            "buy_item": null,
            "current_gold": 300,
            "current_dps": 40
          },
          {
            "when": 6,
            "buy_item": {
              "name": "Small sword",
              "cost": 350,
              "attack": 10,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 50
          },
          {
            "when": 7,
            "buy_item": null,
            "current_gold": 350,
            "current_dps": 50
          },
          {
            "when": 8,
            "buy_item": null,
            "current_gold": 550,
            "current_dps": 50
          },
          {
            "when": 9,
            "buy_item": null,
            "current_gold": 750,
            "current_dps": 50
          },
          {
            "when": 10,
            "buy_item": null,
            "current_gold": 950,
            "current_dps": 50
          },
          {
            "when": 11,
            "buy_item": null,
            "current_gold": 1150,
            "current_dps": 50
          },
          {
            "when": 12,
            "buy_item": null,
            "current_gold": 1350,
            "current_dps": 50
          },
          {
            "when": 13,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 75
          },
          {
            "when": 14,
            "buy_item": null,
            "current_gold": 350,
            "current_dps": 75
          },
          {
            "when": 15,
            "buy_item": null,
            "current_gold": 550,
            "current_dps": 75
          },
          {
            "when": 16,
            "buy_item": null,
            "current_gold": 750,
            "current_dps": 75
          },
          {
            "when": 17,
            "buy_item": null,
            "current_gold": 950,
            "current_dps": 75
          },
          {
            "when": 18,
            "buy_item": null,
            "current_gold": 1150,
            "current_dps": 75
          },
          {
            "when": 19,
            "buy_item": null,
            "current_gold": 1350,
            "current_dps": 75
          },
          {
            "when": 20,
            "buy_item": {
              "name": "Bilgewater Cutlass",
              "cost": 1400,
              "attack": 25,
              "attack_speed": 0,
              "crit": 0
            },
            "current_gold": 150,
            "current_dps": 100
          }
        ]
      },
      "fitness": 95
    }
  ]
}
