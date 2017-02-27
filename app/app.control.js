////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////

// Mobius Engine States ------------------------------------------------------------------------
// Simulation State Cycle:
//   1. Preparing - prior to fleet data importing.  Two fleets must be imported prior to moving
//		"ready" state.
//   2. Ready - fleets are imported and combat simulation can be started.
//   3. Running - combat simulation has been started and is currently running.
//   4. Finished - combat simulation has completed.  A combat summary will be displayed and
//		the combat log can be downloaded as a text file.
// Clearing the combat simulation returns the engine to a "ready" state.
mobiusEngine.states = {
	reset: "reset",
	started: "started",
	stopped: "stopped",
	running: "running",
	ready: "ready",
	preparing: "preparing",
	finished: "finished"
};

// Mobius Engine Message Types -----------------------------------------------------------------
// entry - this is a message that contains a combat turn of log information
// summary - this is a message that contains the final summary of a full combat simulation
mobiusEngine.messageTypes = {
	entry: "entry",
	summary: "summary"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Engine Controller
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.controller = mobiusEngine.app.controller("mobiusCtl",["$location",function($location){
	// Added a redirect from mobius/ to mobius/#/ so that the mainWelcome state is encountered
	if($location.path() === "") {
		$location.url("/");
	}
}]);