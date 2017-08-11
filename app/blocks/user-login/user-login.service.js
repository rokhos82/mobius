(function() {
    'use strict';

    angular
      .module('block.user-login')
      .factory('block.user-login.service', userLoginService);

    userLoginService.$inject = ['$http'];

    /* @ngInject */
    function userLoginService($http) {
      var data = {};

      var service = {
        getSession: getSession,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        setSession: setSession,
        test : test
      };

      return service;

      function getSession() {
        return data.session;
      }

      function isAuthenticated() {
        return !!data.session;
      }

      function isAuthorized(level) {
        return (!!data.session && data.session.level <= level);
      }

      function setSession(session) {
        data.session = session;
      }

      function test(creds) {
        if(creds.username === "test" && creds.password === "password") {
          let session = {jwt:"abcdefg.a1b2c3.asdfasdf",username: creds.username,level: 20};
          setSession(session);
          return session;
        }
        else {
          return false;
        }
      }
    }
})();
