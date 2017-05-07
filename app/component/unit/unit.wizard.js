mobius.unit.wizard = {};

mobius.unit.wizard.ctrl = function($scope) {
	var $ctrl = this;

	$ctrl.unit = {
		general: {
			size: undefined
		},
		defenses: {},
		weapons: {},
		other: {}
	};

	// Contraints to make sure the unit is valid
	$ctrl.constraints = {};
	$ctrl.constraints.general = {
		size: {
			placeholder: 6,
			max: 20
		}
	};
	$ctrl.constraints.defenses = {
		armor: {
			placeholder: $ctrl.constraints.general.size.placeholder * 0.5,
			max: $ctrl.unit.general.size * 0.5
		}
	};

	$ctrl.$onInit = function() {
		$ctrl.options = $ctrl.resolve.options;
	};

	$ctrl.sizeUpdate = function() {
		$ctrl.constraints.defenses.armor.max = $ctrl.unit.general.size * 0.5;
	};

	$ctrl.updateArmor = function() {
		var defenses = $ctrl.unit.defenses;
		var max = $ctrl.constraints.defenses.armor.max;
		if(defenses.armor > max) {
			// Reset the armor to the max
			defenses.armor = max;
		}
		else if(defenses.armor < 0) {
			// Reset the armor to zero since negative armor makes no sense.
			defenses.armor = 0;
		}
	};

	// Setup $watch functions for different parts of the unit object
	$scope.$watch("$ctrl.unit.general.size",$ctrl.sizeUpdate,true);
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
