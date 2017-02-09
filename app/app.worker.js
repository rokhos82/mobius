var combat = {};
combat.statuses = {
		starting: "starting",
		running: "running",
		done: "done"
};
combat.status = combat.statuses.starting;
combat.turn = 0;
combat.maxTurn = 1;
combat.fleets = undefined;

combat.setup = {
	baseToHit: 50
};

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
	},
	unitApplyDamage: function(unit,damage) {
		if(unit.shield && unit.shield.current > 0) {
			unit.shield.current -= t.damage;
			unit.shield.current = unit.shield.current < 0 ? 0 : unit.shield.current;
		}
		else {
			unit.hull.current -= t.damage;
			unit.combat.destroyed = unit.hull.current <= 0 ? true : false;
		}
	},
	processUnitTags: function(unit,stage,pre) {
		if(pre) {
			// Do preprocess unit tags for 'stage'
		}
		else {
			// Do postprocess unit tags for 'stage'
		}
	},
	processCombatTags: function(unit,stage,pre) {
		if(pre) {
			// Do preprocess combat tags for 'stage'
		}
		else {
			// Do postprocess combat tags for 'stage'
		}
	},
	processWeaponTags: function(unit,weapon,stage,pre) {
		if(pre) {
			// Do preprocess weapon tags for 'stage'
		}
		else {
			// Do postprocess weapon tags for 'stage'
		}
	}
};

// Combat Turn Token Object ------------------------------------------------------------------------
combat.token = function(unit,act) {
	this.action = _.bind(act,this);
	this.unit = unit;
	this.priority = 0;
};

