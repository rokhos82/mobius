////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Engine Data Service
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.data = {};

mobiusEngine.data.defaults = {};
mobiusEngine.data.defaults.simulation = {
	"uuid": "",
	"summary": {},
	"logs": []
};
mobiusEngine.data.defaults.fleet = {
	"name": "",
	"faction": "",
	"breakoff": 0,
	"uuid": undefined,
	"units": {}
};
mobiusEngine.data.defaults.realUnit = {
	"hull": {
		"current": 0
	},
	"shield": {
		"current": 0
	},
	"template": ""
};
mobiusEngine.data.defaults.directFireGroup = {
	"batteries": 1,
	"gun": 1,
	"size": 1,
	"volley": 2
};

mobiusEngine.data.events = {};
mobiusEngine.data.events.dirty = "mobius.data.dirty";

mobiusEngine.data.factory = function($rootScope) {
	var service = {};
	var _data = {
		"simulations": {},
		"fleets": {},
		"units": {}
	};

	var _indexed = undefined;

	var _state = {
		"loaded": false
	};

	function saveToLocalStorage() {
		localStorage.setItem('mobius.data.simulations',JSON.stringify(_data.simulations));
		localStorage.setItem('mobius.data.fleets',JSON.stringify(_data.fleets));
		localStorage.setItem('mobius.data.units',JSON.stringify(_data.units));
	}

	$rootScope.$on(mobiusEngine.data.events.dirty,saveToLocalStorage);

	if(!_state.loaded) {
		_data.simulations = JSON.parse(localStorage.getItem('mobius.data.simulations')) || {};
		_data.fleets = JSON.parse(localStorage.getItem('mobius.data.fleets')) || {};
		_data.units = JSON.parse(localStorage.getItem('mobius.data.units')) || {};

		var unitDBRequest = indexedDB.open("mobius",1);
		unitDBRequest.onerror = function(event) {
			console.error("The indexedDB did not open! :(");
			console.error("Database eroor: " + event.target.errorCode);
		};
		unitDBRequest.onsuccess = function(event) {
			console.log("indexedDB openned successfully! :)");
			_indexed = event.target.result;
		};
		unitDBRequest.onupgradeneeded = function(event) {
			// Fill this out with initialization code for the database stores.
			var db = event.target.result;
		};

		_state.loaded = true;
	}

	service.getSimulationStore = function() {return _data.simulations;};
	service.getFleetStore = function() {return _data.fleets;};
	service.getUnitStore = function() {return _data.units;};
	service.purgeUnitStore = function() {
		delete _data.units;
		_data.units = {};
		$rootScope.$broadcast(mobiusEngine.data.events.dirty);
	};

	return service;
};

mobiusEngine.data.simulation = function($rootScope,_mData) {
	var service = {};
	var _data = _mData.getSimulationStore();

	service.addSimulation = function(sim) {
		if(service.validateSimulation(sim)) {
			// The simulation object is valid.
			// Does the key already exist?
			var key = sim.uuid;
			if(_.isUndefined(_data[key])) {
				_data[key] = sim;
				$rootScope.$broadcast(mobiusEngine.data.events.dirty);
			}
		}
		console.log(_data);
	};

	service.getSimulation = function(key) {
		var ret = undefined;

		// Is key defined?
		if(_.isUndefined(key)) {
			// Yes, then return a list of all simulations
			ret = _.keys(_data);
		}
		else {
			// No, return the specified simulation
			ret = _data[key];
		}

		return ret;
	};

	service.deleteSimulation = function(key) {
		var obj = _data[key];
		delete _data[key];
		$rootScope.$broadcast(mobiusEngine.data.events.dirty);
		return obj;
	};
	
	service.validateSimulation = function(sim) {
		var valid = true;

		if(!sim.uuid) {
			valid = false;
		}

		return valid;
	};

	service.newSimulation = function() {
		return angular.copy(mobiusEngine.data.defaults.simulation);
	};

	return service;
};

