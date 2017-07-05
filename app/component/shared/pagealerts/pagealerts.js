////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Page Alerts Component
////////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.pageAlerts = {};
mobius.pageAlerts = mobiusEngine.pageAlerts;
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
	templateUrl: 'app/component/shared/pagealerts/pagealerts.html',
	controller: ["$scope",mobiusEngine.pageAlerts.controller],
	bindings: {
		alerts: "="
	}
});
