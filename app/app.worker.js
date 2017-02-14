self.importScripts("../js/underscore.js");

_.mixin({
	"deep":function(object){
		return JSON.parse(JSON.stringify(object));
	},
	"table":function(table){
		var roll = _.random(1,_.max(table,function(crit){ return crit.threshold; }).threshold);
		console.log(roll);
		var entry = undefined;
		_.each(table,function(crit) {
			if(roll <= crit.threshold) {
				if(!entry) { entry = crit; }
			}
		});
		return entry;
	}
});

var combat = {};
combat.statuses = {
		starting: "starting",
		running: "running",
		done: "done"
};
combat.status = combat.statuses.starting;
combat.turn = 0;
combat.maxTurn = 100;
combat.fleets = undefined;

combat.setup = {
	baseToHit: 50,
	debug: true
};

combat.filters = {
	"destroyed": function(unit) { return unit.combat.destroyed; },
	"reserve": function(unit) { return unit.combat.reserve; },
	"untargetable": function(unit) { return (!unit.combat.destroyed && !unit.combat.reserve); },
	"long": function(unit) { var l = false; _.each(unit["direct-fire"],function(weapon){ if(weapon.long) { l=true; } }); _.each(unit["packet-fire"],function(weapon){ if(weapon.log) { l=true; } }); return l; }
};

