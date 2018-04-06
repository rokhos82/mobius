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

    HomeController.$inject = ['app.core.game'];

    function HomeController($game) {
      var $ctrl = this;

      $ctrl.$onInit = activate;

      function activate() {
        $ctrl.games = $game.list();
      }
    }
})();
