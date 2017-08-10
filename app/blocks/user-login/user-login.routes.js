(function() {
  'use strict';

  angular
      .module('block.user-login')
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
        state: 'login',
        config: {
          url: '/login',
          component: 'mobUserLogin',
          title: 'login',
          resolve: {}
        }
      }
    ];
  }
})();
