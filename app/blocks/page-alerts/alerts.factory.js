(function() {
  'use strict';

  angular
    .module('block.alerts')
    .factory('block.alerts.alertFactory', alertFactory);

  //alertFactory.$inject = [''];

  /* @ngInject */
  function alertFactory() {
    var service = {
      create : create,
      clear: clear,
      list: list
    };

    var _data = [];

    return service;

    function create(msg,type,timeout) {
      let a = {
        type: type || 'warning',
        msg: msg || '',
        timeout: timeout || undefined
      };

      _data.push(a);
    }

    function clear() {
      _data.length = 0;
    }

    function list() {
      return _data;
    }
  }
})();
