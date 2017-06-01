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
			url: "rest/settings.php"
		}).then(
			function s(response) {
				var general = response.data.general;
				$ctrl.welcome = [];
				for(var i in general.welcome) {
					var m = general.welcome[i];
					$ctrl.welcome.push($sanitize(m));
				}
			},
			function f(response) {
				$ctrl.welcome = "Unable to retrieve data!";
			}
		);
	}],
	bindings: {
	}
});
