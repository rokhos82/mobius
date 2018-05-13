(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('library.science', scienceLibrary);

    scienceLibrary.$inject = [
      '$log'
    ];

    /* @ngInject */
    function scienceLibrary($log) {
        var service = {
            function: function
        };

        return service;

        function function() {

        }
    }
})();
