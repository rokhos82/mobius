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
          name: 'dashboard.home',
          url: '/',
          component: 'app.dashboard.home',
          title: 'Mobius - Home',
          resolve: {
          }
        },
        {
          name: 'dashboard.newGame',
          component: 'app.dashboard.newGame',
          title: 'Mobius - New Game',
          resolve: {
          }
        },
        {
          name: 'dashboard.game',
          component: 'app.dashboard.gameDashboard',
          title: 'Mobius',
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
        // Does the user have a save dashboard state?
        let dashState = $user.getState();
        if(!!dashState && dashState !== $to.name) {
          // Redirect to that specific state
          return $state.target(dashState);
        }
        // Let the state transition resume.
        return true;
      });
    }
})();
