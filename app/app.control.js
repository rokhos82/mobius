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

	this.states = {
		unitTables: {
			attacker: true,
			defender: true
		}
	};

	this.fleets = {
		attacker: {},
		defender: {}
	};

	this.import = {
		attacker: '{"name":"1st Balur Vanguard","faction":"The Balur","breakoff":100,"units":[{"unit": {"name":"Beam Destroyer 1","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},{"unit": {"name":"Beam Destroyer 2","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},{"unit": {"name":"Beam Destroyer 3","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},{"unit": {"name":"Beam Destroyer 4","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},{"unit": {"name":"Beam Destroyer 5","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"}]}',
		defender: '{\
	"name":"Formick",\
	"faction":"The Buggers",\
	"breakoff":100,\
	"units":[\
		{"unit": {"name":"Bugger Carrier","type":"Starship","defense":120,"target":60,"size":10,"cost": 408,"carrier": 60},"hull": {"max":15,"current":15},"template":"Bug Carrier"},\
		{"unit": {"name":"Firefly 01","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 02","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 03","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 04","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 05","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 06","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 07","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 08","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 09","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 10","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 11","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 12","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 13","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 14","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 15","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 16","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 17","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 18","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 19","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 20","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 21","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 22","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 23","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 24","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 25","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 26","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 27","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 28","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 29","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 30","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 31","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 32","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 33","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 34","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 35","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 36","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 37","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 38","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 39","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 40","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 41","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 42","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 43","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 44","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 45","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 46","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 47","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 48","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 49","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 50","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 51","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 52","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 53","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 54","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 55","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 56","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 57","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 58","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 59","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		{"unit": {"name":"Firefly 60","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"}\
	]}'
	};

	this.alerts = [
	];

	this.closeAlert = function(index) {
		this.alerts.splice(index,1);
	};

	this.worker = undefined;

	this.startCombat = function() {
		var self = this;
		this.combat.state = mobiusEngine.states.started;
		this.worker = new Worker("app/app.worker.js");
		this.worker.onmessage = function(event) {
			self.combat.logs.push(event.data);
			//console.log(event.data);
			$scope.$apply();
		};
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
		if(!_.isUndefined(this.worker)) {
			this.stopCombat();
		}
		this.combat.logs.length = 0;
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
}]);