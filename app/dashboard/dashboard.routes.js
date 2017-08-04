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
                state: 'dashBoard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashBoard/dashBoard.html',
                    controller: 'DashboardController',
                    controllerAs: '$ctrl',
                    title: 'dashBoard',
                    params: {
                    }
                }
            }
        ];
    }
})();
