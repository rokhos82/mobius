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
	template: '<div class="modal-header"><h3 class="modal-title mobius-title text-info">{{$ctrl.options.title}}</h3></div><div class="modal-body"><div class="well well-sm">{{$ctrl.options.msg}}</div><textarea class="form-control mobius-export" ng-model="$ctrl.json" readonly="readyonly"></textarea><div class="form-group mobius-top-lg"><div class="input-group"><span class="input-group-addon">Import URL</span><input type="text" id="importUrl" class="form-control" ng-model="$ctrl.importUrl" /></div></div><div class="form-group mobius-top-lg"><div class="input-group"><span class="input-group-addon">Github URL</span><input type="text" id="importUrl" class="form-control" ng-model="$ctrl.githubUrl" /></div></div></div><div class="modal-footer"><button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Close</button></div>',
	controller: ["$scope","$location",function($scope,$location){
		$ctrl = this;

		$ctrl.import = function() {
			$ctrl.close({$value:$ctrl.json});
		};

		$ctrl.cancel = function() {
			$ctrl.dismiss({$value:'cancel'});
		};

		$ctrl.$onInit = function() {
			$ctrl.options = $ctrl.resolve.options;
			$ctrl.output = $ctrl.resolve.output;
			$ctrl.json = angular.toJson($ctrl.output,true);
			$ctrl.base64 = btoa(angular.toJson($ctrl.output));
			$ctrl.importUrl = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/mobius/#/unit/import/" + $ctrl.base64;
			$ctrl.githubUrl = "https://rokhos82.github.io/mobius/#/unit/import/" + $ctrl.base64;
		};
	}],
	bindings: {
		resolve: "<",
		dismiss: "&",
		close: "&"
	}
});

// Confirmation Modal //////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("confirmModal",{
	template: '<div class="modal-header"><h3 class="modal-title mobius-title text-info">{{$ctrl.options.ttl}}</h3></div><div class="modal-body"><div class="well well-sm">{{$ctrl.options.msg}}</div></div><div class="modal-footer"><button class="btn btn-danger" type="button" ng-click="$ctrl.confirm()">Yes</button><button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">No</button></div>',
	controller: ["$scope","$location",function($scope,$location){
		const $ctrl = this;

		$ctrl.confirm = function() {
			console.log("Close the confirmation modal");
			$ctrl.close({$value:'confirm'});
		};

		$ctrl.cancel = function() {
			$ctrl.dismiss({$value:'cancel'});
		};

		$ctrl.$onInit = function() {
			console.log("Modal $onIinit");
			$ctrl.options = $ctrl.resolve.options;
		};
	}],
	bindings: {
		resolve: "<",
		dismiss: "&",
		close: "&"
	}
});
