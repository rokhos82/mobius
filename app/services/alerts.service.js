(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('service.alerts', alertsService);

  alertsService.$inject = ['block.alerts.alertFactory'];

  /* @ngInject */
  function alertsService($alerts) {
    var service = {
      add: add,
      create: create,
      get: get
    };

    var _data = [];

    return service;

    function add(alert) {
      _data.push(alert)
    }

    function create(msg,type,timeout) {
      _data.push($alerts.create(msg,type,timeout));
    }

    function get() {
      return _data;
    }
  }
})();
