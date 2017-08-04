(function() {
    'use strict';

    angular
        .module('app.fleets')
        .controller('FleetsController', FleetsController);

    FleetsController.$inject = ['$window'];

    /* @ngInject */
    function FleetsController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
