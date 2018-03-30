mobius.science.ui = mobius.app.factory("mobius.science.ui",["$rootScope","$window","$log",function($rootScope,$window,$log) {
  const _key = "mobius.scinece.ui";

  var _data = {};
  var _default = {
    turn: {
      current: 1,
      count: 1,
    },
    alerts: []
  };

  var _state = {
    loaded: false
  };

  var _service = {};

  _service.save = function() {
    let json = $window.angular.toJson(_data);
    $window.localStorage.setItem(_key,json);
  };

  _service.load = function() {
    let json = $window.localStorage.getItem(_key);
    if(json === null) {
      _data = _default;
      _service.save();
    }
    else {
      _data = $window.angular.fromJson(json);
      _.defaults(_data,_default);
    }
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
    _data = _default;
    $window.localStorage.removeItem(_key);
    return _data;
  };

  return _service;
}]);
