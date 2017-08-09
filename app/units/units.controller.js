(function() {
    'use strict';

    angular
        .module('app.units')
        .controller('UnitsController', UnitsController);

    UnitsController.$inject = ['$window','block.alerts.alertFactory'];

    /* @ngInject */
    function UnitsController($window,alert) {
        var $ctrl = this;

        $ctrl.$onInit = activate;

        function activate() {
          $ctrl.ui = {};
          $ctrl.ui.alerts = [alert.create("Alerts with timeouts are working!","info",5000)];
          $ctrl.ui.history = [{state:'',label:'Units',active:true}];
          $ctrl.ui.message = "Create, replace, design!  Do it all here!";
          $ctrl.ui.title = "Units Management";
        }
    }
})();
