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

mobiusEngine.data.events = {};
mobiusEngine.data.events.dirty = "mobius.data.dirty";

mobiusEngine.data.factory = function($rootScope) {
	var service = {};
	var _data = {
		"simulations": {},
		"fleets": {},
		"units": {}
	};

	var _state = {
		"loaded": false
	};

	$rootScope.$on(mobiusEngine.data.events.dirty,function(){
		localStorage.setItem('mobius.data.simulations',JSON.stringify(_data.simulations));
		localStorage.setItem('mobius.data.fleets',JSON.stringify(_data.fleets));
		localStorage.setItem('mobius.data.units',JSON.stringify(_data.units));
		console.log("Saving to localStorage");
	});

	if(!_state.loaded) {
		_data.simulations = JSON.parse(localStorage.getItem('mobius.data.simulations')) || {};
		_data.fleets = JSON.parse(localStorage.getItem('mobius.data.fleets')) || {};
		_data.units = JSON.parse(localStorage.getItem('mobius.data.units')) || {};
		_state.loaded = true;
	}

	service.getSimulationStore = function() {return _data.simulations;};
	service.getFleetStore = function() {return _data.fleets;};
	service.getUnitStore = function() {return _data.units;};

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
		return obj;
	};
	
	service.validateSimulation = function(sim) {
		var valid = false;

		if(sim.uuid) {
			valid = true;
		}

		return valid;
	};

	service.newSimulation = function() {
		return angular.copy(mobiusEngine.data.defaults.simulation);
	};

	return service;
};

mobiusEngine.data.fleet = function($rootScope,_mData) {
	var service = {};
	var _data = _mData.getFleetStore();

	service.addFleet = function(sim) {};
	service.getFleet = function(key) {};
	service.updateFleet = function(key) {};
	service.deleteFleet = function(key) {};
	service.validateFleet = function(sim) {};

	return service;
};

mobiusEngine.data.service = mobiusEngine.app.factory("mobius.data",["$rootScope",mobiusEngine.data.factory]);
mobiusEngine.data.simulationService = mobiusEngine.app.factory("mobius.data.simulation",["$rootScope","mobius.data",mobiusEngine.data.simulation]);
mobiusEngine.data.fleetService = mobiusEngine.app.factory("mobius.data.fleet",["$rootScope","mobius.data",mobiusEngine.data.fleet]);