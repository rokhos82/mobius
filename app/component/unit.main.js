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

mobiusEngine.unit.controller = function($scope) {
	this.states = {
		controls: false
	}

	this.import = undefined;

	this.units = {};

	this.toggleState = function(key) { this.states[key] = !this.states[key]; };

	this.onImport = function() {
		var imp = JSON.parse(this.import);
		if(_.isArray(imp)) {
			console.log("import an array");
			// Import an array of units
			for(var i in imp) {
				var unit = imp[i];
				var uuid = unit.uuid || window.uuid.v4();
				this.units[uuid] = unit;
				this.units[uuid].uuid = uuid;
			}
		}
		else if(_.isObject(imp)) {
			console.log("import a single object");
			// Import a single unit
			var uuid = imp.uuid || window.uuid.v4();
			this.units[uuid] = imp;
			this.units[uuid].uuid = uuid;
		}
		else {
			// Not sure what is being imported but it is not expected.
			console.log("Unexpected data sent to unit import.");
		}
	};
};

mobiusEngine.app.component("unitMain",{
	templateUrl: 'app/component/unit.main.html',
	controller: ["$scope",mobiusEngine.unit.controller],
	bindings: {
		"units": "="
	}
});