(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [];

    /* @ngInject */
    function DashboardController() {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.message = "Please use the toolbar below to access different features.";
        $ctrl.ui.title = "Welcome to Mobius";

        activate();

        function activate() {

        }
    }
})();
