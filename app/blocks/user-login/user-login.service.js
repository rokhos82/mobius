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
      'block.user-login.fakeBackend',
      'service.localStorage'
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
      $rest,
      $localStorage
    ) {
      var _data = {};
      var _sessionKey = ".user.session";
      var _stateKey = ".user.state";

      var service = {
        deleteState: deleteState,
        doLogin: doLogin,
        doLogout: doLogout,
        getSession: getSession,
        getState: getState,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        retrieveSession: retrieveSession,
        retrieveState: retrieveState,
        saveSession: saveSession,
        setSession: setSession,
        saveState: saveState,
        setState: setState
      };

      return service;

      /**
      * The function to delete the current user session.
      */
      function deleteSession() {
        delete _data.session;
        $window.localStorage.removeItem($appConfig.localKey + _sessionKey);
        // Don't forget to have the backend invalidate the session as well.
      }

      function deleteState() {
        delete _data.state;
        $localStorage.remove($appConfig.localKey + _stateKey);
      }

      function doLogin(creds) {
        if($rest.authenticateUser(creds.username,creds.password)) {
          let jwt = $rest.getJWT();
          let session = $session.create(jwt);
          setSession(session);
          $rootScope.$broadcast($userEvents.login);
          $alerts.create("You will be logged off in 30 minutes.","warning");
          let expr = session.claims.expiration - Date.now();
          $timeout(doLogout,expr,false);
          return session;
        }
        else {
          return false;
        }
      }

      function doLogout() {
        deleteSession();
        $alerts.clear();
        $alerts.create("You have been logged out.","warning",10000);
        $rootScope.$broadcast($userEvents.logout);
      }

      function getSession() {
        return _data.session;
      }

      function getState() {
        return _data.state;
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
        let key = $appConfig.localKey + _sessionKey;
        let jwt = $window.localStorage[key];

        if(!!jwt) {
          return $session.create(jwt);
        }
        else {
          return false;
        }
      }

      function retrieveState() {
        let key = $appConfig.localKey + _stateKey;
        return $localStorage.get(key) || false;
      }

      function saveSession() {
        let key = $appConfig.localKey + _sessionKey;
        $window.localStorage[key] = _data.session.jwt;
      }

      function setSession(session) {
        _data.session = session;
        saveSession();
      }

      function saveState() {
        let key = $appConfig.localKey + _stateKey;
        $localStorage.set(key,_data.state);
      }

      function setState(state) {
        _data.state = state;
        saveState();
      }
    }

    sessionRestore.$inject = ['$window','block.user-login.service'];
    function sessionRestore($window,$user) {
      let session = $user.retrieveSession();
      let state = $user.retrieveState();
      if(!!session) {
        $user.setSession(session);
      }
      if(!!state) {
        $user.setState(state);
      }
    }
})();
