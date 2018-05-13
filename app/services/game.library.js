(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('library.game', gameLibrary);

    gameLibrary.$inject = [
      '$log',
      '$window',
      'app.core.game.template'
    ];

    /* @ngInject */
    function gameLibrary($log,$window,$template) {
        var service = {
            get: get
        };

        var _data = {
          "mobius.game.01": $window.angular.copy($template),
          "mobius.game.02": $window.angular.copy($template)
        };

        _data["mobius.game.01"].general.uuid = "mobius.game.01";
        _data["mobius.game.01"].general.name = "Sample Game 1";
        _data["mobius.game.01"].general.description = "This sample game is for testing purposes only.";
        _data["mobius.game.01"].general.tags = ["sample","game.01","testing"];

        $log.info(_data);

        return service;

        function get() {

        }
    }
})();
