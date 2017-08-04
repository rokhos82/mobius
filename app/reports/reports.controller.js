(function() {
    'use strict';

    angular
        .module('app.reports')
        .controller('ReportsController', ReportsController);

    ReportsController.$inject = ['$windows'];

    /* @ngInject */
    function ReportsController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
