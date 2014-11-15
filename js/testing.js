
var ground_truth = {
	num_steps: [],
	timing: [],
	sims: []
};

function format_benchmarks(gt, duration) {
	var d = [];
	for (var i = 0; i < duration; i++) {
		d.push( {x: i+1, y: gt.num_steps[i]} );
	}
			   
	return d;
}

function verify_correctness(test, gt, duration) {
	for (var i = 0; i < duration; i++) {
		var events = test.sims[i].attacker.events;
		
		for (var j = 0; j < events.length; j++) {
			// TODO: Will a simple comparison actually test what I need it to test?
			if (events[j] != gt.sims[i].attacker.events[j]) return false;
		}
	}
	
	return true;
}
