(function() {
    'use strict';

    angular
      .module('block.user-login')
      .factory('block.user-login.service', userLoginService)
      .run(sessionRestore);

    userLoginService.$inject = [
      '$http',
      '$rootScope',
      '$timeout',
      '$window',
      'app.core.config',
      'block.alerts.alertFactory',
      'block.user-login.events',
      'block.user-login.levels',
      'block.user-login.session',
      'block.user-login.fakeBackend'
    ];

    /* @ngInject */
    function userLoginService(
      $http,
      $rootScope,
      $timeout,
      $window,
      $appConfig,
      $alerts,
      $userEvents,
      $userLevels,
      $session,
      $rest
    ) {
      var _data = {};
      var _storageKey = ".user.session";

      var service = {
        doLogin: doLogin,
        doLogout: doLogout,
        getSession: getSession,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        retrieveSession: retrieveSession,
        saveSession: saveSession,
        setSession: setSession
      };

      return service;

      /**
      * The function to delete the current user session.
      */
      function deleteSession() {
        delete _data.session;
        $window.localStorage.removeItem($appConfig.localKey + _storageKey);
        // Don't forget to have the backend invalidate the session as well.
      }

      function doLogin(creds) {
        if($rest.authenticateUser(creds.username,creds.password)) {
          let jwt = $rest.getJWT();
          let session = $session.create(jwt);
          setSession(session);
          $rootScope.$broadcast($userEvents.login);
          $alerts.create("You will be logged off in 5 minutes.","warning");
          $timeout(doLogout,1000*60*5,false);
          return session;
        }
        else {
          return false;
        }
      }

      function doLogout() {
        deleteSession();
        $alerts.clear();
        $alerts.create("You have been logged out.","warning");
        $rootScope.$broadcast($userEvents.logout);
      }

      function getSession() {
        return _data.session;
      }

      function isAuthenticated() {
        return !!_data.session && !isExpired();
      }

      function isAuthorized(level,state) {
        return (
          isAuthenticated() && // Is a user authenticated?
          _data.session.getLevel() <= level && // Does the user have a sufficient privilage level?
          _data.session.hasState(state) // Does the user have access to the state
        );
      }

      function isExpired() {
        return (_data.session.getExpiration() < Date.now());
      }

      function retrieveSession() {
        let key = $appConfig.localKey + _storageKey;
        let jwt = $window.localStorage[key];

        if(!!jwt) {
          return $session.create(jwt);
        }
        else {
          return false;
        }
      }

      function saveSession() {
        let key = $appConfig.localKey + _storageKey;
        $window.localStorage[key] = _data.session.jwt;
      }

      function setSession(session) {
        _data.session = session;
        saveSession();
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
