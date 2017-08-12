(function() {
    'use strict';

    angular
      .module('block.user-login')
      .config(getConstants);

    getConstants.$inject = ['$provide'];

    function getConstants($provide) {
      $provide.constant('block.user-login.events',{});
      $provide.constant('block.user-login.levels',{
        user: 10,
        gm: 5,
        admin: 0
      });
    }
})();
