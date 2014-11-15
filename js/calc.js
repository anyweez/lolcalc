// Global variable to track the number of simulation steps (debugging & optimization).
var sim_step_counter = 0;
var sim_start_time;

function gold(player, minute) {
  return 200;
}

function buy(player_orig, event) {
  // Deep copy the object so that player_orig isn't modified.
  var player = jQuery.extend(true, {}, player_orig);
  
  if (event.buy_item != null) {
    player.items.push(event.buy_item);

    // Remove the gold for this item.
    player.gold -= event.buy_item.cost;
    player.attack += event.buy_item.attack;
  }
  
//  event.attacker = jQuery.extend(true, {}, player_orig);
  event.current_gold = player.gold;
  event.current_dps = player.attack;
  player.events.push(event);
  
  return player;
}

/**
 * Computes the damage per second done to the defender by the attacker.
 * 
 * Note: not the real formula.
 */
function fitness(a, d) {
  // Calculate damage per attack
  return a.attack - d.armor;
  
  // Todo: multiply by number of attacks
}

/**
 * Simulates the power curve for a champion relative to another defending
 * champion.
 */
function simulate(attacker, defender, minutes, duration, gold_model) {
  sim_step_counter += 1;
  // Add income as the first step of the simulation.
  attacker.gold += gold_model(attacker, minutes);
  
  // Base case: if the max # of minutes have been computed, return the score of the
  // fitness function. Also, if the player's inventory is full then this is
  // a dead end (valid finishing case but no point exploring further).
  if (duration - minutes < 0 || attacker.items.length >= 6) {
    return {
      attacker: attacker,
      fitness: fitness(attacker, defender)
    }
  }
  else { 
    // First evaluate the max fitness if I don't buy anything this turn.
    // Buying an item has to be greater than or equal to this. If buying
    // is the same as staying, go ahead and buy (otherwise the solutions
    // of buying item X now and buying X later are equivalent, and in
    // practice the former is better).
    var a = buy(attacker, {when: minutes, buy_item: null});
    var sim = simulate(a, defender, minutes+1, duration, gold_model);
    var best_event = {when: minutes, buy_item: null};
    var best_sim = sim;
    
    // Then evaluate the max fitness if I buy each of the available items.
    for (var i = 0; i < items.length; i++) {
        // If the player can't afford the item, don't bother.
        if (items[i].cost > attacker.gold) continue;
		// If the player's inventory is full then skip because they can't buy.
		if (a.items.length >= 6) continue;
      
        a = buy(attacker, {when: minutes, buy_item: items[i]});
        sim = simulate(a, defender, minutes+1, duration, gold_model);
       
        // If this event leads to a higher fitness score then keep track.
        // Otherwise we can forget about it.
        if (sim.fitness >= best_sim.fitness) {
            best_sim = sim;
            best_event = {when: minutes, buy_item: items[i]};
        }
    }
  
    return best_sim
  }
}

$(document).ready(function() {
    console.log("Ready!");
//    var sim = prepare_simulation();

	// Run a performance test.
	benchmark(sim);
	test_simulation(10);
});

/**
 * Generates a set of performance metrics to be compared against ground
 * truth performance data (stored in testing.js). Ground truth data is
 * based on a simple brute-force breadth first search that should be
 * correct but has O(2^n runtime).
 */
function test_simulation(num_minutes) {
	var comparative_set = {
		sims: [],
		num_steps: [],
		timing: []
	};
	
	// Run twenty simulations with each duration from 1 => num_minutes
	// in order to count the number of steps required, get the event log,
	// and get an average runtime. Compare this against the ground truth
	// data stored in testing.js.	
	for (var i = 0; i < num_minutes; i++) {
		$("#duration").val(i+1);
		var total_time = 0;
		
		for (var j = 0; j < 20; j++) {
			comparative_set.sims[i] = prepare_simulation();
			comparative_set.num_steps[i] = sim_step_counter;
			total_time += new Date().getTime() - sim_start_time;
		}
		// Average runtime.
		comparative_set.timing[i] = total_time / 100; 
	}
	
	// Test for correctness, not just performance.
	var correct = verify_correctness(comparative_set, ground_truth, num_minutes);
	console.log("Correct? " + correct);
	
	// Configure and draw the graph.
	var graph = new Rickshaw.Graph( {
		element: document.querySelector("#debug"), 
	    width: 1850, 
	    height: 400, 
	    series: [{
		   color: 'steelblue',
	   	   data: format_benchmarks(comparative_set, num_minutes)
	    }, {
		   color: 'green',
		   data: format_benchmarks(ground_truth, num_minutes) 
		}]
	});
  
    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	  graph: graph,
      formatter: function(series, x, y) {
        return "<b>Num steps @ " + x + "m:</b> " + y
      }
    } );
  
    var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );
    
    graph.render();
}

