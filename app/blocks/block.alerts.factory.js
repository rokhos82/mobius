(function() {
  'use strict';

  angular
    .module('block.alerts')
    .factory('block.alerts.alertFactory', alertFactory);

  alertFactory.$inject = [''];

  /* @ngInject */
  function alertFactory() {
    var service = {
      create : create
    };

    return service;

    function create(msg,type,timeout) {
      return {
        type: type || 'warning',
        msg: msg || "",
        timeout: timeout || undefined
      };
    }
  }
})();
