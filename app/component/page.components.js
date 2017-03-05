////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Page Title Component
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.pageTitle = {};

mobiusEngine.pageTitle.controller = function($scope) {
};

mobiusEngine.app.component("pageTitle",{
	template: '<div class="jumbotron"><h3 class="mobius-title text-shadow-info">{{$ctrl.title}}</h3><p>{{$ctrl.message}}</p></div>',
	controller: ["$scope",mobiusEngine.pageTitle.controller],
	bindings: {
		title: "@",
		message: "@"
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Page Alerts Component
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.pageAlerts = {};
mobiusEngine.pageAlerts.alert = function(msg,type) {
	this.type = type || "warning";
	this.msg = msg || "";
};
mobiusEngine.pageAlerts.controller = function($scope) {
	this.closeAlert = function(index) {
		this.alerts.splice(index,1);
	};
};

mobiusEngine.app.component("pageAlerts",{
	template: '<div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div uib-alert ng-repeat="alert in $ctrl.alerts" ng-class="\'alert-\' + (alert.type || \'warning\')" close="$ctrl.closeAlert($index)">{{alert.msg}}</div></div></div>',
	controller: ["$scope",mobiusEngine.pageAlerts.controller],
	bindings: {
		alerts: "="
	}
});