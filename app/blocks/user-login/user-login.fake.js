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

    function authenticateUser(username,password) {
      return (username === "test" && password === "password");
    }

    function getJWT() {
      let header = "abcdefg";

      let claims = $window.btoa($window.angular.toJson({
        'username': "Test User",
        'states': [
          "dashboard",
          "units",
          "fleets"
        ],
        'expiration': (Date.now() + 1000*60*5), // 5-minute expiration for testing
        'level': 0
      }));
      let signature = "a1b2c3d4e5";

      return `${header}.${claims}.${signature}`;
    }
  }
})();
