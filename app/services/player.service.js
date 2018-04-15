(function() {
    'use strict';

    var _player = {
      general: {
        uuid: '',
        displayName: '',
        firstName: '',
        lastName: '',
        email: ''
      }
    };

    angular
        .module('app.core')
        .factory('app.core.service.player', playerService);

    playerService.$inject = ['$log'];

    /* @ngInject */
    function playerService($log) {
        var service = {
            create: create
        };

        return service;

        function create() {

        }
    }
})();
