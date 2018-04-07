(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .component('app.dashboard.home',Home());

    /* @ngInject */
    function Home() {
      var component = {
        templateUrl: 'app/dashboard/home.html',
        controller: HomeController
      };

      return component;
    }

    HomeController.$inject = [
      'app.core.game',
      'app.core.game.session',
      '$log',
      '$state'
    ];

    function HomeController($game,$gameSession,$log,$state) {
      var $ctrl = this;

      $ctrl.$onInit = activate;
      $ctrl.selectGame = selectGame;

      function activate() {
        $ctrl.games = $game.list();
      }

      function selectGame(key) {
        $gameSession.select(key);
        $state.go('dashboard.game');
      }
    }
})();
