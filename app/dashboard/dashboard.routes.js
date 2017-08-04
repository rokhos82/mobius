(function() {
    'use strict';

    angular
      .module('app.dashboard')
      .config(configureStates);

    configureStates.$inject = ["$stateProvider"];

    function configureStates($stateProvider) {
      let states = getStates();
      states.forEach(function(state) {
        $stateProvider.state(state.state,state.config);
      });
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: '$ctrl',
                    title: 'dashboard',
                    params: {
                    }
                }
            }
        ];
    }
})();
