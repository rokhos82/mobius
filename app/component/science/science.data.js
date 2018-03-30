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
  });

  const _key = "mobius.science.data";
  var _service = {};
  var _state = {
    loaded: false
  };
  let _default = {
    bonus: {
      global: 0
    },
    projects: {},
    events: [],
    alerts: [],
    general: {
      turn: 0
    },
    turns: []
  };

  // Set the data object to the defaults object.  This may be overwritten
  // later when localStorage is loaded.
  var _data = _default;

  _state.save = function() {
    let json = $window.angular.toJson(_data);
    $window.localStorage.setItem(_key,json);
    console.log("Saving science manager data.");
  };

  _state.load = function() {};

  // Restore the data object from localStorage if not loaded
  if(!_state.loaded) {
    let json = localStorage.getItem(_key);

    if(json === null) {
      // Save the defaults to localStorage
      _state.save();
    }
    else {
      let data = $window.angular.fromJson(json);
      console.log(_data);

      // Build new turn objects for each turn.
      _.each(data.turns,function(turn,index) {
        let t = new mobius.science.turn(turn);
        console.log(t);
        _data.turns.push(t);
      });

      // Pull out the research bonuses.
      _data.bonus = data.bonus;
    }
    _state.loaded = true;
  }

  // Setup Message Handlers
  $rootScope.$on(mobius.science.events.dirty,_service.save);

  // Serivce Functions for Turns -----------------------------------------------
  _service.turns = {};

  _service.turns.create = function(options) {
    let turn = new mobius.science.turn(options);
    console.log(turn);
    _data.turns.push(turn);
    return turn;
  };

  _service.turns.read = function(index) {
    let turn = _data.turns[index] || _data.turns;
    return turn;
  };

  _service.turns.update = function(options) {};

  _service.turns.delete = function(index) {
    if(index) {
      _data.turns.splice(index,1);
      // Reset the current turn attribute of all of the remaining turns.
      _.each(_data.turns,function(turn,index) {
        turn.currentTurn = index+1;
      });
      return _data.turns;
    }
    else {
      _data.turns = [];
      return _data.turns;
    }
  };

  _service.turns.count = function() {
    return _data.turns.length;
  }

  // Service Functions for Bonuses ---------------------------------------------
  _service.bonuses = {};

  _service.bonuses.create = function(options) {};

  _service.bonuses.read = function(category) {
    let bonus = _data.bonus[category] || _data.bonus;
    return bonus;
  };

  // Service Functions for Projects --------------------------------------------
  _service.projects = {};

  _service.projects.read = function(uuid,turn) {
    // Return the specific project or a list of all projects.
    let res = _data.projects[uuid] || _.toArray(_data.projects);
    return res;
  };

  _service.projects.create = function(options) {
    let project = new mobius.science.project(options);
  };

  _service.projects.delete = function(uuid) {};

  // Old service functions -----------------------------------------------------
  _service.save = _state.save;

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

  _service.createEvent = function(event) {
    _data.events.unshift(event);
    return _data.events;
  };

  _service.listAlerts = function() {
    return _data.alerts;
  };

  _service.clearAlerts = function() {
    _data.alerts = [];
    return _data.alerts;
  };

  _service.getTurn = function() {
    return _data.general.turn;
  };

  _service.setTurn = function(turn) {
    _data.general.turn = turn;
  }

  return _service;
}]);
