(function() {
  'use strict';

  angular
    .module('block.user-login')
    .factory('user-login.session', userSessionService);

  userSessionService.$inject = [];

  /* @ngInject */
  function userSessionService() {
    var data = {
      session: false
    };

    var service = {
      getSession: getSession,
      setSession: setSession
    };

    return service;

    function getSession() {
      return data.session;
    }

    function setSession(session) {
      data.session = session;
    }
  }
})();
