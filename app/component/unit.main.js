////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Unit Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit = {};

mobiusEngine.unit.validate = function(obj) {
	var valid = true;

	// Check if the object has a "general" sub-object and that sub-object has a name, type,
	// and size attribute.
	if(!(obj.general && obj.general.name && obj.general.type && obj.general.size)) { valid = false; }

	// Check 

	return valid;
};

mobiusEngine.unit.controller = function($scope,_data) {
	this.states = {
		controls: false
	}

	this.import = undefined;

	this.units = _data.getAllUnits();

	this.getUnit = _data.getUnit;

	this.toggleState = function(key) { this.states[key] = !this.states[key]; };

	this.onImport = function() {
		var imp = JSON.parse(this.import);
		if(_.isArray(imp)) {
			console.log("import an array");
			// Import an array of units
			for(var i in imp) {
				var unit = imp[i];
				unit.uuid = unit.uuid || window.uuid.v4();
				_data.addUnit(unit);
			}
		}
		else if(_.isObject(imp)) {
			// Import a single unit
			imp.uuid = imp.uuid || window.uuid.v4();
			_data.addUnit(imp);
		}
		else {
			// Not sure what is being imported but it is not expected.
			console.log("Unexpected data sent to unit import.");
		}

		this.units = _data.getAllUnits();
	};
};

mobiusEngine.app.component("unitMain",{
	templateUrl: 'app/component/unit.main.html',
	controller: ["$scope","mobius.data.unit",mobiusEngine.unit.controller],
	bindings: {
		"units": "="
	}
});