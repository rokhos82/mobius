// Import any required library's ///////////////////////////////////////////////////////////////////
self.importScripts("../js/underscore.js");

// Add aditional functions to underscorejs ---------------------------------------------------------
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

// Default keys and values for a location object ---------------------------------------------------
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
	_.defaults(this,_.deep(simulator.defaults.location));
};

// Actor object for the simulator //////////////////////////////////////////////////////////////////
simulator.actor = function(unit,location,environment) {
	this.unit = unit;
	this.location = location;
	this.environment = environment;
};

simulator.actor.prototype.move = function(options) {
	var $actor = this;
	
	var directions = ["up","down"];
	var direction = _.sample(directions);
	console.log($actor.unit.general.name + " is moving " + direction);

	var speed = $actor.unit.general.speed;
	console.log($actor.unit.general.name + " has a speed of " + speed);
	for(var i = 0;i < speed;i++) {
		var loc = $actor.location.neighbors[direction];
		if(loc) {
			var key = $actor.unit.uuid;
			delete $actor.location.actors[key];
			$actor.location = loc;
			$actor.location.actors[key] = $actor;
		}
	}

	console.log($actor.unit.general.name + " is now at " + $actor.location.name);
};

simulator.actor.prototype.fire = function(options) {};

simulator.actor.prototype.decide = function(options) {
	var $actor = this;
	console.log($actor.unit.general.name + " is deciding what to do...");
	console.log($actor.unit.general.name + " is at " + $actor.location.name);

	// Decide what optional action to make
	var actions = ["move"];
	var action = _.sample(actions);
	if(action === "move") {
		this.move({flee:false});
	}

	// Perform the default move action
	this.move({flee:false});
};

// testActor Unit Defintion ------------------------------------------------------------------------
simulator.testRed = {
	uuid: "testRed",
	general: {
		name: "Test Red",
		speed: 1,
		type: "Starship",
		size: 6
	}
};

simulator.testBlue = {
	uuid: "testBlue",
	general: {
		name: "Test Blue",
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
	
	// Setup objects for the environment's battlefield.
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

	// Setup the battlefield location dictionary.
	this.battlefield = {};

	// Setup the links to the locations neighbor objects.
	// Links are to objects rather than keys to facilitate easier
	// walking of the environment structure by simulation actors.
	for(var i in keys) {
		var index = parseInt(i);
		var key = keys[index];
		var up = keys[index+1];
		var down = keys[index-1];
		this.battlefield[key] = locs[key];
		this.battlefield[key].neighbors.up = _.isUndefined(up) ? undefined : locs[up];
		this.battlefield[key].neighbors.down = _.isUndefined(down) ? undefined : locs[down];
		console.log("Building battlefield location " + key + " up is " + up + " and down is " + down);
	}
};

simulator.environment.prototype.getLocation = function(key) {
	return this.battlefield[key];
};

// Simulator Engine ////////////////////////////////////////////////////////////////////////////////
simulator.engine = function(blob) {
	console.log("Building the engine object...");
	
	// Initlialize the fleets and simulation options from the passed object.
	this.fleets = blob.fleets;
	this.options = blob.options;
	this.actors = {};

	// Initialize any other items for the simulation engine.
	this.init();
};

// run - Begin the simulation ----------------------------------------------------------------------
simulator.engine.prototype.run = function() {
	$engine = this;
	console.log("Running the simulation...");

	var count = 1;
	while(count <= 5) {
		console.log("Tick: " + count);
		var actors = $engine.actors;
		for(var uuid in actors) {
			var actor = actors[uuid];
			actor.decide();
		}
		self.postMessage($engine.environment);
		count++;
	}

	console.log("Simulation has eneded.  Terminating worker thread.");
	self.close();
};

// init - Initialize the simulation engine ---------------------------------------------------------
simulator.engine.prototype.init = function() {
	console.log("Initializing the simulation...");

	// Creat the environment and add the test actor.
	this.environment = new simulator.environment();
	this.addActor(simulator.testRed,"D1");
	this.addActor(simulator.testBlue,"A1");
};

// addActor - adds an actor to the simulation ------------------------------------------------------
simulator.engine.prototype.addActor = function(unit,location) {
	console.log("Adding actor " + unit.uuid);
	this.actors[unit.uuid] = new simulator.actor(unit,this.environment.getLocation(location),this.environment);
};

// Simulator Bootstrap and Message Passing Callback ////////////////////////////////////////////////
self.onmessage = function(event) {
	var sim = new simulator.engine(event.data);
	sim.run();
};