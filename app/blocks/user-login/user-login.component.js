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
      var $ctrl = this;

      $ctrl.$onInit = activate();

      function activate() {
        fullPageSetup();
      }

      function doLogin(creds) {
        $ctrl.credentials = creds;
      }

      function fullPageSetup() {
        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'User Login',active:true}];
        $ctrl.ui.message = "Papers please!";
        $ctrl.ui.title = "User Login";
      }
  }
})();
