(function() {
  'use strict';

  angular
    .module('app.core')
    .config(configureStates);

  configureStates.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlServiceProvider'
  ];

  function configureStates(
    $stateProvider,
    $locationProvider,
    $urlServiceProvider
  ) {
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
      },
      {
        state: '401',
        config: {
          url: '/401',
          templateUrl: 'app/core/401.html',
          title: '401'
        }
      },
      {
        state: '403',
        config: {
          url: '/403',
          templateUrl: 'app/core/403.html',
          title: '403'
        }
      }
    ];
  }
})();
