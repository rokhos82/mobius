(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('service.rest', serviceRestFactory);

    serviceRestFactory.$inject = ['$http','$window'];

    /* @ngInject */
    function serviceRestFactory($http,$window) {
        var service = {
            get: get
        };

        return service;

        function get() {

        }
    }
})();
