(function() {
    'use strict';

    angular
        .module('app.combat')
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
                state: 'combat',
                config: {
                    url: '/combat',
                    templateUrl: 'app/combat/combat.html',
                    controller: 'CombatController',
                    controllerAs: '$ctrl',
                    title: 'combat',
                    params: {
                    }
                }
            }
        ];
    }
})();
