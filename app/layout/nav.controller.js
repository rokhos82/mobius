(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavController', NavController);

    NavController.$inject = [
      '$http',
      '$log',
      '$rootScope',
      '$window',
      'block.user-login.events',
      'block.user-login.service',
      'library.game'
    ];

    /* @ngInject */
    function NavController(
      $http,
      $log,
      $rootScope,
      $window,
      $userEvents,
      $user,
      $gameLibrary
    ) {
        var $ctrl = this;

        $ctrl.$onInit = activate;
        $ctrl.loadGameLibrary = loadGameLibrary;
        $ctrl.rest = rest;

        $ctrl.doLogin = $user.doLogin;
        $ctrl.doLogout = $user.doLogout;
        $ctrl.session = $user.getSession();

        // Setup event handlers
        $rootScope.$on($userEvents.logout,activate);
        $rootScope.$on($userEvents.login,activate);

        function activate() {
          $ctrl.session = $user.getSession();
        }

        function loadGameLibrary() {
          $log.info("Clicking worked!");
        }

        function rest() {
      		console.log("Testing Rest");
      		$http({
      			method: "GET",
      			url: "rest/test.php",
      		}).then(
      			function successful(response) {
      				console.log(response.data);
      			}, function unsuccessful(response) {

      			}
      		);
      	}
    }
})();
