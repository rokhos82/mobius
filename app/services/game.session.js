(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('app.core.game.session', gameSession);

    gameSession.$inject = [
      'app.core.game',
      'block.user-login.service',
      'service.rest'
    ];

    /* @ngInject */
    function gameSession($game,$user,$rest) {
        var service = {
            select: select,
            get: get,
            close: close
        };

        var _key = "app.core.game.selected";
        var _data = {
          game: $game.get($rest.get(_key))
        };

        return service;

        function select(key) {
          _data.game = $game.get(key);
          $user.setState("dashboard.game");
          $rest.set(_key,key);
        }

        function get() {
          return _data;
        }

        function close() {
          _data.game = null;
          $user.deleteState();
          $rest.remove(_key);
        }
    }
})();
