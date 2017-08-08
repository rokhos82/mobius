(function() {
    'use strict';

    angular
        .module('app.units')
        .controller('UnitsController', UnitsController);

    UnitsController.$inject = ['$window','block.alerts.alertFactory'];

    /* @ngInject */
    function UnitsController($window,alertFactory) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Units',active:true}];
        $ctrl.ui.message = "Create, replace, design!  Do it all here!";
        $ctrl.ui.title = "Units Management";

        activate();

        function activate() {

        }
    }
})();
