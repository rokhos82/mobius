////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Unit Detail Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit.dtlController = function($scope,_data) {
	this.unit = _data.getUnit(this.uuid);
	this.link = "http://rokhos82.github.io/mobius/#/unit/import/" + btoa(angular.toJson(this.unit));
};

mobiusEngine.app.component("unitDetail",{
	templateUrl: 'app/component/unit.detail.html',
	controller: ["$scope","mobius.data.unit",mobiusEngine.unit.dtlController],
	bindings: {
		uuid: "<"
	}
});