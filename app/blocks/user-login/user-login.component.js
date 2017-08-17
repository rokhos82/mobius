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

    UserLoginController.$inject = [
      '$state',
      '$window',
      'app.core.login.defaultState',
      'block.alerts.alertFactory',
      'block.user-login.service'
    ];

    /* @ngInject */
    function UserLoginController(
      $state,
      $window,
      defaultState,
      $alerts,
      userService
    ) {
      var $ctrl = this;

      $ctrl.$onInit = activate;
      $ctrl.doLogin = doLogin;

      function activate() {
        fullPageSetup();
      }

      function doLogin(creds) {
        $ctrl.credentials = userService.doLogin(creds);
        if(!!$ctrl.credentials) {
          $state.go(defaultState);
        }
        else {
          $ctrl.ui.alerts.push(alertFactory.create("Username or password is invalid!","danger"));
        }
      }

      function fullPageSetup() {
        $ctrl.ui = {};
        $ctrl.ui.alerts = $alerts.list();
        $ctrl.ui.history = [{state:'',label:'User Login',active:true}];
        $ctrl.ui.message = "Papers please!";
        $ctrl.ui.title = "User Login";

        $ctrl.credentials = {};
      }
  }
})();
