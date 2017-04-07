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
	$ctrl.ticks = [];

	$ctrl.start = function() {
		console.log("Starting simulator worker thread...");
		$ctrl.alerts.unshift(new mobius.templates.alert("Starting the simulator!","success",3500));
		$ctrl.state = mobiusEngine.simulator.states.start;
		$ctrl.worker = new Worker('app/app.simulator.js');
		$ctrl.worker.onmessage = function(event) {
			var blob = event.data;
			$ctrl.ticks.push(blob);
			console.log(blob);
		};
		$ctrl.worker.postMessage({});
	};

	$ctrl.stop = function() {
		console.log("Stoping the simulator worker thread...");
		$ctrl.alerts.unshift(new mobius.templates.alert("Stoping the simulator!","danger"));
		if($ctrl.worker) {
			$ctrl.worker.terminate();
			$ctrl.worker = undefined;
		}
	};

	$ctrl.reset = function() {
		$ctrl.alerts.unshift(new mobius.templates.alert("Reseting the simulator!","warning",1500));
		$ctrl.ticks.length = 0;
	};

	$ctrl.dump = function() {
		$ctrl.alerts.unshift(new mobius.templates.alert("Successfully dumped data to console log.","info",2000));
	};

	$ctrl.$onInit = function() {
		$ctrl.state = mobiusEngine.simulator.states.setup;
	};
};

mobiusEngine.app.component("simulatorMain",{
	templateUrl: 'app/component/simulator/simulator.main.html',
	controller: ["$scope",mobiusEngine.simulator.controller],
	bindings: {}
});