(function() {
    'use strict';

    angular
      .module('block.user-login')
      .factory('block.user-login.service', userLoginService)
      .run(sessionRestore);

    userLoginService.$inject = [
      '$http',
      '$window',
      'app.core.config',
      'block.user-login.levels'
    ];

    /* @ngInject */
    function userLoginService(
      $http,
      $window,
      appConfig,
      userLevels
    ) {
      var data = {};
      var storageKey = ".user.session";

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
        delete data.session;
        $window.localStorage.removeItem(appConfig.localKey + storageKey);
        // Don't forget to have the backend invalidate the session as well.
      }

      function getSession() {
        return data.session;
      }

      function isAuthenticated() {
        return !!data.session;
      }

      function isAuthorized(level) {
        return (!!data.session && data.session.level <= level);
      }

      function retrieveSession() {
        let key = appConfig.localKey + storageKey;
        let session = $window.angular.fromJson($window.localStorage[key]);

        return (!!session) ? session : false;
      }

      function saveSession() {
        let key = appConfig.localKey + storageKey;
        $window.localStorage[key] = $window.angular.toJson(data.session);
      }

      function setSession(session) {
        data.session = session;
        saveSession();
      }

      function test(creds) {
        if(creds.username === "test" && creds.password === "password") {
          let session = {jwt:"abcdefg.a1b2c3.asdfasdf",username: creds.username,level: userLevels.user};
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
