////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Modal Components
////////////////////////////////////////////////////////////////////////////////////////////////////

// Import Modal ////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("importModal",{
	template: '<div class="modal-header"><h3 class="modal-title mobius-title text-info">{{$ctrl.options.title}}</h3></div><div class="modal-body"><div class="well well-sm">{{$ctrl.options.msg}}</div><textarea class="form-control mobius-import" ng-model="$ctrl.json"></textarea></div><div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="$ctrl.import()">Import</button><button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Cancel</button></div>',
	controller: ["$scope",function($scope){
		$ctrl = this;

		$ctrl.json = undefined;

		$ctrl.import = function() {
			$ctrl.close({$value:$ctrl.json});
		};

		$ctrl.cancel = function() {
			$ctrl.dismiss({$value:'cancel'});
		};

		$ctrl.$onInit = function() {
			$ctrl.options = $ctrl.resolve.options;
		};
	}],
	bindings: {
		resolve: "<",
		dismiss: "&",
		close: "&"
	}
});

// Export Modal ////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("exportModal",{
	template: '<div class="modal-header"><h3 class="modal-title mobius-title text-info">{{$ctrl.options.title}}</h3></div><div class="modal-body"><div class="well well-sm">{{$ctrl.options.msg}}</div><textarea class="form-control mobius-export" ng-model="$ctrl.json" readonly="readyonly"></textarea></div><div class="modal-footer"><button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Close</button></div>',
	controller: ["$scope",function($scope){
		$ctrl = this;

		$ctrl.import = function() {
			$ctrl.close({$value:$ctrl.json});
		};

		$ctrl.cancel = function() {
			$ctrl.dismiss({$value:'cancel'});
		};

		$ctrl.$onInit = function() {
			$ctrl.options = $ctrl.resolve.options;
			$ctrl.json = $ctrl.resolve.json;
		};
	}],
	bindings: {
		resolve: "<",
		dismiss: "&",
		close: "&"
	}
});
