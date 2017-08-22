(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavController', NavController);

    NavController.$inject = [
      '$rootScope',
      '$window',
      'block.user-login.events',
      'block.user-login.service'
    ];

    /* @ngInject */
    function NavController(
      $rootScope,
      $window,
      $userEvents,
      $user
    ) {
        var $ctrl = this;

        $ctrl.$onInit = activate;

        $ctrl.doLogin = $user.doLogin;
        $ctrl.doLogout = $user.doLogout;

        // Setup event handlers
        $rootScope.$on($userEvents.logout,activate);
        $rootScope.$on($userEvents.login,activate);

        function activate() {
          $ctrl.session = $user.getSession();
        }
    }
})();
