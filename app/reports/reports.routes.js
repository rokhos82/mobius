(function() {
    'use strict';

    angular
        .module('app.reports')
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
                state: 'reports',
                config: {
                    url: '/reports',
                    templateUrl: 'app/reports/reports.html',
                    controller: 'ReportsController',
                    controllerAs: '$ctrl',
                    title: 'reports',
                    params: {
                    }
                }
            }
        ];
    }
})();
