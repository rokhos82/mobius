(function() {
  'use strict';

  angular
    .module('app.core')
    .service('app.core.game', GameService)
    .config(getConstants);

  GameService.$inject = [
    '$window',
    'block.alerts.alertFactory',
    'service.rest',
    '$log'
  ];

  /* @ngInject */
  function GameService(
    $window,
    $alerts,
    $rest,
    $log
  ) {
    var $service = this;
    $service.create = create;
    $service.save = save;
    $service.hash = hash;
    $service.list = list;
    $service.select = select;
    $service.get = get;

    var _key = "app.core.game";

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

    var _data = $rest.get(_key);
    var _selected = undefined;

    function create(options) {
      var game = $window.angular.copy(_template);
      var uuid = $window.uuid.v4();

      game.general.uuid = uuid;
      game.general.name = options.name;
      game.general.description = options.desc;
      game.general.tags = options.tags.split(",").map(function(tag){return tag.trim();});

      $log.info(game);

      _data[uuid] = game;

      $alerts.create('Game Created!','success',5000);
    }

    function save() {
      $rest.set(_key,_data);
    }

    function hash() {
      return _data;
    }

    function list() {
      return _.values(_data);
    }

    function select(key) {
      if(_data[key]) {
        _selected = _data[key];
      }
    }

    function get() {
      return _selected;
    }
  }

  getConstants.$inject = [
    '$provide'
  ];

  function getConstants(
    $provide
  ) {
    $provide.constant('app.core.game.const.status',{open:'open',closed:'closed'});
    $provide.constant('app.core.game.template',{
      general: {
        uuid: '',
        name: '',
        description: '',
        tags: [],
        status: 0
      },
      races: {},
      players: {}
    });
  }
})();
