(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('testing.Service', testingServiceFactory);

    testingServiceFactory.$inject = [
      'service.localstorage',
      'app.core.game.template',
      '$window'
    ];

    /* @ngInject */
    function testingServiceFactory($localstorage,$gameTemplate,$window) {
        var service = {
            load: load
        };

        return service;

        function load() {
          var game = $window.angular.copy($gameTemplate);
        }
    }
})();
