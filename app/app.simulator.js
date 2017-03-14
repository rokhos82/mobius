// Import any required library's ///////////////////////////////////////////////////////////////////
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

// Setup the namespace object for the simulator ////////////////////////////////////////////////////
var simulator = {};

// Default objects for the simulator ///////////////////////////////////////////////////////////////
simulator.defaults = {};
simulator.defaults.location = {
	"name": "",
	"key": "",
	"neighbors": {"up":undefined,"down":undefined},
	"actors": {}
};

// Location object for the simulator ///////////////////////////////////////////////////////////////
simulator.location = function(key,name) {
	// Setup the new object given the parameters.
	this.key = key;
	this.name = name;

	// Apply defaults to the object.
	_.defaults(this,simulator.defaults.location);
};

// Actor object for the simulator //////////////////////////////////////////////////////////////////
simulator.actor = function(unit,location,environment) {
	this.unit = unit;
	this.location = location;
	this.environment = environment;
};

simulator.actor.prototype.move = function(options) {
	console.log("Actor is moving...");
	var m = {
		speed: 0,
		direction: ""
	};
	if(options.flee) {
		// move faster
		m.speed = 2;
	}
	else{
		// otherwise, move slower
		m.speed = 1;
	}
	m.direction = _.sample(["up","down"]);
	console.log(m);
};

simulator.actor.prototype.decide = function(options) {
	console.log("Actor is deciding what to do...");
	var actions = ["move","flee"];
	var action = _.sample(actions);
	if(action === "move") {
		this.move({flee:false});
	}
	else if(action === "flee") {
		this.move({flee:true});
	}
	else {
		console.log("Actor can't decide what to do...");
	}
};

// testActor Unit Defintion ------------------------------------------------------------------------
simulator.testActor = {
	uuid: "testActor",
	general: {
		name: "Test Actor",
		speed: 1,
		type: "Starship",
		size: 6
	}
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
	
	var locs = {};
	locs["A6"] = new simulator.location("A6","Attacker Flee");
	locs["A5"] = new simulator.location("A5","Attacker 5");
	locs["A4"] = new simulator.location("A4","Attacker 4");
	locs["A3"] = new simulator.location("A3","Attacker 3");
	locs["A2"] = new simulator.location("A2","Attacker 2");
	locs["A1"] = new simulator.location("A1","Attacker 1");
	locs["D1"] = new simulator.location("D1","Defender 1");
	locs["D2"] = new simulator.location("D2","Defender 2");
	locs["D3"] = new simulator.location("D3","Defender 3");
	locs["D4"] = new simulator.location("D4","Defender 4");
	locs["D5"] = new simulator.location("D5","Defender 5");
	locs["D6"] = new simulator.location("D6","Defender Flee");

	var keys = ["D6","D5","D4","D3","D2","D1","A1","A2","A3","A4","A5","A6"];

	this.battlefield = {};

	for(var i in keys) {
		var index = parseInt(i);
		var key = keys[index];
		var up = keys[index+1];
		var down = keys[index-1];
		this.battlefield[key] = locs[key];
		this.battlefield[key].neighbors.up = locs[up];
		this.battlefield[key].neighbors.down = locs[down];
		console.log("Building battlefield location " + key);
	}
};

// Simulator Engine ////////////////////////////////////////////////////////////////////////////////
simulator.engine = function(blob) {
	console.log("Building the engine object...");
	this.fleets = blob.fleets;
	this.options = blob.options;
	this.actors = {};
	this.init();
};
simulator.engine.prototype.run = function() {
	console.log("Running the simulation...");

	var count = 1;
	while(count <= 3) {
		console.log("Tick: " + count);
		var actors = this.actors;
		for(var uuid in actors) {
			var actor = actors[uuid];
			actor.decide();
		}
		count++;
	}

	console.log("Simulation has eneded.  Terminating worker thread.");
	self.close();
};
simulator.engine.prototype.init = function() {
	console.log("Initializing the simulation...");
	this.environment = new simulator.environment();
	this.addActor(simulator.testActor,"D1");
};
simulator.engine.prototype.addActor = function(unit,location) {
	console.log("Adding actor " + unit.uuid);
	this.actors[unit.uuid] = new simulator.actor(unit,location,this.environment);
};

// Simulator Bootstrap and Message Passing Callback ////////////////////////////////////////////////
self.onmessage = function(event) {
	var sim = new simulator.engine(event.data);
	sim.run();
};