(function() {
  'use strict';

  angular
    .module('app.core')
    .service('app.core.game', GameService)
    .config(getConstants);

  GameService.$inject = [
    '$window',
    'block.alerts.alertFactory',
    '$log'
  ];

  /* @ngInject */
  function GameService(
    $window,
    $alerts,
    $log
  ) {
    this.create = create;
    this.save = save;
    this.hash = hash;

    var _template = {
      general: {
        uuid: '',
        name: '',
        description: '',
        tags: [],
        status: 0
      },
      races: {},
      players: {}
    };

    var _data = {};

    function create(options) {
      var game = $window.angular.copy(_template);
      var uuid = $window.uuid.v4();

      game.general.uuid = uuid;
      game.general.name = options.name;
      game.general.description = options.description;
      game.general.tags = options.tags.split(",").forEach(function(tag){return tag.trim();});

      _data[uuid] = game;

      $alerts.create('Game Created!','success',5000);
    }

    function save() {
    }

    function hash() {
      return _data;
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
