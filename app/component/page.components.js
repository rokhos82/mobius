////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Page Alerts Component
////////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.pageAlerts = {};
mobiusEngine.pageAlerts.alert = function(msg,type,timeout) {
	this.type = type || "warning";
	this.msg = msg || "";
	this.timeout = timeout || undefined;
};
mobiusEngine.pageAlerts.controller = function($scope) {
	this.closeAlert = function(index) {
		this.alerts.splice(index,1);
	};
};

mobiusEngine.app.component("pageAlerts",{
	template: '<div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div uib-alert ng-repeat="alert in $ctrl.alerts" ng-class="\'alert-\' + (alert.type || \'warning\')" close="$ctrl.closeAlert($index)" dismiss-on-timeout={{alert.timeout}}>{{alert.msg}}</div></div></div>',
	controller: ["$scope",mobiusEngine.pageAlerts.controller],
	bindings: {
		alerts: "="
	}
});