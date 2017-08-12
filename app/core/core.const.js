(function() {
    'use strict';

    angular
      .module('app.core')
      .config(getConstants);

    getConstants.$inject = ['$provide'];

    function getConstants($provide) {
      $provide.constant('app.core.login.defaultState','dashboard');
      $provide.constant('app.core.config',{
        localKey: 'mobius'
      });
    }
})();
