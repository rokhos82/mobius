(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('app.core.game.session', gameSession);

    gameSession.$inject = [
      'app.core.game'
    ];

    /* @ngInject */
    function gameSession($game) {
        var service = {
            select: select,
            get: get
        };

        var _data = {
          game: null
        };

        return service;

        function select(key) {
          _data.game = $game.get(key);
        }

        function get() {
          return _data;
        }
    }
})();
