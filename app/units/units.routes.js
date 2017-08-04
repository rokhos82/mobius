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
                    url: '/',
                    templateUrl: 'app/units/units.html',
                    controller: 'UnitsController',
                    controllerAs: 'vm',
                    title: 'units',
                    params: {
                    }
                }
            }
        ];
    }
})();
