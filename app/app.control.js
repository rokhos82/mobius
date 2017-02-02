////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////

// Mobius Engine States ------------------------------------------------------------------------
mobiusEngine.states = {
	reset: "reset",
	started: "started",
	stopped: "stopped"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Engine Controller
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.controller = mobiusEngine.app.controller("mobiusCtl",["$scope","$log",function($scope,$log){
	this.combat = {
		logs: [],
		state: mobiusEngine.states.reset
	};

	this.fleets = {
		attacker: {},
		defender: {}
	};

	this.import = {
		attacker: "{\"name\":\"First Dakka Bringers\",\"faction\":\"Space Orks!\",\"breakoff\":50}",
		defender: "{\"name\":\"Formick\",\"faction\":\"The Buggers\",\"breakoff\":100}"
	};

	this.alerts = [
		{type:"info",msg:"Welcome to Mobius Engine!"},
		{type:"warning",msg:"Hide yo daughters! Hide yo wife!"}
	];

	this.closeAlert = function(index) {
		this.alerts.splice(index,1);
	};

	this.worker = undefined;

	this.startCombat = function() {
		this.combat.state = mobiusEngine.states.started;
		this.worker = new Worker("app/app.worker.js");
		this.worker.onmessage = this.combatListener;
		this.worker.postMessage(this.fleets);
		$log.log("Starting Combat!");
	};

	this.stopCombat = function() {
		this.combat.state = mobiusEngine.states.stopped;
		this.worker.terminate();
		this.worker = undefined;
		$log.log("Stopping Combat!");
	};

	this.clearCombat = function() {
		this.combat.state = mobiusEngine.states.reset;
		$log.log("Clearing Combat!");
	};

	this.importAttacker = function() {
		$log.log("Importing attacking fleet!");
		var obj = JSON.parse(this.import.attacker);
		this.fleets.attacker.name = obj.name;
		this.fleets.attacker.faction = obj.faction;
		this.fleets.attacker.breakoff = obj.breakoff;
		this.fleets.attacker.units = obj.units;
		$log.log(obj)
	};

	this.clearAttacker = function() {
		$log.log("Clearing attacking fleet!");
		delete this.fleets.attacker;
		this.fleets.attacker = {};
	}

	this.importDefender = function() {
		$log.log("Importing defending fleet!");
		var obj = JSON.parse(this.import.defender);
		this.fleets.defender.name = obj.name;
		this.fleets.defender.faction = obj.faction;
		this.fleets.defender.breakoff = obj.breakoff;
		this.fleets.defender.units = obj.units;
		$log.log(obj)
	};

	this.clearDefender = function() {
		$log.log("Clearing defending fleet!");
		delete this.fleets.defender;
		this.fleets.defender = {};
	};

	this.combatListener = function(event) {
		$log.log(event.data);
	};
}]);