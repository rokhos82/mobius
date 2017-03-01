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
	"untargetable": function(unit) { return (!this.units[unit].combat.destroyed && !this.units[unit].combat.reserve && !this.units[unit].combat.fled); },
	"long": function(unit) { var l = false; _.each(unit["direct-fire"],function(weapon){ if(weapon.long) { l=true; } }); _.each(unit["packet-fire"],function(weapon){ if(weapon.log) { l=true; } }); return l; }
};

combat.defaults = {};
combat.defaults.fleets = {
	"combat": {}
};
combat.defaults.tag = {
	"ready": {
		"pre": '',
		"post": ''
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
	"cleanup": {
		"pre": '',
		"post": ''
	},
	"flee": {
		"pre": '',
		"post": ''
	},
	"long": {
		"pre": '',
		"post": ''
	}
};

// Utility Functions -------------------------------------------------------------------------------
combat.functions = {
	getTarget: function(unit) {
		var fleet = unit.fleet;
		var enemy = combat.fleets[fleet].enemy;
		var targetList = _.chain(combat.fleets[enemy].units).keys().filter(combat.filters.untargetable,combat.fleets[enemy]).value();
		console.log(targetList);
		var target = _.sample(targetList);
		console.log(target);
		return combat.fleets[enemy].units[target];
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
		if(unit.hull.current <= Math.round(unit.hull.max*.75) && !unit.combat.crit.first && unit.general.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("First Crit - " + crit);
			unit.combat.crit.first = crit;
		}
		if(unit.hull.current <= Math.round(unit.hull.max*.5) && !unit.combat.crit.second && unit.general.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("Second Crit - " + crit);
			unit.combat.crit.second = crit;
		}
		if(unit.hull.current <= Math.round(unit.hull.max*.25) && !unit.combat.crit.third && unit.general.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("Third Crit - " + crit);
			unit.combat.crit.third = crit;
		}
		if(unit.hull.current <= 0 && !unit.combat.crit.fourth && unit.general.type !== "Fighter") {
			var crit = _.table(combat.crits.default);
			crits.push(crit);
			console.log("Fourth Crit - " + crit);
			unit.combat.crit.fourth = crit;
		}
		return crits;
	},
	unitDefaults: function(unit) {
		var def = {
			combat: {
				crit: {first:false,second:false,third:false,fourth:false}
			}
		};
		_.defaults(unit,def);
	},
	fleetBreakoff: function(fleet) {
		var flt = combat.fleets[fleet];
		var breakCount = Math.ceil(flt.combat.unitCount * flt.breakoff / 100);
		var b = false;
		if(flt.combat.loseCount >= breakCount)
			b = true;
		return b;
	},
	hasLongWeapon: function(unit) {		
		var long = false;
		_.each(unit["direct-fire"],function(weapon) {
			if(_.has(weapon,"long")) {
				long = true;
			}
		});
		_.each(unit["packet-fire"],function(weapon) {
			if(_.has(weapon,"long")) {
				long = true;
			}
		});
		return long;
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
	var key = unit.general.name;
	this.init(fleet,key);
	this.fleetInfo[fleet].unitInfo[key].log.push(msg);
};
combat.logs.log.prototype.init = function(fleet,unit) {
	this.fleetInfo[fleet] = (this.fleetInfo[fleet] || {unitInfo:{},fleet:combat.fleets[fleet]});
	this.fleetInfo[fleet].unitInfo[unit] = (this.fleetInfo[fleet].unitInfo[unit] || {log:[],hit:0,shot:0,unit:combat.fleets[fleet].units[unit]});
};
combat.logs.log.prototype.addHit = function(unit) {
	var fleet = unit.fleet;
	var key = unit.general.name;
	this.init(fleet,key);
	this.fleetInfo[fleet].unitInfo[key].hit++;
};
combat.logs.log.prototype.addShot = function(unit) {
	var fleet = unit.fleet;
	var key = unit.general.name;
	this.init(fleet,key);
	this.fleetInfo[fleet].unitInfo[key].shot++;
};

// Log Entry Object
combat.logs.entry = function(unit,msg) {
};

// Unit/Weapon Tags --------------------------------------------------------------------------------
combat.tags = {};

combat.tags["sticky"] = _.deep(combat.defaults.tag);
combat.tags["sticky"].ready.pre = 'if(!_.isObject(weapon.sticky)) { weapon.sticky = {index:0, max:(weapon.volley.length-1),target:undefined}; }';
combat.tags["sticky"].ready.post = 'if(weapon.sticky.index > weapon.sticky.max) { weapon.sticky.index = 0; }';
combat.tags["sticky"].aim.pre = 'if(!_.isObject(weapon.sticky)) { weapon.sticky = {index:0, max:(weapon.volley.length-1),target:undefined}; }';
combat.tags["sticky"].fire.pre = 'volley = weapon.volley[weapon.sticky.index];';
combat.tags["sticky"].fire.post = 'if(hitSuccess) { weapon.sticky.index++; weapon.sticky.target = target; }';
combat.tags["sticky"].cleanup.post = 'if(target.combat.destroyed) { weapon.sticky.target = undefined; }';

combat.tags["short"] = _.deep(combat.defaults.tag);
combat.tags["short"].ready.pre = 'if(weapon.short > 0) { weapon.skip = true; }';
combat.tags["short"].ready.post = 'weapon.short--;';

combat.tags["ammo"] = _.deep(combat.defaults.tag);
combat.tags["ammo"].ready.pre = 'if(weapon.ammo <= 0) { weapon.skip = true; }';
combat.tags["ammo"].ready.post = 'weapon.ammo--;';

combat.tags["long"] = _.deep(combat.defaults.tag);
combat.tags["long"].long.post = 'weapon.long--;';
combat.tags["long"].cleanup.post = 'if(weapon.long > 0) { stack.push(new combat.token(unit,combat.functions.ready)); }';

combat.tags["deflect"] = _.deep(combat.defaults.tag);
combat.tags["deflect"].fire.post = 'if(hitSuccess) { message += " " + ((target[defense].deflect || 0) * (weapon.guns || 1)) + " damage deflected"; }';
combat.tags["deflect"].resolve.pre = 'damage -= (target[defense].deflect || 0) * (weapon.guns || 1);';

combat.tags["offline"] = _.deep(combat.defaults.tag);
combat.tags["offline"].ready.pre = 'if(weapon.offline > 0 ) { weapon.skip = true; }';
combat.tags["offline"].ready.post = "weapon.offline--;"

combat.tags["fireRate"] = _.deep(combat.defaults.tag);
combat.tags["fireRate"].ready.pre = 'if(weapon.fireRate.step < weapon.fireRate.interval) { weapon.skip = true; }';
combat.tags["fireRate"].ready.post = 'weapon.fireRate.step++; weapon.fireRate.step = (weapon.fireRate.step > weapon.fireRate.interval) ? 1 : weapon.fireRate.step;';

combat.tags["low"] = _.deep(combat.defaults.tag);
combat.tags["low"].resolve.pre = 'if(defense == "shield") { damage = 0; }';

// Crit Tables -------------------------------------------------------------------------------------
combat.crits = {
	"default": [
		{weight:1,threshold:1,msg:"Reactor Core Breach (Ship explodes)",script:'target.combat.destroyed = true;'},
		{weight:2,threshold:3,msg:"Structural Collapse (+3 damage)",script:'damage += 3;'},
		{weight:2,threshold:5,msg:"Explosion Amidships (+2 damage)",script:'damage += 2;'},
		{weight:2,threshold:7,msg:"Superstructure Hit (+1 damage)",script:'damage += 1;'},
		{weight:2,threshold:9,msg:"Inertial Dampeners Down (+1 damage)",script:'damage += 1;'},
		{weight:4,threshold:13,msg:"Weapons Damaged (Offline until repaired)",script:'target.combat.flee = true;'},
		{weight:2,threshold:15,msg:"Radiation Leak (+5% crew casualties)",script:''},
		{weight:2,threshold:17,msg:"Coolant Leak (+5% crew casualties)",script:''},
		{weight:2,threshold:19,msg:"Hull Breach (+5% crew casualties)",script:''},
		{weight:2,threshold:21,msg:"Main Fusion Reactors Down (+1 damage)",script:'damage += 1;'},
		{weight:2,threshold:23,msg:"Auxiliary Fusion Reactors Down (+1 damage)",script:'damage += 1;'},
		{weight:4,threshold:27,msg:"Weapon Power Short (Some offline until repaired)",script:''},
		{weight:4,threshold:31,msg:"Engine Power Short (Drifting for 1 turn)",script:''},
		{weight:2,threshold:33,msg:"Shuttle/Fighter Bay Hit",script:''},
		{weight:2,threshold:35,msg:"Main Fire Control Out (Offline for 1 turn)",script:''},
		{weight:2,threshold:37,msg:"Main Scanners Out (Offline for 1 turn)",script:''},
		{weight:2,threshold:39,msg:"Maglock/Tractor Beams Down",script:''},
		{weight:2,threshold:41,msg:"Main Bridge Hit (Bridge crew killed, Offline for 1 turn)",script:''},
		{weight:2,threshold:43,msg:"Main Engineering Hit (Drifting for 1 turn)",script:''},
		{weight:4,threshold:47,msg:"Warp Engine Hit (No warp movement until repaired)",script:''},
		{weight:2,threshold:49,msg:"Barracks/Cargo Holds Breached (+5% crew casualties)",script:''},
		{weight:2,threshold:51,msg:"Warp Drive Down (No warp movement until repaired)",script:''},
		{weight:2,threshold:53,msg:"Crew Quarters Breached (+5% crew casualties)",script:''},
		{weight:2,threshold:55,msg:"Impulse Engines Down (Drifting for 1 turn)",script:''},
		{weight:2,threshold:57,msg:"Auxiliary Scanners Out",script:''},
		{weight:2,threshold:59,msg:"Weapon Power Couplings Down (Offline until repaired)",script:'target.combat.flee = true;'},
		{weight:2,threshold:61,msg:"Emergency Power Out",script:''},
		{weight:2,threshold:63,msg:"Primary Life Support Out (+10% crew casualties)",script:''},
		{weight:2,threshold:65,msg:"Navigational Deflectors Out (No warp movement until repaired)",script:''},
		{weight:2,threshold:67,msg:"Internal Damage (+10% crew casualties)",script:''},
		{weight:2,threshold:69,msg:"Main Computer Down (Offline for 1 turn)",script:''},
		{weight:2,threshold:71,msg:"Internal Damage (+5% crew casualties)",script:''},
		{weight:2,threshold:73,msg:"Emergency Life Support Out (+5% crew casualties)",script:''},
		{weight:2,threshold:75,msg:"Auxiliary Computer Down",script:''},
		{weight:2,threshold:77,msg:"Auxiliary Fire Control Out",script:''},
		{weight:2,threshold:79,msg:"Fire: Level 1 (+1 damage)",script:'damage += 1;'},
		{weight:2,threshold:81,msg:"Explosion Amidships (+1 damage)",script:'damage += 1;'},
		{weight:2,threshold:83,msg:"ECM/Cloaking Systems Out",script:''},
		{weight:2,threshold:85,msg:"Fire: Level 2 (+2 damage)",script:'damage += 2;'},
		{weight:2,threshold:87,msg:"Explosion Amidships (+2 damage)",script:'damage += 2;'},
		{weight:2,threshold:89,msg:"Ammunition Bay/Magazine Explosion (+Tp damage)",script:''},
		{weight:2,threshold:91,msg:"Fire: Level 3 (+3 damage)",script:'damage += 3;'},
		{weight:2,threshold:93,msg:"Auxiliary Bridge Hit",script:''},
		{weight:2,threshold:95,msg:"Explosive Chain Reaction (+4 damage)",script:'damage += 4;'},
		{weight:2,threshold:97,msg:"All Sensors Out (Offline and no movement until repaired)",script:''},
		{weight:2,threshold:99,msg:"Shield Power Couplings Down (Sh=0 until repaired)",script:'target.shield.current = 0;'},
		{weight:1,threshold:100,msg:"Reactor Containment Failure (Ship explodes)",script:'target.combat.destroyed = true;'}
	]
};

// Ready a unit for the combat turn ----------------------------------------------------------------
combat.functions.ready = function(stack,logs) {
	console.groupCollapsed("Ready - " + this.unit.general.name);
	var unit = this.unit;
	var breakoff = combat.functions.fleetBreakoff(unit.fleet);

	// Run preprocess 'ready' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });

	// Log a message about readying the unit
	logs.push(unit,unit.general.name + " readying for the combat round");

	// Should we skip this unit this turn?
	if(unit.combat.skip) {
		// Push the cleanup event to the back of the queue.
		stack.push(new combat.token(unit,combat.functions.cleanup));
		console.warn("Unit is skipping combat this turn.");
	}
	else if(breakoff) {
		// The unit should flee due to breakoff level on fleet
		stack.push(new combat.token(unit,combat.functions.flee));
	}
	else {
		// Push the cleanup event to the back of the queue.
		stack.push(new combat.token(unit,combat.functions.cleanup));

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
					stack.unshift(token);
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
			// Reset the skip flag
			weapon.skip = false;

			// Run preprocess 'ready' scripts for weapon tags
			console.info("Begin weapon preprocess scripts.");		
			_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.pre); } });

			// Should we skip this set of packets?
			if(!weapon.skip) {
				// Build a token for each packet in this weapon definition
				for(var i = 0;i < weapon.packets;i++) {
					var token = new combat.token(unit,combat.functions.aim);
					token.weapon = _.deep(weapon);
					logs.addShot(unit);
					stack.unshift(token);
				}
			}

			// Run postprocess 'ready' scripts for weapon tags
			console.info("Begin weapon postprocess scripts.");
			_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });
		});
	}

	// Run postprocess 'ready' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].ready.post); } });

	// End console message grouping
	console.groupEnd();
};

