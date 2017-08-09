(function() {
    'use strict';

    angular
        .module('block.user-login')
        .component('mobUserLogin', mobUserLogin());

    /* @ngInject */
    function mobUserLogin() {
        var component = {
            templateUrl: 'app/blocks/user-login/user-login.html',
            controller: UserLoginController,
        };

        return component;
    }

    UserLoginController.$inject = ['$window'];

    /* @ngInject */
    function UserLoginController($window) {

    }
})();
