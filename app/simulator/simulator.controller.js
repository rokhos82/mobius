(function() {
    'use strict';

    angular
        .module('app.simulator')
        .controller('SimulatorController', SimulatorController);

    SimulatorController.$inject = ['$window'];

    /* @ngInject */
    function SimulatorController($window) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Combat Simulator',active:true}];
        $ctrl.ui.message = "The new way of doing combat...";
        $ctrl.ui.title = "Combat Simulator";

        activate();

        function activate() {

        }
    }
})();
