(function() {
    'use strict';

    var _name = "simulator";

    angular
      .module('app.simulator')
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
          name: _name,
          url: '/simulator',
          templateUrl: 'app/simulator/simulator.html',
          controller: 'SimulatorController',
          controllerAs: '$ctrl',
          title: 'simulator',
          params: {
          },
          data: {
            authorizedLevel: userLevels.admin
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
      $transitions.onStart({to:`${_name}.**`},function(trans){
        let $to = trans.$to();
        if(!$user.isAuthorized($to.data.authorizedLevel,_name)) {
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
