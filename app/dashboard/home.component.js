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
      'block.user-login.service',
      '$log',
      '$state',
      'library.game'
    ];

    function HomeController($game,$gameSession,$user,$log,$state,$gamesLibrary) {
      var $ctrl = this;

      $ctrl.$onInit = activate;
      $ctrl.selectGame = selectGame;
      $ctrl.session = $user.getSession();

      function activate() {
        $ctrl.games = $game.list();
      }

      function selectGame(key) {
        $gameSession.select(key);
        $state.go('dashboard.game');
      }
    }
})();
