mobius.unit.wizard = {};

mobius.unit.wizard.ctrl = function($scope) {
	var $ctrl = this;
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