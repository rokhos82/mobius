////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Unit Import Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit.importController = function($scope,$state) {
	var $ctrl = this;
	var json = atob(this.import);
	var unit = angular.fromJSON(json);
};

mobiusEngine.app.component("unitImport",{
	template: '<div class="jumbotron">Your unit has been imported!</div><page-alerts alerts="$ctrl.alerts"></page-alerts>',
	controller: ["$scope","$state",mobiusEngine.unit.importController],
	bindings: {
		import: "<"
	}
});