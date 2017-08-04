(function() {
    'use strict';

    angular
        .module('app.units')
        .controller('UnitsController', UnitsController);

    UnitsController.$inject = ['$window'];

    /* @ngInject */
    function UnitsController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
