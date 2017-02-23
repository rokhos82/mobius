////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Unit Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit = {};

mobiusEngine.unit.controller = function() {
	this.states = {
		controls: false
	}

	this.import = undefined;

	this.units = {};

	this.toggleState = function(key) { this.states[key] = !this.states[key]; };

	this.onImport = function() {
		var imp = JSON.parse(this.import);
		if(_.isArray(this.import)) {
			// Import an array of units
		}
		else if(_.isObject(this.import)) {
			// Import a single unit
		}
		else {
			// Not sure what is being imported but it is not expected.
			console.log("Unexpected parameter type passed to onImport.  Expected array or object but was passed " + typeof(this.import));
		}
	};
};

mobiusEngine.app.component("unitMain",{
	templateUrl: 'app/component/unit.main.html',
	controller: mobiusEngine.unit.controller,
	bindings: {
		"units": "="
	}
});