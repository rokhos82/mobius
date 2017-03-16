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
	$ctrl.combat = {
		logs: [],
		state: mobiusEngine.combat.states.reset,
		states: mobiusEngine.combat.states,
		uuid: window.uuid.v4(),
		name: "",
		summary: {}
	};

	// Placeholder for the log file text download button
	$ctrl.download = "";

	// Placeholder for the Web Worker object
	$ctrl.worker = undefined;

	// UI state variables
	$ctrl.states = {
		unitTables: {
			attacker: false,
			defender: false
		},
		logs: []
	};

	// Data structure for imported fleets.
	$ctrl.fleets = {
		attacker: {},
		defender: {}
	};

	// Alert Messages --------------------------------------------------------------------------
	$ctrl.alerts = [
		{type:"danger",msg:"Reserved keywords: skip"},
		{type:"warning",msg:"Only the following tags currently work: short, sticky, reserve, ammo, long, deflect"},
		{type:"info",msg:"short: expects a number of turns that the weapon cannot fire after the unit has entered combat."},
		{type:"info",msg:"sticky: used to designated weapons that provide continuous damage over multiple turns against the same target."},
		{type:"info",msg:"reserve: expects a number that is the percentage of units in the fleet needed to provide cover."},
		{type:"info",msg:"long: expects a number that represents the number of precombat rounds of long range fire with a weapon system."},
		{type:"info",msg:"deflect: expects a number to reduce incoming damage by."}
	];

	// Close an individual alert by removing if from the list
	$ctrl.closeAlert = function(index) {
		$ctrl.alerts.splice(index,1);
	};

	// onPrepare
	$ctrl.onPrepare = function() {};

	// onReady
	$ctrl.onReady = function() {};

	// onRun
	$ctrl.onRun = function() {};

	// onFinished
	$ctrl.onFinished = function() {};

	// onSave
	$ctrl.onSave = function() {
		var sim = _data.newSimulation();

		sim.name = $ctrl.combat.name;
		sim.uuid = $ctrl.combat.uuid;
		sim.logs = $ctrl.combat.logs;
		sim.summary = $ctrl.combat.summary;

		_data.addSimulation(sim);
	};

	// Create the web worker object and start the combat simulation.
	$ctrl.startCombat = function() {
		$ctrl.combat.state = mobiusEngine.combat.states.started;
		$ctrl.worker = new Worker("app/app.worker.js");
		$ctrl.worker.onmessage = function(event) {
			var msg = event.data;
			if(msg.type === "entry") {
				$ctrl.combat.logs.push(msg.entry);
			}
			else if(msg.type === "summary") {
				$ctrl.combat.summary = msg.summary;
				$ctrl.stopCombat();
				$scope.$apply();
			}
		};
		var critTable = localStorage.critTable ? localStorage.critTable : {};
		$ctrl.worker.postMessage($ctrl.fleets);
		$log.log("Starting Combat!");
	};

	// Terminate the web worker thread.  This does not reset the combat engine.
	$ctrl.stopCombat = function() {
		$ctrl.combat.state = mobiusEngine.combat.states.stopped;
		$ctrl.worker.terminate();
		$ctrl.worker = undefined;
		$log.log("Stopping Combat!");
	};

	// Reset the combat engine to the "ready" state.
	$ctrl.clearCombat = function() {
		$ctrl.combat.state = mobiusEngine.combat.states.reset;
		if(!_.isUndefined($ctrl.worker)) {
			$ctrl.stopCombat();
		}
		$ctrl.combat.logs.length = 0;
		$ctrl.combat.uuid = window.uuid.v4();
		$log.log("Clearing Combat!");
	};

	// Import attacking fleet
	$ctrl.importAttacker = function() {
		$log.log("Importing attacking fleet!");
		var obj = JSON.parse($ctrl.import.attacker);
		$ctrl.fleets.attacker.name = obj.name;
		$ctrl.fleets.attacker.faction = obj.faction;
		$ctrl.fleets.attacker.breakoff = obj.breakoff;
		$ctrl.fleets.attacker.units = obj.units;
		$ctrl.fleets.attacker.combat = {};
		$ctrl.fleets.attacker.combat.unitCount = _.keys(obj.units).length;
	};

	// Delete the attacking fleet
	$ctrl.clearAttacker = function() {
		$log.log("Clearing attacking fleet!");
		delete $ctrl.fleets.attacker;
		$ctrl.fleets.attacker = {};
	}

	// Import defending fleet
	$ctrl.importDefender = function() {
		$log.log("Importing defending fleet!");
		var obj = JSON.parse($ctrl.import.defender);
		$ctrl.fleets.defender.name = obj.name;
		$ctrl.fleets.defender.faction = obj.faction;
		$ctrl.fleets.defender.breakoff = obj.breakoff;
		$ctrl.fleets.defender.units = obj.units;
		$ctrl.fleets.defender.combat = {};
		$ctrl.fleets.defender.combat.unitCount = _.keys(obj.units).length;
	};

	// Delete the defending fleet
	$ctrl.clearDefender = function() {
		$log.log("Clearing defending fleet!");
		delete $ctrl.fleets.defender;
		$ctrl.fleets.defender = {};
	};

	// Ready the UI state objects
	$ctrl.initTurnState = function(turn) {
		$ctrl.states.logs[turn] = {
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
	$ctrl.initLogTableState = function(turn,fleet,unit) {
		$ctrl.states.logs[turn].fleets[fleet].units[unit] = false;
	};

	// Toggle the view state of a log table
	$ctrl.toggleLogTableState = function(turn,fleet,unit) {
		$ctrl.states.logs[turn].fleets[fleet].units[unit] = !$ctrl.states.logs[turn].fleets[fleet].units[unit];
	};

	// Return the view state of a log table
	$ctrl.getLogTableState = function(turn,fleet,unit) {
		return $ctrl.states.logs[turn].fleets[fleet].units[unit];
	};

	// Dump the log object to the console.
	$ctrl.dumpLogs = function() {
		console.log($ctrl.combat.logs);
	}

	// Download the JSON string of the logs as a text file.
	$ctrl.downloadLogs = function() {
		$ctrl.download = 'data:application/octet-stream;charset=utf-8;base64,' + btoa(JSON.stringify($ctrl.combat.logs));
	};

	$ctrl.getAllFleets = function() {
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