(function() {
    'use strict';

    angular
        .module('app.combat')
        .controller('CombatController', CombatController);

    CombatController.$inject = ['$window'];

    /* @ngInject */
    function CombatController($window) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Combat Engine',active:true}];
        $ctrl.ui.message = "The old style of combat engine.";
        $ctrl.ui.title = "Combat Engine";

        activate();

        function activate() {

        }
    }
})();
