(function() {
    'use strict';

    angular
        .module('app.fleets')
        .controller('FleetsController', FleetsController);

    FleetsController.$inject = ['$window'];

    /* @ngInject */
    function FleetsController($window) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Fleets',active:true}];
        $ctrl.ui.message = "Organize your units into groups here!";
        $ctrl.ui.title = "Fleets Management";

        activate();

        function activate() {

        }
    }
})();
