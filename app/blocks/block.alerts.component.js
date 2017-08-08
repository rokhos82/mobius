(function() {
    'use strict';

    angular
      .module('block.alerts')
      .component('mobPageAlerts', mobPageAlerts);

    /* @ngInject */
    function mobPageAlerts() {
      var directive = {
        templateUrl: 'app/blocks/block.alerts.html',
        controller: PageAlertsController,
        bindings: {
          alerts: '='
        }
      };

      console.log("mobPageAlerts Component Declaration");

      return directive;
    }

    PageAlertsController.$inject = ['$window'];

    /* @ngInject */
    function PageAlertsController($window) {
      var $ctrl = this;

      $ctrl.closeAlert = closeAlert;

      activate();

      function activate() {
        console.log("Page Alerts Controller Activated");
      }

      function closeAlert(index) {
        $ctrl.alerts.splice(index,1);
      }
    }
})();
