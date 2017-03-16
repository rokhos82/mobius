////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Fleet Namespace
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.fleet = {};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Fleet Controller
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.fleet.controller = function($scope,_data) {
	this.fleets = _data.getAllFleets();
	this.import = "";
	this.create = {
		"name": "",
		"faction": "",
		"breakoff": 75,
		"uuid": window.uuid.v4()
	};
	this.states = {
		controls: false
	};

	this.getFleet = _data.getFleet;

	this.onDelete = function(key) {
		_data.deleteFleet(key);
		this.fleets = _data.getAllFleets();
	};

	this.onCreate = function() {
		var fleet = _data.newFleet();
		fleet.name = this.create.name;
		fleet.uuid = this.create.uuid;
		fleet.faction = this.create.faction;
		fleet.breakoff = this.create.breakoff;
		_data.addFleet(fleet);
		
		this.fleets = _data.getAllFleets();
		this.create.name = "";
		this.create.faction = "";
		this.create.breakoff = 75;
		this.create.uuid = window.uuid.v4();
	};

	this.onImport = function() {};

	this.toggleState = function(key) { this.states[key] = !this.states[key]; };
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Fleet Component
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("fleetMain",{
	templateUrl: 'app/component/fleet/fleet.main.html',
	controller: ["$scope","mobius.data.fleet",mobiusEngine.fleet.controller],
	bindings: {}
});