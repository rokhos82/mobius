////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Main Welcome Component
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app.component("mainWelcome",{
	templateUrl: 'app/component/main/main.welcome.html',
	controller: ["$http","$sanitize",function($http,$sanitize){
		var $ctrl = this;
		$ctrl.$sanitize = $sanitize;
		$ctrl.welcome = ["Loading please wait..."];

		$http({
			method: "GET",
			url: "rest/settings"
		}).then(
			function s(response) {
				var main = response.data.general.main;
				$ctrl.welcome = [];
				for(var i in main.welcome) {
					var m = main.welcome[i];
					$ctrl.welcome.push($sanitize(m));
				}
			},
			function f(response) {
				$ctrl.welcome = ["Unable to retrieve data!"];
			}
		);
	}],
	bindings: {
	}
});
