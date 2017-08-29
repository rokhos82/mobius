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
    "block.user-login.service"
  ];

  /* @ngInject */
  function NewGameController($window,$user) {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    $ctrl.onCreateGame = onCreateGame;

    function activate() {
      $ctrl.session = $user.getSession();

      $ctrl.game = {
        status: 'open'
      };
    }

    function onCreateGame() {
    }
  }
})();
