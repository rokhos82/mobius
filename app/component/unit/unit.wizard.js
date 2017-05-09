mobius.unit.wizard = {};

mobius.unit.wizard.ctrl = function($scope) {
	var $ctrl = this;

	// Unit object ---------------------------------------------------------------
	$ctrl.unit = {
		general: {
			size: undefined
		},
		defenses: {},
		weapons: {},
		other: {}
	};

	// Technology modifiers to the unit & constraints ----------------------------
	$ctrl.tech = {};
	$ctrl.tech.general = {};
	$ctrl.tech.general.size = {};
	$ctrl.tech.defenses = {};
	$ctrl.tech.defenses.armor = {
		multiplier: 0.5
	};

	// Contraints to make sure the unit is valid ---------------------------------
	$ctrl.constraints = {};
	$ctrl.constraints.general = {
		size: {
			placeholder: 6,
			min: 1,
			max: 20
		}
	};
	$ctrl.constraints.defenses = {
		armor: {
			placeholder: $ctrl.constraints.general.size.placeholder * $ctrl.tech.defenses.armor.multiplier,
			min: 0,
			max: $ctrl.unit.general.size * $ctrl.tech.defenses.armor.multiplier
		}
	};

	// Controller Methods --------------------------------------------------------
	$ctrl.$onInit = function() {
		$ctrl.options = $ctrl.resolve.options;
	};

	$ctrl.sizeUpdate = function() {
		$ctrl.constraints.defenses.armor.max = $ctrl.unit.general.size * 0.5;
	};

	$ctrl.validateSize = function() {
		// Unit Sub-Objects
		var general = $ctrl.unit.general;

		// Validate the unti size
		{
			// Make sure size is in range.
			let max = $ctrl.constraints.general.size.max;
			let min = $ctrl.constraints.general.size.min;
			general.size = (general.size > max) ? max : general.size;
			general.size = (general.size < min) ? min : general.size;
		}
		{
			// Update the armor maximum.
			let armor = Math.round(general.size * $ctrl.tech.defenses.armor.multiplier);
			$ctrl.constraints.defenses.armor.max = armor;
		}
	};

	$ctrl.validateArmor = function() {
		let defenses = $ctrl.unit.defenses;
		let max = $ctrl.constraints.defenses.armor.max;
		let min = $ctrl.constraints.defenses.armor.min;

		// Validate the range for armor
		defenses.armor = (defenses.armor > max) ? max : defenses.armor;
		defenses.armor = (defenses.armor < min) ? min : defenses.armor;

		// Invalidate the final hull value
	};

	// Setup $watch functions for different parts of the unit object -------------
	$scope.$watch("$ctrl.unit.general.size",$ctrl.validateArmor,true);
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
