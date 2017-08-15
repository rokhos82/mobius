(function() {
    'use strict';

    angular
      .module('block.user-login')
      .factory('block.user-login.service', userLoginService)
      .run(sessionRestore);

    userLoginService.$inject = [
      '$http',
      '$rootScope',
      '$window',
      'app.core.config',
      'block.user-login.levels',
      'block.user-login.session',
    ];

    /* @ngInject */
    function userLoginService(
      $http,
      $rootScope,
      $window,
      appConfig,
      userLevels,
      $session
    ) {
      var _data = {};
      var _storageKey = ".user.session";

      var service = {
        deleteSession: deleteSession,
        getSession: getSession,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        retrieveSession: retrieveSession,
        saveSession: saveSession,
        setSession: setSession,
        test : test
      };

      return service;

      /**
      * The function to delete the current user session.
      */
      function deleteSession() {
        delete _data.session;
        $window.localStorage.removeItem(appConfig.localKey + _storageKey);
        // Don't forget to have the backend invalidate the session as well.
      }

      function getSession() {
        return _data.session;
      }

      function isAuthenticated() {
        return !!_data.session;
      }

      function isAuthorized(level) {
        return (!!_data.session && _data.session.claims.level <= level);
      }

      function retrieveSession() {
        let key = appConfig.localKey + _storageKey;
        let jwt = $window.localStorage[key];

        if(!!jwt) {
          return $session.create(jwt);
        }
        else {
          return false;
        }
      }

      function saveSession() {
        let key = appConfig.localKey + _storageKey;
        $window.localStorage[key] = _data.session.jwt;
      }

      function setSession(session) {
        _data.session = session;
        saveSession();
      }

      function test(creds) {
        if(creds.username === "test" && creds.password === "password") {
          let jwt = "abcdefg.eyJ1c2VybmFtZSI6IlRlc3QgVXNlciIsInN0YXRlIjpbImRhc2hib2FyZCIsInVuaXRzIl0sImV4cGlyYXRpb24iOnRydWUsImxldmVsIjowfQ==.asdfasdf";
          let session = $session.create(jwt);
          setSession(session);
          return session;
        }
        else {
          return false;
        }
      }
    }

    sessionRestore.$inject = ['$window','block.user-login.service'];
    function sessionRestore($window,$user) {
      let session = $user.retrieveSession();
      if(!!session) {
        $user.setSession(session);
      }
    }
})();
