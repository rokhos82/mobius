(function() {
    'use strict';

    angular
        .module('app.facilities')
        .controller('FacilitiesController', FacilitiesController);

    FacilitiesController.$inject = ['$window'];

    /* @ngInject */
    function FacilitiesController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
