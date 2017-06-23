////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Data Service
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science.data = mobius.app.factory("mobius.science.data",["$rootScope","$window",function($rootScope,$window){
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
    _data = $window.angular.fromJson(localStorage.getItem(_key)) || _default;
    _state.loaded = true;
  }

  // Setup Message Handlers
  $rootScope.$on(mobius.science.events.dirty,_service.save);

  _service.save = function() {
    console.log("Saving science data.");
    localStorage.setItem(_key,$window.angular.toJson(_data));
  };

  _service.listBonuses = function() {
    return _data.bonus;
  };

  _service.listProjects = function() {
    return _.toArray(_data.projects);
  };

  _service.createProject = function(project) {
    _data.projects[project.uuid] = project;
    _service.save();
    return _service.listProjects();
  };

  _service.updateProject = function(updates) {
    let uuid = updates.uuid;
    let project = _data.projects[uuid];
    let keys = _.keys(_.omit(updates,'uuid'));
    _.each(keys,function(key,index,list){
      this[key] = updates[key];
    },project);
    _service.save();
  };

  _service.clearProjects = function() {
    delete _data.projects;
    _data.projects = {};
    return _service.listProjects();
  };

  _service.listEvents = function() {
    return _data.events;
  };

  return _service;
}]);
