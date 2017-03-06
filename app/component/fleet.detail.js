////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Fleet Detail Controller
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.fleet.dtlController = function($scope,_fdata,_udata) {
	this.alerts = [];
	this.fleet = _fdata.getFleet(this.uuid);
	this.add = {
		unit: _udata.getAllUnits()[0],
		count: 1
	};

	this.getAllUnits = function() {
		var keys = _udata.getAllUnits();
		var dict = {};
		_.each(keys,function(key){
			dict[key] = _udata.getUnit(key);
		});
		return dict;
	};

	this.onSave = function() {
		$scope.$emit(mobiusEngine.data.events.dirty);
		this.alerts.push(new mobiusEngine.pageAlerts.alert("Successfully saved " + this.fleet.name,"success",1500));
	};

	this.onAddUnit = function() {
		var uuid = this.add.unit;
		var count = this.add.count;
		for(var i = 0;i < count;i++) {
			var unit = _udata.realUnit(uuid);
			unit.general.name += " " + (i + 1);
			_fdata.addUnit(this.fleet,unit);
		}
	};

	this.getTemplate = function(uuid) {
		var template = _udata.getUnit(uuid);
		return template.general.name;
	};

	this.onDeleteUnit = function(uuid) {
		_fdata.deleteUnit(this.fleet,uuid);
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Fleet Detail Component
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("fleetDetail",{
	templateUrl: 'app/component/fleet.detail.html',
	controller: ["$scope","mobius.data.fleet","mobius.data.unit",mobiusEngine.fleet.dtlController],
	bindings: {
		uuid: "<"
	}
});