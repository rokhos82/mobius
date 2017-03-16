////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Page Title Component
////////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.pageTitle = {};

mobiusEngine.pageTitle.controller = function($scope) {
};

mobiusEngine.app.component("pageTitle",{
	templateUrl: 'app/component/shared/pagetitle/pagetitle.html',
	controller: ["$scope",mobiusEngine.pageTitle.controller],
	bindings: {
		title: "@",
		message: "@"
	}
});