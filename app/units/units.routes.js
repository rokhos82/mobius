(function() {
    'use strict';

    angular
        .module('app.units')
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
                state: 'units',
                config: {
                    url: '/units',
                    templateUrl: 'app/units/units.html',
                    controller: 'UnitsController',
                    controllerAs: '$ctrl',
                    title: 'units',
                    params: {
                    }
                }
            }
        ];
    }
})();
