(function() {
    'use strict';

    angular
        .module('app.simulator')
        .controller('SimulatorController', SimulatorController);

    SimulatorController.$inject = ['$window'];

    /* @ngInject */
    function SimulatorController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
