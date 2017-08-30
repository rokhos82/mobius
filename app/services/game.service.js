(function() {
  'use strict';

  angular
    .module('app.core')
    .service('app.core.game', GameService)
    .config(getConstants);

  GameService.$inject = [
    '$window',
    'block.alerts.alertFactory',
  ];

  /* @ngInject */
  function GameService(
    $window,
    $alerts
  ) {
    this.create = create;
    this.save = save;

    var _template = {
      general: {
        name: '',
        description: '',
        tags: [],
        status: 0
      },
      races: {},
      players: {}
    };

    function create(options) {
      var game = $window.angular.copy(_template);

      game.general.name = options.general.name;
      game.general.description = options.general.description;
      game.general.tags;

      $alerts.create('Game Created!','success',5000);
    }

    function save() {
    }
  }

  getConstants.$inject = [
    '$provide'
  ];

  function getConstants(
    $provide
  ) {
    $provide.constant('app.core.game.const.status',{open:'open',closed:'closed'});
  }
})();
