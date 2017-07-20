/////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Main UI
/////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////
// Science Component Controller
/////////////////////////////////////////////////////////////////////////////////////////
mobius.science.controller = function($scope,_data,_ui,$uibModal,$window,$filter) {
  const $ctrl = this;

  $ctrl.user = {
    level: 0
  };

  $ctrl.stages = mobius.science.project.stages;
  $ctrl.welcome = `<p>Welcome to the science manager. Here you will manage your research projects and related information.</p><p class="text-info">Race Name (Game Name) - Turn 1</p>`;

  $ctrl.bonus = {};
  $ctrl.alerts = {
    general: [],
    research: []
  };

  // $onInit - Setup the component /////////////////////////////////////////////
  $ctrl.$onInit = function() {
    // Get the turn objects from the data service.
    $ctrl.turns = _data.turns.read();
    // Get the UI object from the ui service.
    $ctrl.ui = _ui.get();

    // Initialize the UI objects components if needed.
    if(!$ctrl.ui.initialized) {
      _ui.initialize(_data);
    }

    // Are there any turns present in the data set?
    if($ctrl.turns.length === 0) {
      // Create a new turn and it is turn 1.
      let turn = _data.turns.create({currentTurn:1});
      $ctrl.projects = turn.projects;
      $ctrl.ui.turn.count = 1;
    }

    $ctrl.turn = $ctrl.turns[$ctrl.ui.turn.current-1];
    $ctrl.projects = $ctrl.turns[$ctrl.ui.turn.current-1].listProjects();

    // Get the research bonuses.
    $ctrl.bonus = _data.bonuses.read();

    // Bridging the gap with the old way...
    $ctrl.events = _data.listEvents();
    $ctrl.dataService = _data;
  };

  $ctrl.saveUI = _ui.save;

  $ctrl.saveChanges = function() {
    _data.save();
  };

  // Add a project event ////////////////////////////////////////////////////////////////
  $ctrl.addEvent = function(event) {
    $ctrl.events = _data.createEvent(event);
    _data.save();
  };

  // Add a new research project /////////////////////////////////////////////////////////
  $ctrl.addProject = function(proj) {
    $ctrl.turn.newProject(proj);
    $ctrl.projects = $ctrl.turn.listProjects();
  };

  // Open the new project modal /////////////////////////////////////////////////////////
  $ctrl.onNewProject = function(proj) {
    mobius.science.modal.new($uibModal,proj).result.then(
      function(output) {
        let project = output.project;
        $ctrl.addProject(project);
        $ctrl.addEvent(new mobius.science.event({'project':project.uuid,'text':`Started new project: ${project.name} @ ${project.stage.name} stage.`,'type':'info'}));
      }
    );
  };

  $ctrl.updateProjects = function(project) {
    mobius.science.modal.detail($uibModal,project).result.then(
      // Project details have been changed.
      function(project) {
        $ctrl.turn.updateProject(project);
        $ctrl.projects = $ctrl.turn.listProjects();
        _data.save();
      }
    );
  };

  $ctrl.fundProjects = function(projects) {
    let filtered = $filter('activeResearch')(projects);
    mobius.science.modal.funding($uibModal,filtered).result.then(
      // The projects have been funded.  Update the project information.
      function(output) {
        let fundedProjects = output.projects;
        _.each(fundedProjects,function(fundedProject){
          $ctrl.turn.updateProject(fundedProject);
        });
        $ctrl.projects = $ctrl.turn.listProjects();
        _data.save();
      }
    );
  };

  $ctrl.rollProjects = function() {
    // Roll a d100 for each project.
    // On a 1, the project is an instant success.
    // On a 100, the project is an instant CATASTROPHIC failure.
    // For other results, consult the success table and see if the project succeeded.

    // Filter out the completed projects.
    let projects = $filter('activeResearch')($ctrl.projects);

    _.each(projects,function(project){
      $ctrl.rollProject(project);
    });
  };

  $ctrl.rollSelectedProjects = function() {
    _.chain($ctrl.ui.selectedProjects).map(function(selected,uuid){
      if(selected) {
        return uuid;
      }
    }).each(function(uuid) {
      let project = _data.getProject(uuid);
      if(typeof project === "object") {
        console.log(project);
        $ctrl.rollProject(project);
      }
      else {
        console.warn(project);
      }
    });
  };

  $ctrl.rollProject = function(project) {
    // Make sure the project is funded and not completed.
    if(project.funding > 0 && !project.stage.finis) {
      // Calculate the success of the project.  Roll a d100 and if the result in the
      // success table is less than the effective funding then the project was a
      // success.  Otherwise, no, try again next turn.
      let effectiveFunding = Math.round(project.totalFunding * (100 + project.bonus + $ctrl.bonus.global) / 100);
      project.roll = mobius.functions.dieRoll(1,100);
      let options = {
        'success': undefined,
        'fail': project.roll == 1 ? true : false
      };

      // Did the project fail?
      if(project.roll <= project.failChance) {
        // Yes, log the event
        $ctrl.alerts.research.push(new mobius.pageAlerts.alert(`${project.name} failed this turn!`,"danger"));
        $ctrl.addEvent(new mobius.science.event({'project':project.uuid,'text':`${project.name} rolled a ${project.roll} and had a catastrophic failure.`,'type':'danger'}));
      }
      else {
        // No, see if the project succeeded.
        let success = (effectiveFunding >= mobius.science.tables.success[project.roll])
        let message = success ? "was successful" : "did not succeed";
        project.success = success;
        options.success = success;
        $ctrl.addEvent(new mobius.science.event({'project':project.uuid,'text':`${project.name} was effectively funded at ${effectiveFunding} and rolled a ${project.roll} and ${message}.`,'type': success ? 'success' : 'warning'}));
        if(success && !project.stage.finis) {
          project.stage = mobius.science.project.stages[project.stage.next];
          options.advance = true;
          $ctrl.addEvent(new mobius.science.event({'project':project.uuid,'text':`${project.name} has moved to the ${project.stage.name} stage.`,'type':'special'}));
          project.totalFunding = 0;
          if(project.stage.finis) {
            $ctrl.alerts.research.push(new mobius.pageAlerts.alert(`Research into ${project.name} is now finished!`,"special"));
          }
          else {
            $ctrl.alerts.research.push(new mobius.pageAlerts.alert(`${project.name} was successful this turn.`,"success"));
          }
        }
      }

      // Update project funding for the next turn.
      project.prevFunding = project.totalFunding;
      project.funding = 0;

      _data.save();
    }
    else {
      $ctrl.addEvent(new mobius.science.event(project.uuid,`${project.name} was not funded this turn.  No roll.`));
    }
  };

  // Remove all projects and events from the manager ////////////////////////////////////
  $ctrl.clearProjects = function() {
    mobius.science.modal.confirm($uibModal,'Science Manager','Are you sure you want to clear all of the projects? This action cannot be undone.').result.then(
      // The modal was confirmed.  Clear the projects.
      function () {
      $ctrl.projects = _data.clearProjects();
      $ctrl.events = _data.clearEvents();
      $ctrl.alerts = _data.clearAlerts();
      $ctrl.turns = _data.turns.delete();
      $ctrl.$onInit();
      _data.save();
    });
  };

  // Reset UI state variables
  $ctrl.clearUI = function() {
    $ctrl.ui = _ui.clear();
  };

  // Remove those projects with checked checkboxes //////////////////////////////////////
  $ctrl.removeSelectedProjects = function() {
    mobius.science.modal.confirm($uibModal,'Science Manager','Are you sure you want to remove the selected projects?').result.then(
      // The modal was confirmed.  Remove the selected projects.
      function () {
        // FOr each project look to see if the project has been checked and then remove that project
        // via the science data service.  Then get the new list of projects and save to
        // localStorage.  Lastly, reset the checkboxes.
        _.each($ctrl.ui.selectedProjects,function(checked,uuid) {
          if(checked) {
            _data.deleteProject(uuid);
          }
        });
        $ctrl.projects = _data.listProjects();
        $ctrl.ui.selectedProjects = {};
        _data.save();
      }
    );
  };

  // Total Funding caluclation //////////////////////////////////////////////////////////
  $ctrl.totalFunding = function() {
    return _.reduce($filter('activeResearch')($ctrl.projects),function(total,project){return total + project.funding;},0);
  };

  // Apply the check to all check boxes on the active projects //////////////////////////
  $ctrl.checkAllProjects = function() {
    console.log($ctrl.ui.selectAllProjects);
    _.each($filter('activeResearch')($ctrl.projects),function(project){
      $ctrl.ui.selectedProjects[project.uuid] = $ctrl.ui.selectAllProjects;
    });
  };

  // Open the project export modal //////////////////////////////////////////////////////
  $ctrl.exportProjects = function() {
    let modal = $uibModal.open({
      animation: true,
      component: "exportModal",
      resolve: {
        options: function() {
          return {
            title: "Research Project Export",
            msg: "Use the text field below to export a group of research projects."
          };
        },
        output: function() {
          let projects = $window.angular.copy($ctrl.projects);
          return projects;
        }
      }
    });
  };

  // Open the project import modal //////////////////////////////////////////////////////
  $ctrl.onImportProjects = function() {
    let modal = $uibModal.open({
      animation: true,
      component: "importModal",
      resolve: {
        options: function() { return {title:"Research Project Import",msg:"Enter a JSON string below to import a reseach project."}; }
      }
    });

    modal.result.then(function(projectsJson) {
      $ctrl.importProjects($window.angular.fromJson(projectsJson));
    });
  };

  // Import the provided projects to the science manager ////////////////////////////////
  $ctrl.importProjects = function(projects) {
    console.log(typeof projects);
    _.each(projects,function(project){
      $ctrl.projects = _data.createProject(project);
    });
  };

  // Command-line Execution
  $ctrl.execute = function(cmd) {
    console.log(cmd);
    return eval(cmd);
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.app.component("scienceMain",{
	templateUrl: 'app/component/science/science.main.html',
	controller: ["$scope","mobius.science.data","mobius.science.ui","$uibModal","$window","$filter",mobius.science.controller],
	bindings: {}
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.app.filter("completedResearch",["$window",function($window){
  return function(projects) {
    var filtered = [];
    $window.angular.forEach(projects,function(project){
      if(project.stage && project.stage.finis === true) {
        filtered.push(project);
      }
    });
    return filtered;
  };
}]);

mobius.app.filter("activeResearch",["$window",function($window){
  return function(projects) {
    var filtered = [];
    $window.angular.forEach(projects,function(project,index){
      if(project.stage && project.stage.finis !== true && project.status === mobius.science.project.statuses[0]) {
        filtered.push(project);
      }
    });
    return filtered;
  };
}]);

mobius.app.filter("suspendedResearch",["$window",function($window) {
  return function(projects) {
    var filtered = [];
    $window.angular.forEach(projects,function(project,index){
      if (project.stage && project.stage.finis !== true && project.status === mobius.science.project.statuses[1]) {
        filtered.push(project);
      }
    });
    return filtered;
  };
}]);
