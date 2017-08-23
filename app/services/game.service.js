(function() {
  'use strict';

  angular
    .module('app.core')
    .service('app.core.game', GameService);

  GameService.$inject = [
    'block.alerts.alertFactory'
  ];

  /* @ngInject */
  function GameService(
    $alerts
  ) {
    this.save = save;

    function save() {
    }
  }
})();
