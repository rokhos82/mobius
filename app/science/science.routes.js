(function() {
    'use strict';

    angular
        .module('app.science')
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
                state: 'science',
                config: {
                    url: '/science',
                    templateUrl: 'app/science/science.html',
                    controller: 'ScienceController',
                    controllerAs: '$ctrl',
                    title: 'science',
                    params: {
                    }
                }
            }
        ];
    }
})();
