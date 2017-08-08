(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ["$window","block.alerts.alertFactory"];

  /* @ngInject */
  function DashboardController($window,alertFactory) {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    function activate() {
      // Setup UI object for the controller.
      $ctrl.ui = {};
      $ctrl.ui.alerts = [alertFactory.create('Test','success')];
      $ctrl.ui.message = "Please use the toolbar below to access different features.";
      $ctrl.ui.title = "Welcome to Mobius";

      console.log("Dashboard Controller Activated");
    }

  }
})();
