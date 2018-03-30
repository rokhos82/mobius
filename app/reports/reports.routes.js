(function() {
    'use strict';

    angular
      .module('app.reports')
      .config(configureStates)
      .run(stateChanges);

    configureStates.$inject = [
      '$stateRegistryProvider',
      'block.user-login.levels'
    ];
    /* @ngInject */
    function configureStates(
      $registry,
      userLevels
    ) {
      let states = getStates(userLevels);
      states.forEach(function(state) {
        $registry.register(state);
      });
    }

    function getStates(userLevels) {
      return [
        {
          name: 'reports',
          url: '/reports',
          templateUrl: 'app/reports/reports.html',
          controller: 'ReportsController',
          controllerAs: '$ctrl',
          title: 'reports',
          params: {
          },
          data: {
            authorizedLevel: userLevels.user
          }
        }
      ];
    }

    stateChanges.$inject = [
      '$state',
      '$transitions',
      'block.user-login.service'
    ];

    function stateChanges(
      $state,
      $transitions,
      $user
    ) {
      $transitions.onStart({to:'reports.**'},function(trans){
        let $to = trans.$to();
        if(!$user.isAuthorized($to.data.authorizedLevel,'reports')) {
          if($user.isAuthenticated()) {
            // Not authorized to view this page, redirect to the forbidden page.
            return $state.target('403');
          }
          else {
            // Not logged in so redirect to the login page.
            return $state.target('login');
          }
        }
        // Let the state transition resume.
        return true;
      });
    }
})();
