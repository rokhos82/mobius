mobius.unit.wizard = {};

mobius.unit.wizard.ctrl = function($scope) {
	var $ctrl = this;

	$ctrl.unit = {
		general: {},
		defenses: {},
		weapons: {},
		other: {}
	};

	$ctrl.$onInit = function() {
		$ctrl.options = $ctrl.resolve.options;
	};
};

mobius.app.component("unitWizard",{
	templateUrl: 'app/component/unit/unit.wizard.html',
	controller: ["$scope",mobius.unit.wizard.ctrl],
	bindings: {
		resolve: "<",
		dismiss: "&",
		close: "&"
	}
});
