(function() {
    'use strict';

    var _race = {
      general: {
        uuid: '',
        name: ''
      }
    };

    angular
        .module('app.core')
        .factory('app.core.service.race', raceService);

    raceService.$inject = ['$log'];

    /* @ngInject */
    function raceService($log) {
        var service = {
            create: create
        };

        return service;

        function create() {

        }
    }
})();
