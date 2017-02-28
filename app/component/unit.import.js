////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Unit Import Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit.importController = function($scope,_data) {
	var json = atob(this.import);
	console.log(json);
};

mobiusEngine.app.component("unitImport",{
	template: '<div class="jumbotron">Your unit has been imported!</div>',
	controller: ["$scope","mobius.data.unit",mobiusEngine.unit.importController],
	bindings: {
		import: "<"
	}
});