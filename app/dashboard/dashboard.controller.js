(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = [
    "$window",
    "block.alerts.alertFactory",
    "block.user-login.service",
    'app.core.game'
  ];

  /* @ngInject */
  function DashboardController(
    $window,
    $alerts,
    $user,
    $game
  ) {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    $ctrl.onNewGame = onNewGame;

    function activate() {
      $ctrl.game = $game.hash();
      $ctrl.session = $user.getSession();

      // Setup UI object for the controller.
      $ctrl.ui = {};
      $ctrl.ui.alerts = $alerts.list();
      $ctrl.ui.message = "Please select a game to load or create a new game.";
      $ctrl.ui.title = "Welcome to Mobius";
    }

    function onNewGame() {
      $ctrl.game = $game.new();
    }
  }
})();
