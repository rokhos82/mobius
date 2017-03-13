////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Simulator Main UI
////////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.simulator = {};
mobiusEngine.simulator.states = {
	"setup": "setup",
	"ready": "ready",
	"start": "start",
	"stop": "stop"
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// 
////////////////////////////////////////////////////////////////////////////////////////////////////

// Unit Card ///////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.simulator.controller = function($scope) {
	var $ctrl = this;

	$ctrl.alerts = [];
	$ctrl.state = undefined;

	$ctrl.start = function() {
		$ctrl.alerts.unshift(new mobiusEngine.pageAlerts.alert("Starting the simulator!","success",3500));
	};

	$ctrl.dump = function() {
		$ctrl.alerts.unshift(new mobiusEngine.pageAlerts.alert("Successfully dumped data to console log.","info",2000));
	};

	$ctrl.$onInit = function() {
		$ctrl.state = mobiusEngine.simulator.states.setup;
	};
};

mobiusEngine.app.component("simulatorMain",{
	templateUrl: 'app/component/simulator.main.html',
	controller: ["$scope",mobiusEngine.simulator.controller],
	bindings: {}
});