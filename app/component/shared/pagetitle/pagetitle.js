////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Page Title Component
////////////////////////////////////////////////////////////////////////////////////////////////////
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