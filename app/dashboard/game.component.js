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

  NewGameController.$inject = [];

  /* @ngInject */
  function NewGameController() {
    var $ctrl = this;

    $ctrl.$onInit = activate;

    function activate() {
      console.log("New Game Component");
    }
  }
})();
