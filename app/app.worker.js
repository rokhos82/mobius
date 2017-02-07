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
	// target
	"target": {
		"script":
't.target = combat.functions.getTarget(unit);\
var weapon = t.weapon;\
if(weapon.sticky) { eval(tags.sticky.target); }\
t.action = actions["fire_weapons"];\
stack.push(t);',
		"name": "target"
	},
	// ready
	"ready": {
		"script":
'_.each(unit["direct-fire"],function(weapon) {\
	var t = new token(unit,actions["target"]);\
	t.weapon = weapon;\
	if (weapon.sticky) {\
		eval(tags.sticky.ready);\
	}\
	stack.push(t);\
});\
_.each(unit["packet-fire"],function(weapon) {\
	for(var i = 0;i < weapon.packets;i++) {\
		var t = new token(unit,actions["target"]);\
		t.weapon = weapon;\
		if(weapon.sticky) {\
			eval(tags.sticky.ready);\
		}\
		stack.push(t);\
	}\
});',
		"name": "ready"
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
	if(unit.combat.sticky) { eval(tags.sticky.resolve); }\
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
	var damagePercent = _.random(1,100) + (t.weapon.yield ? t.weapon.yield : 0) + combat.functions.unitYieldBonus(unit) - combat.functions.unitResistBonus(t.target);\
	damagePercent = damagePercent > 100 ? 100 : damagePercent;\
	damagePercent = damagePercent < 0 ? 0 : damagePercent;\
	var damage = 0;\
	if(_.isNumber(t.weapon.volley)) {\
		damage = Math.round(t.weapon.volley * damagePercent / 100);\
		console.log(damagePercent);\
	}\
	else {\
		if(t.weapon.sticky) { eval(tags.sticky.damage); }\
		else { console.error("Unknown weapon volley type."); }\
	}\
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
		// Damage
		"damage":
'damage = Math.round(t.weapon.volley[t.weapon.sticky.index] * damagePercent / 100);\
t.weapon.sticky.index++;',
		// Target
		"target":
'if(weapon.sticky.target && weapon.sticky.index > 0) { t.target = weapon.sticky.target; }\
else { weapon.sticky.target = t.target; }',
		// Ready
		"ready":
'if(_.isObject(weapon.sticky)) {\
	if(weapon.sticky.target && weapon.sticky.target.combat.destroyed) { weapon.sticky.target = undefined; }\
	if(weapon.sticky.index > weapon.sticky.max) { weapon.sticky.index = 0; }\
}\
else if(weapon.sticky) {\
	weapon.sticky = {\
		index: 0,\
		target: undefined,\
		max: weapon.volley.length - 1\
	};\
}',
		// Resolve
		"resolve": ''
	},
	"short": {},
	"long": {},
	"ammo": {
		"ready": 'if(weapon.ammo < 0) {}',
		"target": '',
		"damage": '',
		"resolve": 'weapon.ammo--;'
	}
};

var token = function(unit,act) {
	this.action = act;
	this.unit = unit;
	this.priority = 0;
};

var message = function(t) {
	this.turn = t;
	this.fleets = combat.fleets;
	this.done = false;
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

var filters = {
	reserveUnit: function(unit) { return (!_.isNumber(unit.unit.reserve)); }
};

var maps = {
	unitName: function(unit) { return unit.unit.name; }
};

function doCombatSimulation() {
	// Setup combat objects.
	// Do target lists first.
	combat.targets = {};
	combat.targets.attacker = _.chain(combat.fleets.defender.units).filter(filters.reserveUnit).map(maps.unitName).value();
	combat.targets.defender = _.chain(combat.fleets.attacker.units).filter(filters.reserveUnit).map(maps.unitName).value();
	combat.fleets.attacker.enemy = "defender";
	combat.fleets.defender.enemy = "attacker";

	// Fleet initialization
	_.each(combat.fleets,function(fleet) {
		fleet.combat.loseCount = 0;
	});

	// Check for long range weapons

	// Run the main combat loop.
	while(combat.status !== combat.statuses.done) {
		combat.turn = combat.turn + 1;
		console.log("Begin Round: " + combat.turn);
		/*if(combat.turn > combat.maxTurn) {
			combat.status = combat.statuses.done
			continue;
		}//*/

		var stack = [];
		var logs = [];
		_.each(combat.fleets.attacker.units,function(unit) {
			if(!_.isObject(unit.combat)) {
				unit.combat = {};
			}
			if(!unit.combat.destroyed) {
				// Setup reserve units
				if(unit.unit.reserve && !unit.combat.reserve) {
					var reserveLevel = Math.ceil(unit.unit.reserve / 100 * (combat.fleets.attacker.combat.unitCount - 1));
					unit.combat.reserve = reserveLevel;
				}

				// Is the unit still in reserve?
				if(unit.combat.reserve && unit.combat.reserve > (combat.fleets.attacker.combat.unitCount - combat.fleets.attacker.combat.loseCount - 1)) {
					var s = new token(unit,actions["ready"]);
					unit.fleet = "attacker";
					stack.push(s);
				}
				else if(!unit.combat.reserve) {
					var s = new token(unit,actions["ready"]);
					unit.fleet = "attacker";
					stack.push(s);
					delete unit.combat.reserve;				
					combat.targets.defender.push(unit.unit.name);
				}
			}
		});
		_.each(combat.fleets.defender.units,function(unit) {
			if(!_.isObject(unit.combat)) {
				unit.combat = {};
			}
			if(!unit.combat.destroyed) {
				// Setup reserve units
				if(unit.unit.reserve && !unit.combat.reserve) {
					var reserveLevel = Math.ceil(unit.unit.reserve / 100 * (combat.fleets.defender.combat.unitCount - 1));
					unit.combat.reserve = reserveLevel;
				}

				// Is the unit still in reserve?
				if(unit.combat.reserve && unit.combat.reserve > (combat.fleets.defender.combat.unitCount - combat.fleets.defender.combat.loseCount - 1)) {
					var s = new token(unit,actions["ready"]);
					unit.fleet = "defender";
					stack.push(s);
					delete unit.combat.reserve;
					combat.targets.attacker.push(unit.unit.name);
				}
				else if(!unit.combat.reserve) {
					var s = new token(unit,actions["ready"]);
					unit.fleet = "defender";
					stack.push(s);
				}
			}
		});

		while(stack.length > 0) {
			var t = stack.shift();
			var unit = t.unit;
			var action = t.action;
			eval(action.script);
		}

		// Check for destroyed units
		_.each(combat.fleets,function(fleet) {
			var count = 0;
			_.each(fleet.units,function(unit) {
				if(unit.combat.destroyed) {
					count++;
					console.log(unit.unit.name + " is destroyed");
				}
			});
			fleet.combat.loseCount = count;
		});

		// Check for end of combat
		_.each(combat.fleets,function(fleet) {
			console.log(fleet.name + ": " + fleet.combat.loseCount + " of " + fleet.combat.unitCount);
			if(fleet.combat.loseCount >= fleet.combat.unitCount) {
				combat.status = combat.statuses.done;
				m.done = true;
			}
		});

		var m = new message(combat.turn);
		m.logs = logs;
		self.postMessage(m);
	}
}

self.onmessage = function(event) {
	combat.fleets = event.data;
	doCombatSimulation();
};