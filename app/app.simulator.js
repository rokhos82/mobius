// Import any required library's
self.importScripts("../js/underscore.js");

_.mixin({
	"deep":function(object){
		return JSON.parse(JSON.stringify(object));
	},
	"table":function(table){
		var roll = _.random(1,_.max(table,function(crit){ return crit.threshold; }).threshold);
		var entry = undefined;
		_.each(table,function(crit) {
			if(roll <= crit.threshold) {
				if(!entry) { entry = crit; }
			}
		});
		return entry;
	}
});

// Setup the namespace object for the simulator ----------------------------------------------------
var simulator = {};

// Default objects for the simulator ---------------------------------------------------------------
simulator.defaults = {};
simulator.defaults.location = {
	"name": "",
	"key": "",
	"up": "",
	"down": ""
};

// Location object for the simulator ---------------------------------------------------------------
simulator.location = function(key,name,up,down) {
	// Setup the new object given the parameters.
	this.key = key;
	this.name = name;
	this.up = up;
	this.down = down;

	// Apply defaults to the object.
	_.defaults(this,simulator.defaults.location);
};

// Actor object for the simulator ------------------------------------------------------------------
simulator.actor = function(unit,location) {
	this.unit = unit;
	this.location = location;
};
simulator.actor.prototype.move = function(options) {
	if(options.flee) {
		// move faster
	}
	else{
		// otherwise, move slower
	}
};
simulator.actor.prototype.actions = function(first_argument) {
};

// Simulator Environment Object ////////////////////////////////////////////////////////////////////
// This is a simple, 1-Dimensional Battle Field.  The Attacking side has 6 locations and the
// Defending side has 6 locations.  Location 1 on either side are neighbors in the middle.
// Location 6 on either side is a special 'flee' location where fleeing is automatic and
// successful.
//
//		|===========|
//		| Att. Flee	|
//		|-----------|
//		| Att. 5	|
//		|-----------|
//		| Att. 4	|
//		|-----------|
//		| Att. 3	|
//		|-----------|
//		| Att. 2	|
//		|-----------|
//		| Att. 1	|
//		|===========|
//		| Def. 1	|
//		|-----------|
//		| Def. 2	|
//		|-----------|
//		| Def. 3	|
//		|-----------|
//		| Def. 4	|
//		|-----------|
//		| Def. 5	|
//		|-----------|
//		| Def. Flee	|
//		|===========|
//
// Attacking Fleet - can start anywhere on the Attackers side of the battlefield except for the
//		'flee' location.
// Defending Fleet - can start anywhere on the Defenders side of the battlefield except for the
//		'flee' location.
////////////////////////////////////////////////////////////////////////////////////////////////////
simulator.environment = function() {
	console.log("Building the environment object...");
	this.locations = {};
	this.locations["A6"] = new simulator.location("A6","Attacker Flee",null,"A5");
	this.locations["A5"] = new simulator.location("A5","Attacker Flee","A6","A4");
	this.locations["A4"] = new simulator.location("A4","Attacker Flee","A5","A3");
	this.locations["A3"] = new simulator.location("A3","Attacker Flee","A4","A2");
	this.locations["A2"] = new simulator.location("A2","Attacker Flee","A3","A1");
	this.locations["A1"] = new simulator.location("A1","Attacker Flee","A2","D1");
	this.locations["D1"] = new simulator.location("D1","Attacker Flee","A1","D2");
	this.locations["D2"] = new simulator.location("D2","Attacker Flee","D1","D3");
	this.locations["D3"] = new simulator.location("D3","Attacker Flee","D2","D4");
	this.locations["D4"] = new simulator.location("D4","Attacker Flee","D3","D5");
	this.locations["D5"] = new simulator.location("D5","Attacker Flee","D4","D6");
	this.locations["D6"] = new simulator.location("D6","Attacker Flee","D5",null);

	this.actors = {};
};

simulator.environment.prototype.addActor = function(unit,location) {
	if(unit.uuid) {
		var actor = new simulator.actor(unit,location);
		this.actors[unit.uuid] = actor;
	}
	else {
		console.error("Unable to add actor to environment.  No UUID in unit object.")
	}
};

// Simulator Engine ////////////////////////////////////////////////////////////////////////////////
simulator.engine = function(blob) {
	console.log("Building the engine object...");
	this.fleets = blob.fleets;
	this.options = blob.options;
	this.init();
};
simulator.engine.prototype.run = function() {
	console.log("Running the simulation...");
};
simulator.engine.prototype.init = function() {
	console.log("Initializing the simulation...");
	this.environment = new simulator.environment();
};

// Simulator Bootstrap and Message Passing Callback ////////////////////////////////////////////////
self.onmessage = function(event) {
	new simulator.engine(event.data);
	simulator.run();
};