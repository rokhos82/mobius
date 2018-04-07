(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .component('app.dashboard.gameDashboard', gameDashboard());

    /* @ngInject */
    function gameDashboard() {
        var component = {
            templateUrl: 'app/dashboard/game/game.dashboard.html',
            controller: gameDashboardController,
        };

        return component;
    }

    gameDashboardController.$inject = [
      '$state',
      'app.core.game.session'
    ];

    /* @ngInject */
    function gameDashboardController($state,$game) {
      var $ctrl = this;

      $ctrl.$onInit = activate;
      $ctrl.onClose = onClose;

      function activate() {
        $ctrl.game = $game.get().game;
      }

      function onClose() {
        $game.close();
        $state.go('dashboard.home');
      }
    }
})();
