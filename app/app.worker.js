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

combat.functions = {
	getTarget: function(unit) {
		var fleet = unit.fleet;
		var i = _.sample(combat.targets[fleet])
		var enemy = combat.fleets[fleet].enemy;
		var target = combat.fleets[enemy].units[i];
		return target;
	}
};

var actions = {
	"select_target": {
		"script": "var _t = new token(unit,actions[\"fire_weapons\"]); _t.target = combat.functions.getTarget(unit); stack.push(_t); logs.push(unit.unit.name + \" is taking aim at \" + _t.target.unit.name);",
		"name": "select_target"
	},
	"ready_weapons": {
		"script": "_.each(unit[\"direct-fire\"],function(weapon){var t = new token(unit,actions[\"select_target\"]);t.weapon=weapon;stack.push(t);}); logs.push(unit.unit.name + \" is readying weapons\");",
		"name": "ready_weapons"
	},
	"resolve_damage": {
		"script": "",
		"name": "resolve_damage"
	},
	"fire_weapons": {
		"script": "logs.push(unit.unit.name + \" is firing at \" + t.target.unit.name);",
		"name": "fire_weapons"
	},
	"test": {
		"script": "console.log(t.msg);",
		"name": "test"
	}
};

var tags = {
	"sticky": {
		"damage": "",
		"target": ""
	},
	"short": {},
	"long": {}
};

var token = function(unit,act) {
	this.action = act;
	this.unit = unit;
	this.priority = 0;
};

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
	combat.targets.attacker = _.chain(combat.fleets.defender.units).keys().value();
	combat.targets.defender = _.chain(combat.fleets.attacker.units).keys().value();
	combat.fleets.attacker.enemy = "defender";
	combat.fleets.defender.enemy = "attacker";

	// Check for long range weapons

	// Run the main combat loop.
	while(combat.status !== combat.statuses.done) {
		combat.turn = combat.turn + 1;
		console.log("Begin Round: " + combat.turn);
		if(combat.turn > combat.maxTurn) {
			combat.status = combat.statuses.done
			continue;
		}

		var stack = [];
		var logs = [];
		_.each(combat.fleets.attacker.units,function(unit) {
			var s = new token(unit,actions["ready_weapons"]);
			unit.fleet = "attacker";
			stack.push(s);
		});
		_.each(combat.fleets.defender.units,function(unit) {
			var s = new token(unit,actions["ready_weapons"]);
			unit.fleet = "defender";
			stack.push(s);
		});

		while(stack.length > 0) {
			var t = stack.shift();
			var unit = t.unit;
			var action = t.action;
			eval(action.script);
		}

		var m = new message(combat.turn);
		m.logs = logs;
		self.postMessage(m);
		sleep(1000);
	}
}

self.onmessage = function(event) {
	combat.fleets = event.data;
	doCombatSimulation();
};