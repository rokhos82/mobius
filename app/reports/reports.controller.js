(function() {
    'use strict';

    angular
        .module('app.reports')
        .controller('ReportsController', ReportsController);

    ReportsController.$inject = ['$window'];

    /* @ngInject */
    function ReportsController($window) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Combat Reports',active:true}];
        $ctrl.ui.message = "";
        $ctrl.ui.title = "Combat Reports";

        activate();

        function activate() {

        }
    }
})();
