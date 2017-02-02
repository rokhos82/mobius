var combat = {};
combat.statuses = {
		starting: "starting",
		running: "running",
		done: "done"
};
combat.status = combat.statuses.starting;
combat.turn = 0;
combat.maxTurn = 20;
combat.fleets = undefined;

var message = function(t) {
	this.turn = t;
};

self.importScripts("../js/underscore.js");

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0;i < 1e7;i++) {
		if((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

function doCombatSimulation() {
	// Setup combat objects.
	// Do target lists first.
	combat.targets = {};
	combat.targets.attackers = _.chain(combat.fleets.defender.units).keys().value();
	combat.targets.defenders = _.chain(combat.fleets.attacker.units).keys().value();

	// Check for long range weapons

	// Run the main combat loop.
	while(combat.status !== combat.statuses.done) {
		combat.turn = combat.turn + 1;
		if(combat.turn > combat.maxTurn) {
			combat.status = combat.statuses.done
			continue;
		}
		
		// Attackers go first
		_.each(combat.fleets.attacker.units,function(unit){
			unit.shots = [];
			_.each(unit["direct-fire"],function(weapon) {
				var shot = {};
				// Get a random target from the target list
				shot.target = _.sample(combat.targets.attackers);
				shot.weapon = weapon;
				unit.shots.push(shot);
			});
		});

		// Then the defenders go
		_.each(combat.fleets.defender.units,function(unit){
			unit.shots = [];
			_.each(unit["direct-fire"],function(weapon) {
				var shot = {};
				// Get a random target from the target list
				shot.target = _.sample(combat.targets.defenders);
				shot.weapon = weapon;
				unit.shots.push(shot);
			});
		});

		// Resolve damage

		self.postMessage(new message(combat.turn));
		sleep(1000);
	}
}

self.onmessage = function(event) {
	combat.fleets = event.data;
	doCombatSimulation();
};