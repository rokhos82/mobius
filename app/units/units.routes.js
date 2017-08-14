(function() {
    'use strict';

    angular
        .module('app.units')
        .config(configureStates)
        .run(stateChanges);

    configureStates.$inject = ['$stateProvider','block.user-login.levels'];
    /* @ngInject */
    function configureStates($stateProvider,userLevels) {
        let states = getStates(userLevels);
        states.forEach(function(state) {
          $stateProvider.state(state.state,state.config);
        });
    }

    function getStates(userLevels) {
        return [
            {
                state: 'units',
                config: {
                    url: '/units',
                    templateUrl: 'app/units/units.html',
                    controller: 'UnitsController',
                    controllerAs: '$ctrl',
                    title: 'units',
                    params: {
                    },
                    data: {
                      authorizedLevel: userLevels.user
                    }
                }
            }
        ];
    }

    stateChanges.$inject = ['$state','$transitions','block.user-login.service'];

    function stateChanges($state,$transitions,$user) {
      $transitions.onStart({to:'units.**'},function(trans){
        let $to = trans.$to();
        if(!$user.isAuthorized($to.data.authorizedLevel)) {
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
