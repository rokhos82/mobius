(function() {
    'use strict';

    angular
        .module('block.dev-footer')
        .component('mobDevFooter', mobDevFooter());

    /* @ngInject */
    function mobDevFooter() {
        var component = {
            templateUrl: 'app/blocks/dev-footer/dev-footer.html',
            controller: DevFooterController,
            bindings: {
              label: "@",
              watching: "="
            }
        };

        return component;
    }

    DevFooterController.$inject = ['$window'];

    /* @ngInject */
    function DevFooterController($window) {
      var $ctrl = this;

      $ctrl.show = false;
      $ctrl.$onInit = activate;

      function activate() {
      }
    }
})();
