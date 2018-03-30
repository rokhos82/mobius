(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('service.science.projects', scienceService);

  scienceService.$inject = ['service.rest'];

  /* @ngInject */
  function scienceService(rest) {
    var service = {
      list: list
    };

    return service;

    function list() {

    }
  }
})();
