////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.combat = {};

// Mobius Engine States ------------------------------------------------------------------------
// Simulation State Cycle:
//   1. Preparing - prior to fleet data importing.  Two fleets must be imported prior to moving
//		"ready" state.
//   2. Ready - fleets are imported and combat simulation can be started.
//   3. Running - combat simulation has been started and is currently running.
//   4. Finished - combat simulation has completed.  A combat summary will be displayed and
//		the combat log can be downloaded as a text file.
// Clearing the combat simulation returns the engine to a "ready" state.
mobiusEngine.combat.states = {
	reset: "reset",
	started: "started",
	stopped: "stopped",
	running: "running",
	ready: "ready",
	preparing: "preparing",
	finished: "finished"
};

// Mobius Engine Message Types -----------------------------------------------------------------
// entry - this is a message that contains a combat turn of log information
// summary - this is a message that contains the final summary of a full combat simulation
mobiusEngine.combat.messageTypes = {
	entry: "entry",
	summary: "summary"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Combat Engine Controller
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.combat.controller = function($scope,$log,_data,_fleets) {
	var $ctrl = this;
	$ctrl.alerts = [];
	this.combat = {
		logs: [],
		state: mobiusEngine.combat.states.reset,
		states: mobiusEngine.combat.states,
		uuid: window.uuid.v4(),
		name: "",
		summary: {}
	};

	// Placeholder for the log file text download button
	this.download = "";

	// Placeholder for the Web Worker object
	this.worker = undefined;

	// UI state variables
	this.states = {
		unitTables: {
			attacker: false,
			defender: false
		},
		logs: []
	};

	// Data structure for imported fleets.
	this.fleets = {
		attacker: {},
		defender: {}
	};

	// Alert Messages --------------------------------------------------------------------------
	this.alerts = [
		{type:"danger",msg:"Reserved keywords: skip"},
		{type:"warning",msg:"Only the following tags currently work: short, sticky, reserve, ammo, long, deflect"},
		{type:"info",msg:"short: expects a number of turns that the weapon cannot fire after the unit has entered combat."},
		{type:"info",msg:"sticky: used to designated weapons that provide continuous damage over multiple turns against the same target."},
		{type:"info",msg:"reserve: expects a number that is the percentage of units in the fleet needed to provide cover."},
		{type:"info",msg:"long: expects a number that represents the number of precombat rounds of long range fire with a weapon system."},
		{type:"info",msg:"deflect: expects a number to reduce incoming damage by."}
	];

	// Close an individual alert by removing if from the list
	this.closeAlert = function(index) {
		this.alerts.splice(index,1);
	};

	// onPrepare
	this.onPrepare = function() {};

	// onReady
	this.onReady = function() {};

	// onRun
	this.onRun = function() {};

	// onFinished
	this.onFinished = function() {};

	// onSave
	this.onSave = function() {
		var sim = _data.newSimulation();

		sim.name = this.combat.name;
		sim.uuid = this.combat.uuid;
		sim.logs = this.combat.logs;
		sim.summary = this.combat.summary;

		_data.addSimulation(sim);
	};

	// Create the web worker object and start the combat simulation.
	this.startCombat = function() {
		var self = this;
		this.combat.state = mobiusEngine.combat.states.started;
		this.worker = new Worker("app/app.worker.js");
		this.worker.onmessage = function(event) {
			var msg = event.data;
			if(msg.type === "entry") {
				self.combat.logs.push(msg.entry);
			}
			else if(msg.type === "summary") {
				self.combat.summary = msg.summary;
				self.stopCombat();
				$scope.$apply();
			}
		};
		var critTable = localStorage.critTable ? localStorage.critTable : {};
		this.worker.postMessage(this.fleets);
		$log.log("Starting Combat!");
	};

	// Terminate the web worker thread.  This does not reset the combat engine.
	this.stopCombat = function() {
		this.combat.state = mobiusEngine.combat.states.stopped;
		this.worker.terminate();
		this.worker = undefined;
		$log.log("Stopping Combat!");
	};

	// Reset the combat engine to the "ready" state.
	this.clearCombat = function() {
		this.combat.state = mobiusEngine.combat.states.reset;
		if(!_.isUndefined(this.worker)) {
			this.stopCombat();
		}
		this.combat.logs.length = 0;
		this.combat.uuid = window.uuid.v4();
		$log.log("Clearing Combat!");
	};

	// Import attacking fleet
	this.importAttacker = function() {
		$log.log("Importing attacking fleet!");
		var obj = JSON.parse(this.import.attacker);
		this.fleets.attacker.name = obj.name;
		this.fleets.attacker.faction = obj.faction;
		this.fleets.attacker.breakoff = obj.breakoff;
		this.fleets.attacker.units = obj.units;
		this.fleets.attacker.combat = {};
		this.fleets.attacker.combat.unitCount = _.keys(obj.units).length;
	};

	// Delete the attacking fleet
	this.clearAttacker = function() {
		$log.log("Clearing attacking fleet!");
		delete this.fleets.attacker;
		this.fleets.attacker = {};
	}

	// Import defending fleet
	this.importDefender = function() {
		$log.log("Importing defending fleet!");
		var obj = JSON.parse(this.import.defender);
		this.fleets.defender.name = obj.name;
		this.fleets.defender.faction = obj.faction;
		this.fleets.defender.breakoff = obj.breakoff;
		this.fleets.defender.units = obj.units;
		this.fleets.defender.combat = {};
		this.fleets.defender.combat.unitCount = _.keys(obj.units).length;
	};

	// Delete the defending fleet
	this.clearDefender = function() {
		$log.log("Clearing defending fleet!");
		delete this.fleets.defender;
		this.fleets.defender = {};
	};

	// Ready the UI state objects
	this.initTurnState = function(turn) {
		this.states.logs[turn] = {
			fleets: {
				attacker: {
					units: []
				},
				defender: {
					units: []
				}
			}
		};
	};

	// Initialize the view state of a log table
	this.initLogTableState = function(turn,fleet,unit) {
		this.states.logs[turn].fleets[fleet].units[unit] = false;
	};

	// Toggle the view state of a log table
	this.toggleLogTableState = function(turn,fleet,unit) {
		this.states.logs[turn].fleets[fleet].units[unit] = !this.states.logs[turn].fleets[fleet].units[unit];
	};

	// Return the view state of a log table
	this.getLogTableState = function(turn,fleet,unit) {
		return this.states.logs[turn].fleets[fleet].units[unit];
	};

	// Dump the log object to the console.
	this.dumpLogs = function() {
		console.log(this.combat.logs);
	}

	// Download the JSON string of the logs as a text file.
	this.downloadLogs = function() {
		this.download = 'data:application/octet-stream;charset=utf-8;base64,' + btoa(JSON.stringify(this.combat.logs));
	};

	this.getAllFleets = function() {
		var keys = _fleets.getAllFleets();
		var flts = {};
		_.each(keys,function(key) {
			flts[key] = _fleets.getFleet(key);
		})
		return flts;
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Combat Engine Component
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("combatEngine",{
	templateUrl: 'app/component/combat/combat.main.html',
	controller: ["$scope","$log","mobius.data.simulation","mobius.data.fleet",mobiusEngine.combat.controller],
	bindings: {
	}
});