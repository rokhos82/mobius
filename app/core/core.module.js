(function() {
    'use strict';

    angular
        .module('app.core', [
          /* Angular Modules */
          'ngAnimate',
          'ngResource',
          'ngSanitize',
          /* Building Blocks */
          'block.alerts',
          /* 3rd-party modules */
          'ui.bootstrap',
          'ui.router'
        ]);
})();
