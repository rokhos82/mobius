(function() {
    'use strict';

    angular
        .module('app.simulator')
        .config(configureStates);

    configureStates.$inject = ['$stateProvider'];
    /* @ngInject */
    function configureStates($stateProvider) {
      let states = getStates();
      states.forEach(function(state) {
        $stateProvider.state(state.state,state.config);
      });
    }

    function getStates() {
        return [
            {
                state: 'simulator',
                config: {
                    url: '/simulator',
                    templateUrl: 'app/simulator/simulator.html',
                    controller: 'SimulatorController',
                    controllerAs: '$ctrl',
                    title: 'simulator',
                    params: {
                    }
                }
            }
        ];
    }
})();
