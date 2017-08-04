(function() {
    'use strict';

    angular
        .module('app.science')
        .controller('ScienceController', ScienceController);

    ScienceController.$inject = ['$window'];

    /* @ngInject */
    function ScienceController($window) {
        var $ctrl = this;

        activate();

        function activate() {

        }
    }
})();