// Select a target for the weapon ------------------------------------------------------------------
combat.functions.aim = function(stack,logs) {
	console.groupCollapsed("Aim - " + this.unit.general.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = undefined;

	// Run preprocess 'aim' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.pre); } });
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
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].aim.post); } });

	// Add the target to the token, set the next action, and push the token on to the stack.
	this.target = target;
	this.action = combat.functions.fire;
	stack.unshift(this);

	console.groupEnd();
};

// Fire the weapon at the target -------------------------------------------------------------------
combat.functions.fire = function(stack,logs) {
	console.groupCollapsed("Fire - " + this.unit.general.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var volley = undefined;
	var damagePercent = undefined;
	var damage = undefined;
	var message = unit.general.name + " fires at " + target.general.name + " and ";
	var defense = undefined;

	// Run preprocess 'fire' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });
	_.each(target.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });
	_.each(target.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].fire.pre); } });

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
		var guns = (weapon.guns || 1);
		damage = Math.round(volley * guns * damagePercent / 100);
		message += "hits (" + hitRoll + "/" + hitTarget + ") for " + damage + "(" + damagePercent + "%)";

		// Which defense system are we using?
		defense = (target.shield.current > 0) ? "shield" : "hull";
		logs.push(target,target.general.name + " was struck on the " + defense);
		this.defense = defense;

		this.damage = damage;
		this.action = combat.functions.resolve;
		stack.unshift(this);
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
	_.each(unit,function(obj){ _.each(obj,function(sub,tag) { if(_.isString(tag) && combat.tags[tag]) { eval(combat.tags[tag].fire.post); }	}); });
	_.each(target,function(obj){ _.each(obj,function(sub,tag) { if(_.isString(tag) && combat.tags[tag]) { eval(combat.tags[tag].fire.post); } }); });

	logs.push(unit,message);
	logs.push(target,message);

	console.groupEnd();
};
// Resolve the damage incoming to the target -------------------------------------------------------
combat.functions.resolve = function(stack,logs) {
	console.groupCollapsed("Resolve - " + this.unit.general.name);
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var damage = this.damage;
	var defense = this.defense;
	
	// Run preprocess 'resolve' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });
	_.each(target.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });
	_.each(target.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });

	// Run preprocess 'resolve' scripts for weapon tags
	console.info("Begin weapon preprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.pre); } });

	// Apply damage to the defense system
	target[defense].current -= damage;

	// Shoud there be a crit?
	var crits = combat.functions.determineCrits(target);
	_.each(crits,function(crit) {
		eval(crit.script);
		logs.push(target,target.general.name + " was crit -- " + crit.msg);
	});

	// Run postprocess 'resolve' scripts for weapon tags
	console.info("Begin weapon postprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });

	// Run postprocess 'resolve' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });
	_.each(target.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });
	_.each(target.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].resolve.post); } });

	console.groupEnd();
};
// Determine if a critical hit happened and what critical hit it is --------------------------------
combat.functions.cleanup = function(stack,logs) {
	var unit = this.unit;
	var weapon = this.weapon;
	var target = this.target;
	var damage = this.damage;
	var defense = this.defense;

	console.info("Cleanup - " + unit.general.name);

	// Run preprocess 'cleanup' scripts for unit and combat tags
	console.log("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].cleanup.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].cleanup.pre); } });

	// Run preprocess 'cleanup' scripts for weapon tags
	console.log("Begin weapon preprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].cleanup.pre); } });

	logs.push(unit,unit.general.name + " is doing end of combat turn cleanup");

	// Is the unit destroyed?
	if(unit.hull.current <= 0) {
		unit.combat.destroyed = true;
	}

	if(unit.combat.flee) {
		unit.combat.fled = true;
		console.warn(unit.general.name + " has fled!");
		logs.push(unit,unit.general.name + " has fled");
	}

	if(unit.combat.destroyed) {
		console.warn(unit.general.name + " has been destroyed!");
		logs.push(unit,unit.general.name + " has been destroyed!");
	}

	if(unit.combat.destroyed || unit.combat.fled) {
		combat.fleets[unit.fleet].combat.loseCount++;
	}

	// Run postprocess 'cleanup' scripts for weapon tags
	console.log("Begin weapon postprocess scripts.");
	_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].cleanup.post); } });

	// Run postprocess 'cleanup' scripts for unit and combat tags
	console.log("Begin unit postprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].cleanup.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].cleanup.post); } });
};
// Determine what to do when fleeing ---------------------------------------------------------------
combat.functions.flee = function(stack,logs) {
	console.groupCollapsed("Fleeing - " + this.unit.general.name);
	var unit = this.unit;

	// Run preprocess 'flee' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].flee.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].flee.pre); } });

	// Mark the unit as having fled the battle field
	unit.combat.flee = true;
	logs.push(unit,unit.general.name + " is fleeing");
	this.action = combat.functions.cleanup;
	stack.push(this);

	// Run postprocess 'flee' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].flee.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].flee.post); } });

	console.groupEnd();
};
// Determine what to do when checking long range weapons -------------------------------------------
combat.functions.long = function(stack,logs) {
	console.groupCollapsed("Long - " + this.unit.general.name);
	var unit = this.unit;

	// Run preprocess 'long' scripts for unit and combat tags
	console.info("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.pre); } });

	// Does the unit have a long tag in a weapon?
	if(combat.functions.hasLongWeapon(unit)) {
		// Yes, ready the long weapons on the unit.
		// Build a token for each direct fire weapon group definition
		_.each(unit["direct-fire"],function(weapon) {
			// Reset the skip flag
			weapon.skip = false;

			// Run preprocess 'ready' scripts for weapon tags
			console.info("Begin weapon preprocess scripts.");
			_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.pre); } });

			// Should we skip this set of batteries?
			if(!weapon.skip && weapon.long > 0) {
				// Build a token for each battery in this weapon definition
				for(var i = 0;i < weapon.batteries;i++) {
					var token = new combat.token(unit,combat.functions.aim);
					token.weapon = _.deep(weapon);
					logs.addShot(unit);
					stack.unshift(token);
				}
			}
			else {
				console.log("Skipping weapon group");
			}

			// Run postprocess 'ready' scripts for weapon tags
			console.info("Begin weapon postprocess scripts.");
			_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.post); } });
		});
		
		// Build a token for each packet fire weapon group definition
		_.each(unit["packet-fire"],function(weapon) {
			// Reset the skip flag
			weapon.skip = false;

			// Run preprocess 'ready' scripts for weapon tags
			console.info("Begin weapon preprocess scripts.");		
			_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.pre); } });

			// Should we skip this set of packets?
			if(!weapon.skip && weapon.long > 0) {
				// Build a token for each packet in this weapon definition
				for(var i = 0;i < weapon.packets;i++) {
					var token = new combat.token(unit,combat.functions.aim);
					token.weapon = _.deep(weapon);
					logs.addShot(unit);
					stack.unshift(token);
				}
			}

			// Run postprocess 'ready' scripts for weapon tags
			console.info("Begin weapon postprocess scripts.");
			_.each(weapon,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.post); } });
		});
	}
	//Enter a cleanup event for the unit.
	stack.push(new combat.token(unit,combat.functions.cleanup));

	// Run postprocess 'long' scripts for unit and combat tags
	console.info("Begin unit postprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].long.post); } });

	console.groupEnd();
};
// Determine what to do with board party -----------------------------------------------------------
combat.functions.boarding = function(stack,logs) {
	console.info("Boarding - " + this.unit.general.name);
	var unit = this.unit;

	// Run preprocess 'board' scripts for unit and combat tags
	console.log("Begin unit preprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].board.pre); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].board.pre); } });

	//

	// Run postprocess 'board' scripts for unit and combat tags
	console.log("Begin unit postprocess scripts.");
	_.each(unit.general,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].board.post); } });
	_.each(unit.combat,function(obj,tag) { if(combat.tags[tag]) { eval(combat.tags[tag].board.post); } });

	console.groupEnd();
};
// Display a message to the log --------------------------------------------------------------------
combat.functions.tap = function() {
	// Pose the message to the console log
	console.log(this.msg);
};

