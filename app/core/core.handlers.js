(function() {
  'use strict';

  angular
    .module('app.core')
    .run(eventHandlers);

  eventHandlers.$inject = [
    '$rootScope',
    '$state',
    'app.core.login.defaultState',
    'block.user-login.events'
  ];

  function eventHandlers($rootScope,$state,$defaultState,$userEvents) {
    $rootScope.$on($userEvents.logout,logoutRedirect);

    function logoutRedirect(event,data) {
      console.log('$rootScope handling event user logout.  Should have transitioned to a new state.');
      $state.go($defaultState);
    }
  };
})();
