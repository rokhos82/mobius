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
		attacker:
'{\
	"name":"1st Balur Vanguard",\
	"faction":"The Balur",\
	"breakoff":100,\
	"units":{\
		"Beam Destroyer 1": {"unit": {"name":"Beam Destroyer 1","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},\
		"Beam Destroyer 2": {"unit": {"name":"Beam Destroyer 2","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},\
		"Beam Destroyer 3": {"unit": {"name":"Beam Destroyer 3","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},\
		"Beam Destroyer 4": {"unit": {"name":"Beam Destroyer 4","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},\
		"Beam Destroyer 5": {"unit": {"name":"Beam Destroyer 5","type":"Starship","defense":15,"size":6,"cost":115},"hull": {"max":9,"current":9},"shield": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true},{"volley":[1,2],"target":15,"sticky":true,"short":true}],"template":"Beam Destroyer B"},\
		"Missile Destroyer 1": {"unit":{"name":"Missile Destroyer 1","type":"Starship","defense":15,"size":6,"cost": 77},"hull": {"max":11,"current":11},"shield": {"max":0,"current":0},"direct-fire":[],"packet-fire":[{"packets":20,"volley":1,"low":true,"ammo":10,"target":35,"yield":50,"eccm":0}],"template":"Missile Destroyer A"},\
		"Missile Destroyer 2": {"unit":{"name":"Missile Destroyer 2","type":"Starship","defense":15,"size":6,"cost": 77},"hull": {"max":11,"current":11},"shield": {"max":0,"current":0},"direct-fire":[],"packet-fire":[{"packets":20,"volley":1,"low":true,"ammo":10,"target":35,"yield":50,"eccm":0}],"template":"Missile Destroyer A"},\
		"Missile Destroyer 3": {"unit":{"name":"Missile Destroyer 3","type":"Starship","defense":15,"size":6,"cost": 77},"hull": {"max":11,"current":11},"shield": {"max":0,"current":0},"direct-fire":[],"packet-fire":[{"packets":20,"volley":1,"low":true,"ammo":10,"target":35,"yield":50,"eccm":0}],"template":"Missile Destroyer A"},\
		"Missile Destroyer 4": {"unit":{"name":"Missile Destroyer 4","type":"Starship","defense":15,"size":6,"cost": 77},"hull": {"max":11,"current":11},"shield": {"max":0,"current":0},"direct-fire":[],"packet-fire":[{"packets":20,"volley":1,"low":true,"ammo":10,"target":35,"yield":50,"eccm":0}],"template":"Missile Destroyer A"},\
		"Missile Destroyer 5": {"unit":{"name":"Missile Destroyer 5","type":"Starship","defense":15,"size":6,"cost": 77},"hull": {"max":11,"current":11},"shield": {"max":0,"current":0},"direct-fire":[],"packet-fire":[{"packets":20,"volley":1,"low":true,"ammo":10,"target":35,"yield":50,"eccm":0}],"template":"Missile Destroyer A"}\
	}\
}',
		defender: '{\
	"name":"Formick",\
	"faction":"The Buggers",\
	"breakoff":100,\
	"units":{\
		"Bugger Carrier": {"unit": {"name":"Bugger Carrier","type":"Starship","defense":120,"target":60,"size":10,"cost": 408,"carrier": 60,"reserve":33},"hull": {"max":15,"current":15},"template":"Bug Carrier"},\
		"Firefly 01": {"unit": {"name":"Firefly 01","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 02": {"unit": {"name":"Firefly 02","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 03": {"unit": {"name":"Firefly 03","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 04": {"unit": {"name":"Firefly 04","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 05": {"unit": {"name":"Firefly 05","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 06": {"unit": {"name":"Firefly 06","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 07": {"unit": {"name":"Firefly 07","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 08": {"unit": {"name":"Firefly 08","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 09": {"unit": {"name":"Firefly 09","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 10": {"unit": {"name":"Firefly 10","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 11": {"unit": {"name":"Firefly 11","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 12": {"unit": {"name":"Firefly 12","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 13": {"unit": {"name":"Firefly 13","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 14": {"unit": {"name":"Firefly 14","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 15": {"unit": {"name":"Firefly 15","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 16": {"unit": {"name":"Firefly 16","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 17": {"unit": {"name":"Firefly 17","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 18": {"unit": {"name":"Firefly 18","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 19": {"unit": {"name":"Firefly 19","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 20": {"unit": {"name":"Firefly 20","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 21": {"unit": {"name":"Firefly 21","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 22": {"unit": {"name":"Firefly 22","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 23": {"unit": {"name":"Firefly 23","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 24": {"unit": {"name":"Firefly 24","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 25": {"unit": {"name":"Firefly 25","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 26": {"unit": {"name":"Firefly 26","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 27": {"unit": {"name":"Firefly 27","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 28": {"unit": {"name":"Firefly 28","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 29": {"unit": {"name":"Firefly 29","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 30": {"unit": {"name":"Firefly 30","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 31": {"unit": {"name":"Firefly 31","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 32": {"unit": {"name":"Firefly 32","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 33": {"unit": {"name":"Firefly 33","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 34": {"unit": {"name":"Firefly 34","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 35": {"unit": {"name":"Firefly 35","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 36": {"unit": {"name":"Firefly 36","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 37": {"unit": {"name":"Firefly 37","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 38": {"unit": {"name":"Firefly 38","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 39": {"unit": {"name":"Firefly 39","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 40": {"unit": {"name":"Firefly 40","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 41": {"unit": {"name":"Firefly 41","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 42": {"unit": {"name":"Firefly 42","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 43": {"unit": {"name":"Firefly 43","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 44": {"unit": {"name":"Firefly 44","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 45": {"unit": {"name":"Firefly 45","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 46": {"unit": {"name":"Firefly 46","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 47": {"unit": {"name":"Firefly 47","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 48": {"unit": {"name":"Firefly 48","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 49": {"unit": {"name":"Firefly 49","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 50": {"unit": {"name":"Firefly 50","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 51": {"unit": {"name":"Firefly 51","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 52": {"unit": {"name":"Firefly 52","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 53": {"unit": {"name":"Firefly 53","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 54": {"unit": {"name":"Firefly 54","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 55": {"unit": {"name":"Firefly 55","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 56": {"unit": {"name":"Firefly 56","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 57": {"unit": {"name":"Firefly 57","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 58": {"unit": {"name":"Firefly 58","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 59": {"unit": {"name":"Firefly 59","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"},\
		"Firefly 60": {"unit": {"name":"Firefly 60","type":"Fighter","defense":120,"target":60,"size":1,"cost":5},"hull": {"max":1,"current":1},"direct-fire":[{"volley":[1,2],"sticky":true,"target":10,"short":true}],"template":"Firefly Larvae"}\
	}}'
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
			if(event.data.done) {
				self.stopCombat();
			}
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
		this.fleets.attacker.combat = {};
		this.fleets.attacker.combat.unitCount = _.keys(obj.units).length;
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
		this.fleets.defender.combat = {};
		this.fleets.defender.combat.unitCount = _.keys(obj.units).length;
		$log.log(obj)
	};

	this.clearDefender = function() {
		$log.log("Clearing defending fleet!");
		delete this.fleets.defender;
		this.fleets.defender = {};
	};
}]);