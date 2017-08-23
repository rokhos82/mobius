(function() {
    'use strict';

    angular
      .module('app.dashboard')
      .config(configureStates)
      .run(stateChanges);

    configureStates.$inject = ["$stateRegistryProvider",'block.user-login.levels'];

    function configureStates($registry,$userLevels) {
      let states = getStates($userLevels);
      states.forEach(function(state) {
        $registry.register(state);
      });
    }

    function getStates($userLevels) {
      return [
        {
          name: 'dashboard',
          url: '/',
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: '$ctrl',
          title: 'dashboard',
          params: {
          },
          data: {
            authorizedLevel: $userLevels.user
          }
        },
        {
          name: 'dashboard.newGame',
          component: 'app.dashboard.newGame',
          title: 'Mobius - New Game',
          resolve: {
          }
        }
      ];
    }

    stateChanges.$inject = ['$state','$transitions','block.user-login.service'];

    function stateChanges($state,$transitions,$user) {
      $transitions.onStart({to:'dashboard.**'},function(trans){
        let $to = trans.$to();
        if(!$user.isAuthorized($to.data.authorizedLevel,'dashboard')) {
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
