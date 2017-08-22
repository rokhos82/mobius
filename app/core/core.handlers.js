(function() {
  'use strict';

  angular
    .module('app.core')
    .run(eventHandlers);

  eventHandlers.$inject = [
    '$rootScope',
    '$state',
    'app.core.login.loginState',
    'block.user-login.events'
  ];

  function eventHandlers($rootScope,$state,$loginState,$userEvents) {
    $rootScope.$on($userEvents.logout,logoutRedirect);

    function logoutRedirect(event,data) {
      $state.reload();
      //$state.go($loginState);
    }
  };
})();
