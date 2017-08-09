(function() {
  'use strict';

  angular
    .module('block.alerts')
    .component('mobPageAlerts', mobPageAlerts());

  /* @ngInject */
  function mobPageAlerts() {
    var component = {
      templateUrl: 'app/blocks/block.alerts.html',
      controller: PageAlertsController,
      bindings: {
        alerts: "="
      }
    };

    return component;
  }

  PageAlertsController.$inject = ['$window'];

  /* @ngInject */
  function PageAlertsController($window) {
    var $ctrl = this;

    $ctrl.closeAlert = closeAlert;
    $ctrl.$onInit = activate;

    function activate() {
      console.log("Page Alerts Controller Activated");
      console.log($ctrl.alerts);
    }

    function closeAlert(index) {
      $ctrl.alerts.splice(index,1);
    }
  }
})();