function prepare_simulation() {
	var duration = parseInt( $("#duration").val() );
	// Set the title to reflect the value that the simulation represents.
	$("#title").html("Power spikes: max damage @ " + duration + " minutes");

	// Clear the current graph and event log.
	$("#chart_container").html("<div id='y_axis'></div><div id='chart'></div><div id='timeline'></div>");
	$("#events").html("");

	var attacker = {
		gold: 0,
		attack: 20,
		items: [],
		events: []
	};

	var defender = {
		gold: 0,
		armor: 5,
		items: [],
		events: []
	};
  
	// Actually run the simulation.
	sim_start_time = new Date().getTime();
	sim_step_counter = 0;	
	var sim = run_simulation( attacker, defender, parseInt(duration) );
	
	var runtime = new Date().getTime() - sim_start_time;
	$("#debug").html("# steps: " + sim_step_counter + "; Time: " + runtime + "ms; Time per step: " + (runtime / sim_step_counter) + "ms");
	
	return sim;
}

/**
 * Executes the simulation and updates the output (graph and event log).
 */
function run_simulation(attacker, defender, num_minutes) {
    console.log("Running " + num_minutes + "-minute simulation.");
    var sim = simulate(attacker, defender, 1, num_minutes, gold); 
    console.log(sim);
  
	// Configure and draw the graph.
	var graph = new Rickshaw.Graph( {
		element: document.querySelector("#chart"), 
	    width: 1850, 
	    height: 400, 
	    series: [{
		   color: 'steelblue',
	   	   data: graph_dps(sim)
	    }]
	});
  
    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	  graph: graph,
      formatter: function(series, x, y) {
        return "<b>DPS @ Minute #" + (x / 60) +":</b> " + y
      }
    } );
  
    var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );
    var y_axis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById('y_axis'),
    } );
  	 
    var annotator = new Rickshaw.Graph.Annotate({
        graph: graph,
        element: document.getElementById('timeline')
    });

    for (var i = 0; i < sim.attacker.events.length; i++) {
      if (sim.attacker.events[i].buy_item) {
        var e = sim.attacker.events[i];
        var message = "Purchased <b>" + e.buy_item.name + "</b> for " + e.buy_item.cost + " gold.";
        annotator.add(e.when * 60, message);
        annotator.update();
      }
    }
    
	graph.render();
    
    write_events(sim); 
    return sim;
}

/**
 * Write out the event log to the #events element.
 */
function write_events(simulation) {
  var events = simulation.attacker.events;
  var output_text = "<table><tr><th>Minute</th><th>DPS</th><th>Available Gold</th><th>Cost</th><th>Event</th></tr>";
  
  for (var i = 0; i < events.length; i++) {
    if (events[i].buy_item) {
	  output_text += "<tr class='action-buy'>";
	  output_text += "<td>" + events[i].when + "</td>";
	  output_text += "<td>" + events[i].current_dps + "</td>";
	  output_text += "<td>" + events[i].current_gold + "</td>";
	  output_text += "<td>" + events[i].buy_item.cost + "</td>";
	  output_text += "<td>Buy " + events[i].buy_item.name + "</td>";
	  output_text += "</tr>";
    }
    else {
	  output_text += "<tr class='action-idle'>";
	  output_text += "<td>" + events[i].when + "</td>";
	  output_text += "<td>" + events[i].current_dps + "</td>";
	  output_text += "<td>" + events[i].current_gold + "</td>";
	  output_text += "<td> --- </td>";
	  output_text += "<td>Do nothing</td>";
	  output_text += "</tr>";    
	}    
  }
  
  $("#events").html(output_text);
}

/**
 * Transforms a simulation into a timeseries that can be easily visualized.
 */
function graph_dps(simulation) {
  var events = simulation.attacker.events;
  var data = [];
  
  for (var i = 0; i < events.length; i++) {
    data.push( {x: events[i].when * 60, y: events[i].current_dps} )
  }
  
  return data;
}
