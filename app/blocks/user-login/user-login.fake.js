(function() {
  'use strict';

  angular
    .module('block.user-login')
    .service('block.user-login.fakeBackend', fakeBackend);

  fakeBackend.$inject = ["$window"];

    /* @ngInject */
  function fakeBackend($window) {
    this.authenticateUser = authenticateUser;
    this.getJWT = getJWT;

    var _jwt = false;

    // Public Methods
    function authenticateUser(username,password) {
      if(username === "test" && password === "password") {
        buildAdminJwt();
        return true;
      }
      else if(username === "user" && password === "pass") {
        buildUserJwt();
        return true;
      }
      else {
        return false;
      }
    }

    function getJWT() {
      return _jwt;
    }

    // Private methods
    function buildAdminJwt() {
      let header = "abcdefg";

      let claims = $window.btoa($window.angular.toJson({
        'username': "Test Admin",
        'states': [
          "dashboard",
          "units",
          "facilities",
          "fleets",
          "combat",
          "reports",
          "simulator",
          "science"
        ],
        'expiration': (Date.now() + 1000*60*30), // 30-minute session expiration for testing
        'level': 0
      }));
      let signature = "a1b2c3d4e5";

      _jwt =  `${header}.${claims}.${signature}`;
    }

    function buildUserJwt() {
      let header = "abcdefg";

      let claims = $window.btoa($window.angular.toJson({
        'username': "Test User",
        'states': [
          "dashboard",
          "units",
          "fleets",
          "combat",
          "reports",
          "science"
        ],
        'expiration': (Date.now() + 1000*60*5), // 5-minute expiration for testing
        'level': 10
      }));
      let signature = "a1b2c3d4e5";

      _jwt =  `${header}.${claims}.${signature}`;
    }
  }
})();
