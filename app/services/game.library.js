(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('library.game', gameLibrary);

    gameLibrary.$inject = [
      '$log',
      'app.core.game.template'
    ];

    /* @ngInject */
    function gameLibrary($log,$template) {
        var service = {
            get: get
        };

        var _data = {
          "mobius.game.01": {},
          "mobius.game.02": {}
        };

        return service;

        function get() {

        }
    }
})();
