////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Unit Import Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit.importController = function($scope,_data) {
	var json = atob(this.import);
	var unit = JSON.parse(json);
	_data.addUnit(unit);
};

mobiusEngine.app.component("unitImport",{
	template: '<div class="jumbotron">Your unit has been imported!</div>',
	controller: ["$scope","mobius.data.unit",mobiusEngine.unit.importController],
	bindings: {
		import: "<"
	}
});