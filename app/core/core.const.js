(function() {
    'use strict';

    angular
      .module('app.core')
      .config(getConstants);

    getConstants.$inject = ['$provide'];

    function getConstants($provide) {
      $provide.value('app.core.login.defaultState','dashboard');
    }
})();
