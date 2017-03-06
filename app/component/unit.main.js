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

mobiusEngine.unit.controller = function($scope,_data,$uibModal) {
	var $ctrl = this;
	
	this.alerts = [];

	this.units = _data.getAllUnits();

	this.getUnit = _data.getUnit;
	this.firepower = mobiusEngine.unit.calculateFirepower;

	this.toggleState = function(key) { this.states[key] = !this.states[key]; };

	$ctrl.onImport = function(importJSON) {
		var imp = JSON.parse(importJSON);
		if(_.isArray(imp)) {
			// Import an array of units
			for(var i in imp) {
				var unit = imp[i];
				unit.uuid = unit.uuid || window.uuid.v4();
				unit.general.firepower = mobiusEngine.unit.calculateFirepower(unit);
				_data.addUnit(unit);
				$ctrl.alerts.push(new mobiusEngine.pageAlerts.alert("Successfully imported " + unit.general.name,"success",5000));
			}
		}
		else if(_.isObject(imp)) {
			// Import a single unit
			imp.uuid = imp.uuid || window.uuid.v4();
			imp.general.firepower = mobiusEngine.unit.calculateFirepower(imp);
			_data.addUnit(imp);
			$ctrl.alerts.push(new mobiusEngine.pageAlerts.alert("Successfully imported " + imp.general.name,"success",2000));
		}
		else {
			// Not sure what is being imported but it is not expected.
			console.log("Unexpected data sent to unit import.");
		}

		$ctrl.units = _data.getAllUnits();
	};

	this.deleteUnit = function(uuid) {
		var u = _data.deleteUnit(uuid);
		this.units = _data.getAllUnits();
		this.alerts.push(new mobiusEngine.pageAlerts.alert("Deleted " + u.general.name,"warning",2000));
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

	$ctrl.openImportModal = function() {
		var modal = $uibModal.open({
			animation: true,
			component: "importModal",
			resolve: {
				options: function(){return {title:"Unit Import",msg:"Use the JSON string below to share units."};}
			}
		});

		modal.result.then(function(importJSON){
			$ctrl.onImport(importJSON);
		});
	};

	$ctrl.openExportModal = function() {

		var modal = $uibModal.open({
			animation: true,
			component: "exportModal",
			resolve: {
				options: function(){
					return { 
						title:"Unit Export",
						msg:"Use the text field below to import a unit JSON string."
					};
				},
				output: function(){
					var unitlist = [];
					_.each($ctrl.units,function(uuid){
						unitlist.push(_data.getUnit(uuid));
					});
					return unitlist;
				}
			}
		});
	};
};

mobiusEngine.app.component("unitMain",{
	templateUrl: 'app/component/unit.main.html',
	controller: ["$scope","mobius.data.unit","$uibModal",mobiusEngine.unit.controller],
	bindings: {}
});