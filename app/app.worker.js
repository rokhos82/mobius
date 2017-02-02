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

function doCombatSimulation() {
	// Setup combat objects.
	combat.targets = {};
	combat.targets.attackers = _.chain(combat.fleets.defender.units).keys().value();
	combat.targets.defenders = _.chain(combat.fleets.attacker.units).keys().value();
	console.log(combat.targets);
	console.log("Hello!");

	// Run the main combat loop.
	while(combat.status !== combat.statuses.done) {
		combat.turn = combat.turn + 1;
		if(combat.turn > combat.maxTurn) {
			combat.status = combat.statuses.done
			continue;
		}
		self.postMessage(new message(combat.turn));
	}
}

self.onmessage = function(event) {
	combat.fleets = event.data;
	doCombatSimulation();
};