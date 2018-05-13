(function() {
    'use strict';

    var _turn = {
      link: {
        uuid: '',
        prev: '',
        next: ''
      },
      general: {},
      economic: {},
      military: {},
      science: {},
      map: {}
    };

    angular
        .module('app.core')
        .factory('app.core.service.turn', turnService);

    turnService.$inject = ['$log'];

    /* @ngInject */
    function turnService($log) {
        var service = {
            doUpdate: doUpdate
        };

        return service;

        function doUpdate() {

        }
    }
})();
