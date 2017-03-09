////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Unit Detail Component
////////////////////////////////////////////////////////////////////////////////////////////////

mobiusEngine.unit.dtlController = function($scope,_data) {
	var $ctrl = this;
	$ctrl.unit = _data.getUnit($ctrl.uuid);
	$ctrl.link = "http://rokhos82.github.io/mobius/#/unit/import/" + btoa(angular.toJson($ctrl.unit));

	$ctrl.sectionFilter = function(value,index,arr) {
		return _.omit($ctrl.unit,["direct-fire","packet-fire","uuid"]);
	};

	$ctrl.addAttribute = function(section,attribute) {
		var key = attribute.toLowerCase();
		section[key] = 0;
	};

	$ctrl.addSection = function(section) {
		var key = section.toLowerCase();
		$ctrl.unit[key] = {};
	};

	$ctrl.removeAttribute = function(section,key) {
		delete section[key];
	};
};

mobiusEngine.app.component("unitDetail",{
	templateUrl: 'app/component/unit.detail.html',
	controller: ["$scope","mobius.data.unit",mobiusEngine.unit.dtlController],
	bindings: {
		uuid: "<"
	}
});