(function() {
    'use strict';

    angular
        .module('app.fleets')
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
                state: 'fleets',
                config: {
                    url: '/',
                    templateUrl: 'app/fleets/fleets.html',
                    controller: 'FleetsController',
                    controllerAs: '$ctrl',
                    title: 'fleets',
                    params: {
                    }
                }
            }
        ];
    }
})();
