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
    "block.user-login.service"
  ];

  /* @ngInject */
  function NewGameController($user) {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    function activate() {
      $ctrl.session = $user.getSession();
    }
  }
})();
