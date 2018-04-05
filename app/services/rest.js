(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('service.rest', serviceRestFactory);

    serviceRestFactory.$inject = [
      '$http',
      'service.localStorage'
    ];

    /* @ngInject */
    function serviceRestFactory($http,$local) {
        var service = {
            get: get,
            set: set,
            remove: remove
        };

        return service;

        var _data = {};

        function get(key) {
          return $local.getObject(key);
        }

        function set(key,value) {
          // Only sending to localStorage for now.  Will work on persistent
          // SQL storage latter.
          $local.setObject(key,value);
        }

        function remove(key) {
        }
    }
})();
