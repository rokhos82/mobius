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

      $ctrl.$onInit = activate;

      function activate() {
        console.log("DevFooterController Activated");
      }
    }
})();
