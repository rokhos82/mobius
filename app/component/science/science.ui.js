mobius.science.ui = mobius.app.factory("mobius.science.ui",["$rootScope","$window","$log",function($rootScope,$window,$log) {
  const _key = "mobius.scinece.ui";

  var _data = {};
  var _defaults = {
    turn: {
      current: 1,
      count: 1,
    },
    selectedProjects: [],
    selectAllProjects: false
  };

  var _state = {
    loaded: false
  };

  var _service = {};

  _service.save = function() {
    let json = $window.angular.toJson(_data);
    $window.localStorage.setItem(_key,json);
    console.log(json);
  };

  _service.load = function() {
    let json = $window.localStorage.getItem(_key);
    let data = $window.angular.fromJson(json) || _defaults;
    _data = data;
    _state.loaded = true;
  };

  _service.get = function() {
    if(!_state.loaded) {
      _service.load();
    }
    return _data;
  }

  _service.initialize = function(data) {
    // Get the number of turns in the data set and select the latest turn
    // as the turn to use.
    _data.turn.count = data.turns.count();
    _data.turn.current = _data.turn.current;
    _data.initialized = true;
  };

  _service.clear = function() {
    _data = _defaults;
    $window.localStorage.removeItem(_key);
    return _data;
  };

  return _service;
}]);
