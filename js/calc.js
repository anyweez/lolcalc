
$(document).ready(function() {
    fetchSimulation();
});

// TEMPORARY
function next() {
	$("#duration").val( parseInt($("#duration").val()) + 1 );
	
	fetchSimulation();
}

function fetchSimulation() {
	var duration = parseInt( $("#duration").val() );

	$.ajax({
		url: "http://localhost:8000/output/simulation-" + duration + ".json", 
	}).done(function(data) {
		console.log("Response received!");
		
		// Round DPS values.
		for (var i = 0; i < data.Attacker.Events.length; i++) {
			var dps = Math.round(data.Attacker.Events[i].CurrentDPS * 10) / 10.0;
			data.Attacker.Events[i].CurrentDPS = dps;
		}
		
		updateSimulation(data);
	});
}

function updateSimulation(simulation) {
	// Update the graph.
	generateGraph(simulation);
	
	// Update the event log.
	writeEvents(simulation);
}

/**
 * Transforms a simulation into a timeseries that can be easily visualized.
 */
function mutateData(simulation) {
  var events = simulation.Attacker.Events;
  var data = [];
  
  for (var i = 0; i < events.length; i++) {
    data.push( {x: events[i].When * 60, y: events[i].CurrentDPS} )
  }
  
  return data;
}

function writeEvents(simulation) {
	console.log(simulation);
	
	var events = simulation.Attacker.Events;
	var output_text = "<table><tr><th>Minute</th><th>DPS</th><th>Available Gold</th><th>Cost</th><th>Event</th></tr>";
  
	for (var i = 0; i < events.length; i++) {		
		// If this is a buy event
		if (events[i].EventType == 1) {
			output_text += "<tr class='action-buy'>";
			output_text += "<td>" + events[i].When + "</td>";
			output_text += "<td>" + events[i].CurrentDPS + "</td>";
			output_text += "<td>" + events[i].CurrentGold + "</td>";
			output_text += "<td>" + events[i].TargetItem.Cost + "</td>";
			output_text += "<td>Buy " + events[i].TargetItem.Name + " (" + events[i].TargetItem.Cost + " gold)</td>";
			output_text += "</tr>";
		// If this is an upgrade event
		} else if (events[i].EventType == 2) {
			output_text += "<tr class='action-buy'>";
			output_text += "<td>" + events[i].When + "</td>";
			output_text += "<td>" + events[i].CurrentDPS + "</td>";
			output_text += "<td>" + events[i].CurrentGold + "</td>";
			output_text += "<td>" + events[i].TargetItem.Cost + "</td>";
			output_text += "<td>Upgrade to " + events[i].TargetItem.Name + " (" + events[i].Quote.Cost + " of " + events[i].TargetItem.Cost + " gold)</td>";
			output_text += "</tr>";
		}
		// Otherwise it's a NoEvent
		else {
			output_text += "<tr class='action-idle'>";
			output_text += "<td>" + events[i].When + "</td>";
			output_text += "<td>" + events[i].CurrentDPS + "</td>";
			output_text += "<td>" + events[i].CurrentGold + "</td>";
			output_text += "<td> --- </td>";
			output_text += "<td>Do nothing</td>";
			output_text += "</tr>";    
		}    
	}
  
  $("#events").html(output_text);
}

/**
 * Shows a graph of mutated event log data.
 */
function generateGraph(simulation) {
	// Clear past graphs
	$("#chart_container").html("<div id='y_axis'></div><div id='chart'></div><div id='timeline'></div>");
	
	// Configure and draw the graph.
	var graph = new Rickshaw.Graph( {
		element: document.querySelector("#chart"), 
	    width: 1850, 
	    height: 400, 
	    series: [{
		   color: 'steelblue',
	   	   data: mutateData(simulation)
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

    for (var i = 0; i < simulation.Attacker.Events.length; i++) {
      if (simulation.Attacker.Events[i].EventType == 1) {
        var e = simulation.Attacker.Events[i];
        var message = "Purchase a <b>" + e.TargetItem.Name + "</b> for " + e.TargetItem.Cost + " gold.";
        annotator.add(e.When * 60, message);
        annotator.update();
      }
    }
    
	graph.render();    
}
