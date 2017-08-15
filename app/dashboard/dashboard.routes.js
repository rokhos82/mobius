(function() {
    'use strict';

    angular
      .module('app.dashboard')
      .config(configureStates);

    configureStates.$inject = ["$stateRegistryProvider"];

    function configureStates($registry) {
      let states = getStates();
      states.forEach(function(state) {
        $registry.register(state);
      });
    }

    function getStates() {
      return [
        {
          name: 'dashboard',
          url: '/',
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: '$ctrl',
          title: 'dashboard',
          params: {
          }
        }
      ];
    }
})();