var message = function(t) {
	this.turn = t;
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
	reserveUnit: function(unit) { return (!_.isNumber(unit.general.reserve)); }
};

var maps = {
	unitName: function(unit) { return unit.general.name; }
};

// Process a combat stack --------------------------------------------------------------------------
function processStack(stack,logs) {
	while(stack.length > 0) {
		var token = stack.shift();
		var unit = token.unit;
		token.action(stack,logs);
	}
}

// End of Combat Test ------------------------------------------------------------------------------
function endOfCombat() {
	var eoc = false;

	_.each(combat.fleets,function(fleet) {
		console.log(fleet.name + " " + fleet.combat.loseCount + " of " + fleet.combat.unitCount + "(" + fleet.breakoff + ")");
		console.log(fleet);
		if(fleet.combat.loseCount >= fleet.combat.unitCount) {
			eoc = true;
		}
	});

	return eoc;
}

// Main Combat Simulation Loop ---------------------------------------------------------------------
function doCombatSimulation() {
	// Fleet initialization
	combat.fleets.attacker.combat = {};
	combat.fleets.defender.combat = {};
	combat.fleets.attacker.enemy = "defender";
	combat.fleets.defender.enemy = "attacker";
	_.each(combat.fleets,function(fleet,key) {
		fleet.combat.loseCount = 0;
		fleet.combat.unitCount = _.keys(fleet.units).length;
		_.each(fleet.units,function(unit){
			unit.fleet = key;
			combat.functions.unitDefaults(unit);
		});
	});

	// Check for long range weapons
	console.groupCollapsed("Precombat Actions");
	
	// Log Entry array for precombat turn
	var prelogs = new combat.logs.log(combat.turn);
	
	var longStack = [];
	_.each(combat.fleets,function(fleet,key) {
		_.each(fleet.units,function(unit){
			unit.fleet = key;
			longStack.push(new combat.token(unit,combat.functions.long));
		});
	});
	processStack(longStack,prelogs);
	var m = new message(combat.turn);
	m.logs = prelogs;
	self.postMessage({"type":"entry","entry":m});

	if(endOfCombat()) {
		combat.status = combat.statuses.done;
	}

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
			// Is the unit a reserve unit?
			if(unit.general.reserve && !unit.combat.reserve) {
				// Initialize the number of units in the fleet for the unit to be in reserve.
				unit.combat.reserve = Math.ceil(unit.general.reserve / 100 * (combat.fleets.attacker.combat.unitCount - 1));
			}
			
			// Is the unit destroyed?
			if(!unit.combat.destroyed  && !unit.combat.fled) {
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
			// Is the unit a reserve unit?
			if(unit.general.reserve && !unit.combat.reserve) {
				// Initialize the number of units in the fleet for the unit to be in reserve.
				unit.combat.reserve = Math.ceil(unit.general.reserve / 100 * (combat.fleets.attacker.combat.unitCount - 1));
			}

			if(!unit.combat.destroyed && !unit.combat.fled) {
				// Setup reserve units
				if(unit.general.reserve && !unit.combat.reserve) {
					var reserveLevel = Math.ceil(unit.general.reserve / 100 * (combat.fleets.defender.combat.unitCount - 1));
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

		var m = new message(combat.turn);

		// Check for end of combat
		if(endOfCombat()) {
			combat.status = combat.statuses.done;
			m.done = true;
		}
		
		m.logs = logs;

		console.groupEnd();
		self.postMessage({"type":"entry","entry":m});
	}

	// Send the finally summary
	var summary = {};
	summary.fleets = {};
	summary.fleets = combat.fleets;
	summary.turnCount = combat.turn;
	self.postMessage({"type":"summary","summary":summary});

	close();
}

self.onmessage = function(event) {
	combat.fleets = event.data;
	doCombatSimulation();
};