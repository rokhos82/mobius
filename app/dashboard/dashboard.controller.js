(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ["$window","block.alerts.alertFactory","block.user-login.service","block.user-login.session"];

  /* @ngInject */
  function DashboardController($window,$alert,$user,$session) {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    function activate() {
      $ctrl.session = $user.getSession();

      // Setup UI object for the controller.
      $ctrl.ui = {};
      $ctrl.ui.alerts = [];
      $ctrl.ui.message = "Please use the toolbar below to access different features.";
      $ctrl.ui.title = "Welcome to Mobius";
    }

  }
})();