// Utility Functions -------------------------------------------------------------------------------
combat.functions = {
	getTarget: function(unit) {
		var fleet = unit.fleet;
		var enemy = combat.fleets[fleet].enemy;
		var targetList = _.filter(combat.fleets[enemy].units,combat.filters.untargetable);
		var target = _.sample(targetList);
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
	determineCrits: function(unit,table) {
		crits = [];
		if(unit.hull.current <= Math.round(unit.hull.max*.75) && !unit.combat.crit.first && unit.unit.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("First Crit - " + crit);
			unit.combat.crit.first = crit;
		}
		if(unit.hull.current <= Math.round(unit.hull.max*.5) && !unit.combat.crit.second && unit.unit.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("Second Crit - " + crit);
			unit.combat.crit.second = crit;
		}
		if(unit.hull.current <= Math.round(unit.hull.max*.25) && !unit.combat.crit.third && unit.unit.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("Third Crit - " + crit);
			unit.combat.crit.third = crit;
		}
		if(unit.hull.current <= 0 && !unit.combat.crit.fourth && unit.unit.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("Fourth Crit - " + crit);
			unit.combat.crit.fourth = crit;
		}
		return crits;
	}
};

// Combat Turn Token Object ------------------------------------------------------------------------
combat.token = function(unit,act) {
	this.action = _.bind(act,this);
	this.unit = unit;
	this.priority = 0;
};

// Combat Log Entry Objects ------------------------------------------------------------------------
combat.logs = {};

// Main Log Object
combat.logs.log = function(turn) {
	this.turn = turn;
	this.fleetInfo = {};
};
combat.logs.log.prototype.push = function(unit,msg) {
	var fleet = unit.fleet;
	var key = unit.unit.name;
	this.init(fleet,key);
	this.fleetInfo[fleet].unitInfo[key].log.push(msg);
};
combat.logs.log.prototype.init = function(fleet,unit) {
	this.fleetInfo[fleet] = (this.fleetInfo[fleet] || {unitInfo:{}});
	this.fleetInfo[fleet].unitInfo[unit] = (this.fleetInfo[fleet].unitInfo[unit] || {log:[],hit:0,shot:0});
};
combat.logs.log.prototype.addHit = function(unit) {
	var fleet = unit.fleet;
	var key = unit.unit.name;
	this.init(fleet,key);
	this.fleetInfo[fleet].unitInfo[key].hit++;
};
combat.logs.log.prototype.addShot = function(unit) {
	var fleet = unit.fleet;
	var key = unit.unit.name;
	this.init(fleet,key);
	this.fleetInfo[fleet].unitInfo[key].shot++;
};

// Log Entry Object
combat.logs.entry = function(unit,msg) {
};

// Unit/Weapon Tags --------------------------------------------------------------------------------
combat.tags = {
	"sticky": {
		"ready": {
			"pre": 'if(!_.isObject(weapon.sticky)) { weapon.sticky = {index:0, max:(weapon.volley.length-1),target:undefined}; }',
			"post": 'if(weapon.sticky.index > weapon.sticky.max) { weapon.sticky.index = 0; }'
		},
		"aim": {
			"pre": 'target = weapon.sticky.target',
			"post": ''
		},
		"fire": {
			"pre": 'volley = weapon.volley[weapon.sticky.index];',
			"post": 'if(hitSuccess) { weapon.sticky.index++; weapon.sticky.target = target; }'
		},
		"resolve": {
			"pre": '',
			"post": ''
		},
		"crit": {
			"pre": '',
			"post": 'if(target.combat.destroyed) { weapon.sticky.target = undefined; }',
		}
	},
	"short": {
		"ready": {
			"pre": 'if(weapon.short > 0) { weapon.skip = true; }',
			"post": 'weapon.short--;'
		},
		"aim": {
			"pre": '',
			"post": ''
		},
		"fire": {
			"pre": '',
			"post": ''
		},
		"resolve": {
			"pre": '',
			"post": ''
		},
		"crit": {
			"pre": '',
			"post": ''
		}
	},
	"ammo": {
		"ready": {
			"pre": 'if(weapon.ammo <= 0) { weapon.skip = true; }',
			"post": 'weapon.ammo--;'
		},
		"aim": {
			"pre": '',
			"post": ''
		},
		"fire": {
			"pre": '',
			"post": ''
		},
		"resolve": {
			"pre": '',
			"post": ''
		},
		"crit": {
			"pre": '',
			"post": ''
		}
	}
};

// Crit Tables -------------------------------------------------------------------------------------
combat.crits = {
	"default": [
		{weight:15,threshold:15,msg:"+2 damage",script:''},
		{weight:5,threshold:20,msg:"+3 damage",script:''},
		{weight:1,threshold:21,msg:"reactor breach (insta-kill,unit cannot be salvaged)",script:''},
		{weight:20,threshold:41,msg:"fire control disrupt (1 turn)",script:''},
		{weight:5,threshold:46,msg:"fire control disabled (no weapons until repaired)",script:''},
		{weight:1,threshold:47,msg:"life support (insta-kill, unit can be salvaged)",script:''},
		{weight:20,threshold:67,msg:"crew casualties (-5% per hit)",script:''},
		{weight:15,threshold:82,msg:"engine disrupt (1 turn, no mobility related bonuses)",script:''},
		{weight:5,threshold:87,msg:"engine disable (no engines until repaired, no movement/mobility related bonuses)",script:''},
		{weight:2,threshold:89,msg:"bridge hit (CIC destroyed, captain killed)",script:''}
	]
};

// Ready a unit for the combat turn ----------------------------------------------------------------
combat.functions.ready = function(stack,logs) {
	console.groupCollapsed("Ready - " + this.unit.unit.name);
	var unit = this.unit;

	// Run preprocess 'ready' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });

	// Should we skip this unit this turn?
	if(unit.combat.skip) {
		console.warn("Unit is skipping combat this turn.");
		console.groupEnd();
		return;
	}

	// Build a token for each direct fire weapon group definition
	_.each(unit["direct-fire"],function(weapon) {
		// Reset the skip flag
		weapon.skip = false;

		// Run preprocess 'ready' scripts for weapon tags
		console.info("Begin weapon preprocess scripts.");
		_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });

		// Should we skip this set of batteries?
		if(!weapon.skip) {
			// Build a token for each battery in this weapon definition
			for(var i = 0;i < weapon.batteries;i++) {
				var token = new combat.token(unit,combat.functions.aim);
				token.weapon = _.deep(weapon);
				logs.addShot(unit);
				stack.push(token);
			}
		}
		else {
			console.log("Skipping weapon group");
		}

		// Run postprocess 'ready' scripts for weapon tags
		console.info("Begin weapon postprocess scripts.");
		_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });
	});
	
	// Build a token for each packet fire weapon group definition
	_.each(unit["packet-fire"],function(weapon) {
		// Run preprocess 'ready' scripts for weapon tags
		console.info("Begin weapon preprocess scripts.");
		_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });

		// Should we skip this set of packets?
		if(!weapon.skip) {
			// Build a token for each packet in this weapon definition
			for(var i = 0;i < weapon.packets;i++) {
				var token = new combat.token(unit,combat.functions.aim);
				token.weapon = _.deep(weapon);
				stack.push(token);
			}
		}

		// Run postprocess 'ready' scripts for weapon tags
		console.info("Begin weapon postprocess scripts.");
		_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });
	});

	// Run postprocess 'ready' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });

	// End console message grouping
	console.groupEnd();
};

