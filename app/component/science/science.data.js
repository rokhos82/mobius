////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Data Service
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science.data = mobius.app.factory("mobius.science.data",["$rootScope",function($rootScope){
  const _key = "mobius.data.science";
  var _service = {};
  var _data = undefined;
  var _state = {
    loaded: false
  };
  let _default = {
    bonus: {
      global: 0
    },
    projects: {},
    events: []
  };

  // Restore the data object from localStorage if not loaded
  if(!_state.loaded) {
    _data = JSON.parse(localStorage.getItem(_key)) || _default;
    _state.loaded = true;
  }

  // Setup Message Handlers
  $rootScope.$on(mobius.science.events.dirty,_service.save);

  _service.save = function() {
    console.log("Saving science data.");
    localStorage.setItem(_key,JSON.stringify(_data));
  };

  _service.listBonuses = function() {
    return _data.bonus;
  };

  _service.listProjects = function() {
    return _data.projects;
  };

  _service.updateProject = funciton(updates) {

  };

  _service.listEvents = function() {
    return _data.events;
  };

  _service.clearProjects = function() {
    delete _data.projects;
    _data.projects = [];
    return _data.projects;
  };

  return _service;
}]);