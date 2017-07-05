////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Data Service
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science.data = mobius.app.factory("mobius.science.data",["$rootScope","$window","$resource",function($rootScope,$window,$resource){
  var _resource = $resource("rest/science.php",{},{
    query: { method: "GET",isArray:true },
    create: { method: "POST" },
    get: { method: "GET" },
    remove: { method: "DELETE" },
    update: { method: "PUT" }
  })
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
    // Saves the local data objects to localStorage.
    console.log("Saving science data.");
    localStorage.setItem(_key,$window.angular.toJson(_data));
  };

  _service.listBonuses = function() {
    return _data.bonus;
  };

  _service.listProjects = function() {
    // Convert the dictionary to an array and return.  I am doing this because
    // AngularJS works best given arrays rather than dictionaries.
    return _.toArray(_data.projects);
  };

  _service.getProject = function(uuid) {
    return _data.projects[uuid] || `Error: Unknown project ID: ${uuid}`;
  };

  _service.createProject = function(project) {
    let uuid = project.uuid;
    if(!_data.projects[uuid]) {
      _data.projects[project.uuid] = project;
      _service.save();
      _resource.create(project,function(data) {
        let _uuid = data.uuid;
        console.log(`New project ${_uuid} pushed to backend.`);
      });
    }
    else {
      console.warn(`Attempted to create new project ${uuid} but that ID already exists!`);
    }

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

  _service.deleteProject = function(uuid) {
    console.log(`Removing project ${uuid}`);
    delete _data.projects[uuid];
  };

  _service.listEvents = function() {
    return _data.events;
  };

  _service.clearEvents = function() {
    _data.events = [];
    return _data.events;
  };

  return _service;
}]);
