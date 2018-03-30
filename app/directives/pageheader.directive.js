(function() {
  'use strict';

  angular
    .module('app.core')
    .directive('mobPageHeader', mobPageHeader);

  /* @ngInject */
  function mobPageHeader() {
    var directive = {
        restrict: 'E',
        templateUrl: 'app/directives/pageheader.html',
    };

    return directive;
  }
})();
