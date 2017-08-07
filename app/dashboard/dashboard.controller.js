(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ["$window","block.alerts.alertFactory"];

    /* @ngInject */
    function DashboardController($window,alertFactory) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.alerts = [alertFactory.create("Test Alert","info")];
        $ctrl.ui.message = "Please use the toolbar below to access different features.";
        $ctrl.ui.title = "Welcome to Mobius";

        activate();

        function activate() {

        }
    }
})();
