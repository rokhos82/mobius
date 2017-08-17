(function() {
    'use strict';

    angular
        .module('block.user-login')
        .component('mobUserLogout', mobUserLogout());

    /* @ngInject */
    function mobUserLogout() {
        var component = {
            templateUrl: '',
            controller: LogoutController,
        };

        return component;
    }

    LogoutController.$inject = ['$state','block.user-login.service'];

    /* @ngInject */
    function LogoutController($state,$user) {
      var $ctrl = this;

      $ctrl.$onInit = activate;

      function activate() {
        $user.doLogout();
        $state.go('dashboard');
      }
    }
})();
