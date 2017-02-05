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
	},
	getNumericTag: function(unit,tag) {
		var sum = 0;
		_.each(unit,function(section) {
			// Does the tag exist?
			if(_.isNumber(section[tag])) {
				sum += section[tag];
			}
		});
		return sum;
	},
	unitTargetBonus: function(unit) {
		return combat.functions.getNumericTag(unit,"target");
	},
	unitDefenseBonus: function(unit) {
		return combat.functions.getNumericTag(unit,"defense");
	},
	unitYieldBonus: function(unit) {
		return combat.functions.getNumericTag(unit,"yield");
	},
	unitResistBonus: function(unit) {
		return combat.functions.getNumericTag(unit,"resist");
	}
};

var actions = {
	// select_target
	"select_target": {
		"script":
't.target = combat.functions.getTarget(unit);\
t.action = actions["fire_weapons"];\
stack.push(t);',
		"name": "select_target"
	},
	// ready_weapons
	"ready_weapons": {
		"script":
'_.each(unit["direct-fire"],function(weapon){\
	var t = new token(unit,actions["select_target"]);\
	t.weapon = weapon;\
	stack.push(t);\
});',
		"name": "ready_weapons"
	},
	// resolve_damage
	"resolve_damage": {
		"script":
'var target = t.target;\
if(target.shield && target.shield.current > 0) {\
	target.shield.current -= t.damage;\
	target.shield.current = target.shield.current < 0 ? 0 : target.shield.current;\
}\
else {\
	target.hull.current -= t.damage;\
	target.combat.destroyed = target.hull.current <= 0 ? true : false;\
}',
		"name": "resolve_damage"
	},
	// fire_weapons
	"fire_weapons": {
		"script":
'var hitThreshold = t.weapon.target + combat.functions.unitTargetBonus(unit) - combat.functions.unitDefenseBonus(t.target);\
hitThreshold = hitThreshold > 90 ? 90 : hitThreshold;\
hitThreshold = hitThreshold < 10 ? 10 : hitThreshold;\
var hitRoll = _.random(1,100);\
t.hitSuccess = hitRoll < hitThreshold ? true : false;\
var msg = unit.unit.name + " is firing at " + t.target.unit.name + " (" + hitRoll + "/" + hitThreshold + ")";\
if(t.hitSuccess) {\
	msg += " and hits";\
	var damagePercent = _.random(1,100) + (t.weapon.yield ? t.weapon.yeild : 0) + combat.functions.unitYieldBonus(unit) - combat.functions.unitResistBonus(t.target);\
	damagePercent = damagePercent > 100 ? 100 : damagePercent;\
	damagePercent = damagePercent < 0 ? 0 : damagePercent;\
	var damage = 0;\
	if(_.isNumber(t.weapon.volley)) { damage = Math.round(t.weapon.volley * damagePercent); }\
	else { damage = Math.round(t.weapon.volley[0] * damagePercent / 100);}\
	msg += " for " + damage + " damage (" + damagePercent + "%)";\
	t.damage = damage;\
	t.action = actions["resolve_damage"];\
	stack.push(t);\
} else {\
	msg += " and misses";\
}\
logs.push(msg);',
		"name": "fire_weapons"
	},
	// test
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
	this.fleets = combat.fleets;
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
			if(!_.isObject(unit.combat)) {
				unit.combat = {};
			}
			if(!unit.combat.destroyed) {
				var s = new token(unit,actions["ready_weapons"]);
				unit.fleet = "attacker";
				stack.push(s);
			}
		});
		_.each(combat.fleets.defender.units,function(unit) {
			if(!_.isObject(unit.combat)) {
				unit.combat = {};
			}
			if(!unit.combat.destroyed) {
				var s = new token(unit,actions["ready_weapons"]);
				unit.fleet = "defender";
				stack.push(s);
			}
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