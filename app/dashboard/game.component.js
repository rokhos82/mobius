(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .component('app.dashboard.newGame',NewGame());

  /* @ngInject */
  function NewGame() {
    var component = {
      templateUrl: 'app/dashboard/game.html',
      controller: NewGameController
    };

    return component;
  }

  NewGameController.$inject = [
    "$window",
    "app.core.game",
    "app.core.game.const.status",
    "block.user-login.service"
  ];

  /* @ngInject */
  function NewGameController(
    $window,
    $game,
    $statuses,
    $user
  ) {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    $ctrl.onCreateGame = onCreateGame;
    $ctrl.statuses = $statuses;

    function activate() {
      $ctrl.session = $user.getSession();

      $ctrl.game = {
        status: $ctrl.statuses.open
      };
    }

    function onCreateGame() {
      $game.create();
    }
  }
})();
