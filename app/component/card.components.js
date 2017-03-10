////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Card Components
////////////////////////////////////////////////////////////////////////////////////////////////////

// Unit Card ///////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.unit.cardController = function($scope) {
	var $ctrl = this;
};

mobiusEngine.app.component("unitCard",{
	template: '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="panel ng-class:{\'panel-info\':hover,\'panel-primary\':!hover}" ng-mouseenter="hover = true" ng-mouseleave="hover = false"><div class="panel-heading mobius-unit-header"><a ui-sref="unitDtl({uuid:$ctrl.unit.uuid})">{{$ctrl.unit.general.name}}</a></div><table class="tabel table-striped table hover"><tbody><tr><td class="mobius-unit-stat col-md-6">Type:</td><td class="mobius-unit-stat">{{$ctrl.unit.general.type}}</td></tr><tr><td class="mobius-unit-stat col-md-6">Size:</td><td class="mobius-unit-stat">{{$ctrl.unit.general.size}}</td></tr><tr><td class="mobius-unit-stat col-md-6">Hull:</td><td class="mobius-unit-stat">{{$ctrl.unit.hull.max}}</td></tr><tr><td class="mobius-unit-stat col-md-6">Shield:</td><td class="mobius-unit-stat">{{$ctrl.unit.shield.max}}</td></tr><tr><td class="mobius-unit-stat col-md-6">Firepower:</td><td class="mobius-unit-stat">{{$ctrl.unit.general.firepower}}</td></tr><tr><td colspan="2" class="mobius-unit-button-cell"><button class="btn btn-primary mobius-unit-button" ng-click="$ctrl.detail($ctrl.unit.uuid)">Details</button></td></tr><tr><td colspan="2" class="mobius-unit-button-cell"><button class="btn btn-danger mobius-unit-button" ng-click="$ctrl.delete()">Delete</button></td></tr></tbody></table><div class="panel-footer mobius-unit-footer"><a ui-sref="unitDtl({uuid:$ctrl.unit.uuid})">{{$ctrl.unit.uuid}}</a></div></div></div>',
	controller: ["$scope",mobiusEngine.unit.cardController],
	bindings: {
		unit: "<",
		delete: "&",
		detail: "&"
	}
});

// Fleet Card //////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.fleet.cardController = function($scope) {};

mobiusEngine.app.component("fleetCard",{
	template: '',
	controller: ["$scope",mobiusEngine.fleet.cardController],
	bindings: {}
});