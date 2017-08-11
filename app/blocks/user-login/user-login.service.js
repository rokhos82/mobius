(function() {
    'use strict';

    angular
        .module('block.user-login')
        .factory('user-login.service', userLoginService);

    userLoginService.$inject = ['$http','user-login.session'];

    /* @ngInject */
    function userLoginService($http,userSession) {
        var service = {
            test : test
        };

        return service;

        function test(creds) {
          if(creds.username === "test" && creds.password === "password") {
            let session = {jwt:"abcdefg.a1b2c3.asdfasdf"};
            userSession.setSession(session);
            return session;
          }
          else {
            return false;
          }
        }
    }
})();