// Ready a unit for the combat turn ----------------------------------------------------------------
combat.functions.ready = function(stack) {
	console.groupCollapsed("Ready - " + this.unit.unit.name);
	var unit = this.unit;

	// Run preprocess 'ready' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	combat.functions.processUnitTags(unit,'ready',true);
	combat.functions.processCombatTags(unit,'ready',true);

	// Should we skip this unit this turn?
	if(unit.combat.skip) {
		console.warn("Unit is skipping combat this turn.");
		return;
	}

	// Build a token for each direct fire weapon group definition
	console.groupCollapsed("Direct fire weapon groups.");
	_.each(unit["direct-fire"],function(weapon) {
		// Run preprocess 'ready' scripts for weapon tags
		console.info("Begin weapon preprocess scripts.");
		combat.functions.processWeaponTags(unit,weapon,'ready',true);

		// Should we skip this set of batteries?
		if(!weapon.skip) {
			// Build a token for each battery in this weapon definition
			for(var i = 0;i < weapon.batteries;i++) {
				var token = new combat.token(unit,combat.functions.aim);
				token.weapon = weapon;
				stack.push(token);
			}
		}

		// Run postprocess 'ready' scripts for weapon tags
		console.info("Begin weapon postprocess scripts.");
		combat.functions.processWeaponTags(unit,weapon,'ready',false);
	});
	console.groupEnd();

	// Build a token for each packet fire weapon group definition
	console.groupCollapsed("Packet fire weapon groups.");
	_.each(unit["packet-fire"],function(weapon) {
		// Run preprocess 'ready' scripts for weapon tags
		console.info("Begin weapon preprocess scripts.");
		combat.functions.processWeaponTags(unit,weapon,'ready',true);

		// Should we skip this set of packets?
		if(!weapon.skip) {
			// Build a token for each packet in this weapon definition
			for(var i = 0;i < weapon.packets;i++) {
				var token = new combat.token(unit,combat.functions.aim);
				token.weapon = weapon;
				stack.push(token);
			}
		}

		// Run postprocess 'ready' scripts for weapon tags
		console.info("Begin weapon postprocess scripts.");
		combat.functions.processWeaponTags(unit,weapon,'ready',false);
	});
	console.groupEnd();

	// Run postprocess 'ready' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	combat.functions.processUnitTags(unit,'ready',false);
	combat.functions.processCombatTags(unit,'ready',false);

	// End console message grouping
	console.groupEnd();
};
// Select a target for the weapon ------------------------------------------------------------------
combat.functions.aim = function(stack) {
	console.groupCollapsed("Aim - " + this.unit.unit.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = undefined;

	// Run preprocess 'aim' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	combat.functions.processUnitTags(unit,'aim',true);
	combat.functions.processCombatTags(unit,'aim',true);

	// Run preprocess 'aim' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	combat.functions.processWeaponTags(unit,weapon,'aim',true);

	// Select a target for the weapon
	target = combat.functions.getTarget(unit);

	// Run postprocess 'aim' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	combat.functions.processWeaponTags(unit,weapon,'aim',false);

	// Run postprocess 'aim' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	combat.functions.processUnitTags(unit,'aim',false);
	combat.functions.processCombatTags(unit,'aim',false);

	// Add the target to the token, set the next action, and push the token on to the stack.
	this.target = target;
	this.action = combat.functions.fire;
	stack.push(this);

	console.groupEnd();
};
// Fire the weapon at the target -------------------------------------------------------------------
combat.functions.fire = function(stack,logs) {
	console.groupCollapsed("Fire - " + this.unit.unit.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var volley = undefined;
	var damagePercent = undefined;
	var damage = undefined;
	var message = unit.unit.name + " fires at " + target.unit.name + " and ";

	// Run preprocess 'fire' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	combat.functions.processUnitTags(unit,'fire',true);
	combat.functions.processCombatTags(unit,'fire',true);

	// Run preprocess 'fire' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	combat.functions.processWeaponTags(unit,weapon,'fire',true);

	// Fire the weapon at the target
	var hitRoll = _.random(1,100);
	var hitTarget = combat.setup.baseToHit + (weapon.target || 0) + combat.functions.unitTargetBonus(unit) - combat.functions.unitDefenseBonus(target);
	hitTarget = (hitTarget >= 90) ? 90 : hitTarget; // Max hit chance is 90%
	hitTarget = (hitTarget <= 10) ? 10 : hitTarget; // Min hit chance is 10%

	// Was the target hit?
	var hitSuccess = (hitRoll < hitTarget);
	if(hitSuccess) {
		// We scored a hit!  How much damage do we do?
		damagePercent = _.random(1,100) + (weapon.yield || 0) + combat.functions.unitYieldBonus(unit) - combat.functions.unitResistBonus(target);
		damagePercent = damagePercent > 100 ? 100 : damagePercent;
		damagePercent = damagePercent < 0 ? 0 : damagePercent;
		
		damage = (volley || weapon.volley) * damagePercent / 100;
		message += "hits (" + hitRoll + "/" + hitTarget + ") for " + damage + "(" + damagePercent + "%)";
	}
	else {
		message += "missies.";
	}

	// Run postprocess 'fire' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	combat.functions.processWeaponTags(unit,weapon,'fire',false);

	// Run postprocess 'fire' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	combat.functions.processUnitTags(unit,'fire',false);
	combat.functions.processCombatTags(unit,'fire',false);

	this.damage = damage;
	this.action = combat.functions.resolve;
	stack.push(this);
	logs.push(message);

	console.groupEnd();
};
// Resolve the damage incoming to the target -------------------------------------------------------
combat.functions.resolve = function(stack) {
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var damage = this.damage;
};
// Determine if a critical hit happened and what critical hit it is --------------------------------
combat.functions.crit = function() {};
// Display a message to the log --------------------------------------------------------------------
combat.functions.tap = function() {
	// Pose the message to the console log
	console.log(this.msg);
};

/*
weight	crit
		+2 damage
		+3 damage
		reactor breach (insta-kill,unit cannot be salvaged)
		fire control disrupt (1 turn)
		fire control disabled (no weapons until repaired)
		life support (insta-kill, unit can be salvaged)
		crew casualties (-5% per hit)
		engine disrupt (1 turn, no mobility related bonuses)
		engine disable (no engines until repaired, no movement/mobility related bonuses)
*/
var critTable = {
	"default": [
		{
			"weight": 10,
			"msg": "Thar she blows! (+2 damage)",
			"effect": 't.damage += 2;'
		}
	]
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
	if(_.isNumber(weapon.short)) { eval(tags.short.ready); }\
	if(!weapon.skip) {\
		for(var i = 0;i < weapon.batteries;i++) {\
			var t = new token(unit,actions["target"]);\
			t.weapon = weapon;\
			if (weapon.sticky) {\
				eval(tags.sticky.ready);\
			}\
			stack.push(t);\
		}\
	}\
});\
_.each(unit["packet-fire"],function(weapon) {\
	if(_.isNumber(weapon.short)) { eval(tags.short.ready); }\
	if(!weapon.skip) {\
		for(var i = 0;i < weapon.packets;i++) {\
			var t = new token(unit,actions["target"]);\
			t.weapon = weapon;\
			if(weapon.sticky) {\
				eval(tags.sticky.ready);\
			}\
			stack.push(t);\
		}\
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
}\
if(unit.combat.sticky) { eval(tags.sticky.resolve); }',
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
	// crit
	"crit": {
		"script": 'console.log("So, a crit happened.  You should probably look into that.");',
		"name": "crit"
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
	"short": {
		"ready":
'if(weapon.short > 0) {\
	weapon.short--;\
	weapon.skip = true;\
} else {\
	weapon.skip = false;\
}'
	},
	"long": {},
	"ammo": {
		"ready": 'if(weapon.ammo < 0) { weapon.skip = true; }',
		"target": '',
		"damage": '',
		"resolve": 'weapon.ammo--;'
	}
};

var lists = {};
lists.weaponTags = ["sticky","short","ammo"];
lists.unitTags = ["reserve"];

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
		console.groupCollapsed("Turn: " + combat.turn);
		if(combat.maxTurn !== 0 && combat.turn > combat.maxTurn) {
			combat.status = combat.statuses.done;
			console.groupEnd();
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
					var s = new combat.token(unit,combat.functions.ready);
					unit.fleet = "attacker";
					stack.push(s);
				}
				else if(!unit.combat.reserve) {
					var s = new combat.token(unit,combat.functions.ready);
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
					var s = new combat.token(unit,combat.functions.ready);
					unit.fleet = "defender";
					stack.push(s);
					delete unit.combat.reserve;
					combat.targets.attacker.push(unit.unit.name);
				}
				else if(!unit.combat.reserve) {
					var s = new combat.token(unit,combat.functions.ready);
					unit.fleet = "defender";
					stack.push(s);
				}
			}
		});

		while(stack.length > 0) {
			var token = stack.shift();
			var unit = token.unit;
			token.action(stack,logs);
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

		console.groupEnd();
	}

	close();
}

self.onmessage = function(event) {
	combat.fleets = event.data;
	doCombatSimulation();
};