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

    function stateChanges($state,$transitions,userService) {
      $transitions.onStart({to:'units.**'},function(trans){
        let $to = trans.$to();
        if(!userService.isAuthorized($to.data.authorizedLevel)) {
          if(userService.isAuthenticated()) {
            $state.go('403');
          }
          else {
            $state.go('login');
          }
        }
      });
    }
})();
