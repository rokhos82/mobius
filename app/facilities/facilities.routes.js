(function() {
    'use strict';

    angular
        .module('app.facilities')
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
                state: 'facilities',
                config: {
                    url: '/facilities',
                    templateUrl: 'app/facilities/facilities.html',
                    controller: 'FacilitiesController',
                    controllerAs: '$ctrl',
                    title: 'facilities',
                    params: {
                    }
                }
            }
        ];
    }
})();