// Select a target for the weapon ------------------------------------------------------------------
combat.functions.aim = function(stack,logs) {
	console.groupCollapsed("Aim - " + this.unit.unit.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = undefined;

	// Run preprocess 'aim' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.pre); } });

	// Run preprocess 'aim' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.pre); } });

	// Select a target for the weapon unless one has already been provided.
	if(_.isUndefined(target)) {
		target = combat.functions.getTarget(unit);
	}

	// Run postprocess 'aim' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.post); } });

	// Run postprocess 'aim' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.post); } });

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
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });

	// Run preprocess 'fire' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });

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
		damagePercent = damagePercent < 25 ? 25 : damagePercent;
		
		volley = _.isUndefined(volley) ? weapon.volley : volley;
		damage = Math.round(volley * damagePercent / 100);
		message += "hits (" + hitRoll + "/" + hitTarget + ") for " + damage + "(" + damagePercent + "%)";

		this.damage = damage;
		this.action = combat.functions.resolve;
		stack.push(this);
		logs.addHit(unit);
	}
	else {
		message += "missies (" + hitRoll + "/" + hitTarget + ")";
	}

	// Run postprocess 'fire' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.post); } });

	// Run postprocess 'fire' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.post); } });

	logs.push(unit,message);

	console.groupEnd();
};
// Resolve the damage incoming to the target -------------------------------------------------------
combat.functions.resolve = function(stack,logs) {
	console.groupCollapsed("Resolve - " + this.unit.unit.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var damage = this.damage;
	var defense = undefined;

	// Run preprocess 'resolve' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });

	// Run preprocess 'resolve' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });

	// Which defense system are we using?
	var defense = (!defense && target.shield.current > 0) ? "shield" : "hull";
	this.defense = defense;

	// Apply damage to the defense system
	target[defense].current -= damage;

	// Shoud there be a crit?
	var crits = combat.functions.determineCrits(target);
	_.each(crits,function(crit) {
		eval(crit.script);
		logs.push(target,target.unit.name + " was crit -- " + crit.msg);
	});

	// Is the unit destroyed?
	if(target.hull.current <= 0) {
		target.combat.destroyed = true;
		logs.push(target,target.unit.name + " has been destroyed!");
	}

	// Run postprocess 'resolve' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });

	// Run postprocess 'resolve' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });

	this.action = combat.functions.crit;
	stack.push(this);

	console.groupEnd();
};
// Determine if a critical hit happened and what critical hit it is --------------------------------
combat.functions.crit = function(stack,logs) {
	console.groupCollapsed("Crit - " + this.unit.unit.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var damage = this.damage;
	var defense = this.defense;

	// Run preprocess 'crit' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].crit.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].crit.pre); } });

	// Run preprocess 'crit' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].crit.pre); } });

	// Run postprocess 'crit' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].crit.post); } });

	// Run postprocess 'crit' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.unit,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].crit.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].crit.post); } });

	console.groupEnd();
};
// Display a message to the log --------------------------------------------------------------------
combat.functions.tap = function() {
	// Pose the message to the console log
	console.log(this.msg);
};

var message = function(t) {
	this.turn = t;
	this.fleets = combat.fleets;
	this.done = false;
};

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

// Process a combat stack --------------------------------------------------------------------------
function processStack(stack,logs) {
	while(stack.length > 0) {
		var token = stack.shift();
		var unit = token.unit;
		token.action(stack,logs);
	}
}

// Main Combat Simulation Loop ---------------------------------------------------------------------
function doCombatSimulation() {
	// Fleet initialization
	combat.fleets.attacker.enemy = "defender";
	combat.fleets.defender.enemy = "attacker";
	_.each(combat.fleets,function(fleet) {
		fleet.combat.loseCount = 0;
	});

	// Check for long range weapons
	console.groupCollapsed("Precombat Actions");
	var longStack = [];
	_.each(combat.fleets,function(fleet,key){
		_.each(fleet.units,function(unit){
			_.each(unit["direct-fire"],function(weapon) {
				if(_.has(weapon,"long")) {
					var token = new combat.token(unit,combat.functions.ready);
					unit.fleet = key;
					longStack.push(token);
				}
			});
			_.each(unit["packet-fire"],function(weapon) {
				if(_.has(weapon,"long")) {
					var token = new combat.token(unit,combat.functions.ready);
					unit.fleet = key;
					longStack.push(token);
				}
			});
		});
	});
	processStack(longStack,logs);
	console.groupEnd();

	// Run the main combat loop.
	while(combat.status !== combat.statuses.done) {
		// Update the combat turn.
		combat.turn++;

		// Have we exceeded the maximum number of turns?
		if(combat.maxTurn !== 0 && combat.turn > combat.maxTurn) {
			combat.status = combat.statuses.done;
			continue;
		}//*/

		// Begin the logging group for the turn.
		console.groupCollapsed("Turn: " + combat.turn);

		// Combat Action Stack
		var stack = [];

		// Log Entry array
		var logs = new combat.logs.log(combat.turn);

		// Setup the initial ready action tokens for the attacking fleet.
		_.each(combat.fleets.attacker.units,function(unit) {
			// Initailize the unit's combat object if needed.
			unit.combat = (unit.combat || {});

			// Setup the crit flags for the unit
			unit.combat.crit = (unit.combat.crit || {});
			_.defaults(unit.combat.crit,{first:false,second:false,third:false,fourth:false});

			// Is the unit a reserve unit?
			if(unit.unit.reserve && !unit.combat.reserve) {
				// Initialize the number of units in the fleet for the unit to be in reserve.
				unit.combat.reserve = Math.ceil(unit.unit.reserve / 100 * (combat.fleets.attacker.combat.unitCount - 1));
			}
			
			// Is the unit destroyed?
			if(!unit.combat.destroyed) {
				// The unit is still operational.  Assume it needs to be readied.
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
				}
			}
		});
		// Setup the initial ready action tokens for the defending fleet.
		_.each(combat.fleets.defender.units,function(unit) {
			if(!_.isObject(unit.combat)) {
				unit.combat = {};
			}

			unit.combat.crit = {};
			_.defaults(unit.combat.crit,{first:false,second:false,third:false,fourth:false});


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
				}
				else if(!unit.combat.reserve) {
					var s = new combat.token(unit,combat.functions.ready);
					unit.fleet = "defender";
					stack.push(s);
				}
			}
		});

		processStack(stack,logs);

		// Check for destroyed units
		_.each(combat.fleets,function(fleet) {
			var count = 0;
			_.each(fleet.units,function(unit) {
				if(unit.combat.destroyed) {
					count++;
				}
			});
			fleet.combat.loseCount = count;
		});

		var m = new message(combat.turn);

		// Check for end of combat
		_.each(combat.fleets,function(fleet) {
			if(fleet.combat.loseCount >= fleet.combat.unitCount) {
				combat.status = combat.statuses.done;
				m.done = true;
			}
		});
		
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