// FleetService ------------------------------------------------------------------------------------
mobiusEngine.data.fleet = function($rootScope,_mData) {
	var service = {};
	var _data = _mData.getFleetStore();

	service.addFleet = function(fleet) {
		if(service.validateFleet(fleet)) {
			// Get the key from the fleet
			var key = fleet.uuid;
			// Does the key already exist in the database?
			if(!_data[key]) {
				// No, then add the fleet.
				_data[key] = fleet;
				$rootScope.$broadcast(mobiusEngine.data.events.dirty);
			}
			else {
				// Yes, then panic!
			}
		}
	};
	service.getFleet = function(key) {
		return _data[key];
	};
	service.getAllFleets = function() {
		return _.keys(_data);
	};
	service.updateFleet = function(key) {};
	service.deleteFleet = function(key) {
		delete _data[key];
		$rootScope.$broadcast(mobiusEngine.data.events.dirty);
	};
	service.validateFleet = function(fleet) {
		var valid = true;

		if(!fleet.uuid) {
			valid = false;
		}

		if(!fleet.name) {
			valid = false;
		}

		return valid;
	};
	service.newFleet = function() {
		return angular.copy(mobiusEngine.data.defaults.fleet);
	};
	service.addUnit = function(fleet,unit) {
		var key = unit.uuid;
		if(_.isObject(fleet)) {
			fleet.units[key] = unit;
		}
		else if(_.isString(fleet)) {
			_data[fleet].units[key] = unit;
		}
	};

	service.deleteUnit = function(fleet,unit) {
		var key = unit;
		if(_.isObject(fleet)) {
			delete fleet.units[key];
		}
		else {
			delete _data[fleet].units[key];
		}
	};

	return service;
};

// UnitService -------------------------------------------------------------------------------------
mobiusEngine.data.unit = function($rootScope,_mData) {
	var service = {};
	var _data = _mData.getUnitStore();

	service.addUnit = function(unit) {
		if(service.validateUnit(unit)) {
			// Get the key from the unit object
			var key = unit.uuid;
			// Does the key already exist in the database?
			if(!_data[key]) {
				// No.  Add the unit.
				_data[key]  = unit;
				$rootScope.$broadcast(mobiusEngine.data.events.dirty);
			}
			else {
				// Yes. Ahhhhhh!
				console.error(unit.uuid + " already exists!");
			}
		}
	};
	service.validateUnit = function(unit) {
		var valid = true;

		// Does the unit have a UUID field?
		if(!unit.uuid) {
			valid = false;
		}

		// Does the unit have a General sub-object and does the object have a
		// name, type, and size field?
		if(!(unit.general && unit.general.name && unit.general.type && unit.general.size)) {
			valid = false;
		}

		return valid;
	};
	service.getUnit = function(key) { return _data[key]; };
	service.getAllUnits = function() { return _.keys(_data); };
	service.deleteUnit = function(key) {
		var obj = _data[key];
		delete _data[key];
		$rootScope.$broadcast(mobiusEngine.data.events.dirty);
		return obj;
	};
	service.realUnit = function(uuid) {
		var unit = angular.copy(_data[uuid]);
		_.defaults(unit,mobiusEngine.data.defaults.realUnit);
		unit.template = unit.uuid;
		unit.uuid = window.uuid.v4();
		unit.hull.current = unit.hull.max;
		unit.shield.current = unit.shield.max;
		return unit;
	};
	service.deleteAllUnits = function() {
		_data = undefined;
		_mData.purgeUnitStore();
		_data = _mData.getUnitStore();
	};

	return service;
};

mobiusEngine.data.service = mobiusEngine.app.factory("mobius.data",["$rootScope",mobiusEngine.data.factory]);
mobiusEngine.data.simulationService = mobiusEngine.app.factory("mobius.data.simulation",["$rootScope","mobius.data",mobiusEngine.data.simulation]);
mobiusEngine.data.fleetService = mobiusEngine.app.factory("mobius.data.fleet",["$rootScope","mobius.data",mobiusEngine.data.fleet]);
mobiusEngine.data.unitService = mobiusEngine.app.factory('mobius.data.unit', ['$rootScope','mobius.data',mobiusEngine.data.unit]);