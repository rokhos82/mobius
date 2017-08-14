(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavController', NavController);

    NavController.$inject = ['$window','block.user-login.service'];

    /* @ngInject */
    function NavController($window,$user) {
        var $ctrl = this;

        $ctrl.$onInit = activate;

        function activate() {
          $ctrl.session = $user.getSession();
        }
    }
})();
