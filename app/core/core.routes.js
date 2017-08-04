(function() {
    'use strict';

    angular
        .module('app.core')
        .config(configureStates);

    configureStates.$inject = ['$stateProvider','$locationProvider','$urlServiceProvider'];

    function configureStates($stateProvider,$locationProvider,$urlServiceProvider) {
      let otherwise = '/404';
      let states = getStates();
      states.forEach(function(state) {
        $stateProvider.state(state.state,state.config);
      });
      $locationProvider.html5Mode(true);
      $urlServiceProvider.rules.otherwise(otherwise);
    };

    function getStates() {
        return [
            {
                state: '404',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();
