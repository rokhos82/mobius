(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('service.localStorage', serviceLocalStorageFactory);

    serviceLocalStorageFactory.$inject = ['$window'];

    /* @ngInject */
    function serviceLocalStorageFactory($window) {
        var service = {
            set: set,
            get: get,
            setObject: setObject,
            getObject: getObject
        };

        return service;

        function set(key,value) {
          $window.localStorage[key] = value;
        }

        function get(key) {
          return $window.localStorage[key];
        }

        function setObject(key,value) {
          $window.localStorage[key] = $window.angular.toJson(value);
        }

        function getObject(key) {
          return  $window.angular.fromJson($window.localStorage[key] || '{}');
        }
    }
})();
