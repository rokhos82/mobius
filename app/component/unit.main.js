////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Unit Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit = {};

mobiusEngine.unit.calculateFirepower = function(unit) {
	var fp = {
		"direct": 0,
		"packet": 0
	};

	var _map = function(weapon) {
		var v = 0;
		
		if(_.isNumber(weapon.volley)) {
			v = weapon.volley;
		}
		else {
			_.each(weapon.volley,function(x){ v += x; });
		}
		
		return weapon.batteries * weapon.guns * v;
	};
	var _pmap = function(weapon) {
		return weapon.packets * weapon.volley;
	};
	var _reduce = function(memo,num) { return memo + num; };
	
	var direct = unit["direct-fire"];
	fp.direct = _.chain(direct).map(_map).reduce(_reduce,0).value();

	var packet = unit["packet-fire"];
	fp.packet = _.chain(packet).map(_pmap).reduce(_reduce,0).value();

	return fp.direct + fp.packet;
};

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

	this.alerts = [];

	this.units = _data.getAllUnits();

	this.getUnit = _data.getUnit;
	this.firepower = mobiusEngine.unit.calculateFirepower;

	this.toggleState = function(key) { this.states[key] = !this.states[key]; };

	this.onImport = function() {
		var imp = JSON.parse(this.import);
		if(_.isArray(imp)) {
			// Import an array of units
			var alert = new mobiusEngine.pageAlerts.alert("Successfully imported","success");
			for(var i in imp) {
				var unit = imp[i];
				unit.uuid = unit.uuid || window.uuid.v4();
				unit.general.firepower = mobiusEngine.unit.calculateFirepower(unit);
				_data.addUnit(unit);
				alert.msg += " " + unit.general.name;
			}
			this.alerts.push(alert);
		}
		else if(_.isObject(imp)) {
			// Import a single unit
			imp.uuid = imp.uuid || window.uuid.v4();
			imp.general.firepower = mobiusEngine.unit.calculateFirepower(imp);
			_data.addUnit(imp);
			this.alerts.push(new mobiusEngine.pageAlerts.alert("Successfully imported " + unit.general.name,"success"));
		}
		else {
			// Not sure what is being imported but it is not expected.
			console.log("Unexpected data sent to unit import.");
		}

		this.units = _data.getAllUnits();
		this.import = undefined;
	};

	this.onDelete = function(uuid) {
		_data.deleteUnit(uuid);
		this.units = _data.getAllUnits();
	};

	this.onDeleteAll = function() {
		_data.deleteAllUnits();
		this.units = _data.getAllUnits();
	};

	this.listUnits = function() {
		var dict = {};
		_.each(this.units,function(uuid) {
			dict[uuid] = _data.getUnit(uuid);
		});
		return dict;
	};
};

mobiusEngine.app.component("unitMain",{
	templateUrl: 'app/component/unit.main.html',
	controller: ["$scope","mobius.data.unit",mobiusEngine.unit.controller],
	bindings: {}
});