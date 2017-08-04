(function() {
    'use strict';

    angular
        .module('app.combat')
        .controller('CombatController', CombatController);

    CombatController.$inject = ['$window'];

    /* @ngInject */
    function CombatController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
