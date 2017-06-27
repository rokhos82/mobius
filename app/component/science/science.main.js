////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Main UI
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
// Science Component Controller
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science.controller = function($scope,_data,$uibModal,$window) {
  const $ctrl = this;

  $ctrl.stages = mobius.science.project.stages;

  $ctrl.welcome = "<p>Welcome to the science manager.</p>"

  $ctrl.data = {};

  $ctrl.bonus = _data.listBonuses();

  $ctrl.events = _data.listEvents();

  // Get the array of projects from the science data service.
  $ctrl.projects = _data.listProjects();

  $ctrl.ui = {
    selectedProjects: {}
  };

  $ctrl.saveChanges = function() {
    _data.save();
  };

  $ctrl.addProject = function(proj) {
    let project = new mobius.science.project(proj.name,"",proj.stage,proj.bonus);
    $ctrl.projects = _data.createProject(project);
    return {};
  };

  $ctrl.updateProjects = function(projects) {
    mobius.science.modal.funding($uibModal,projects).result.then(
      // The projects have been funded.
      function(options) {
        let funding = options.projects;
        for(var i in funding) {
          _data.updateProject(funding[i]);
        }
        $ctrl.projects = _data.listProjects();
      }
    );
  };

  $ctrl.rollProjects = function() {
    // Roll a d100 for each project.
    // On a 1, the project is an instant success.
    // On a 100, the project is an instant CATASTROPHIC failure.
    // For other results, consult the success table and see if the project succeeded.
    _.each($ctrl.projects,function(project){
      $ctrl.rollProject(project);
    });
  };

  $ctrl.rollProject = function(project) {
    if(project.funding > 0 && !project.stage.finis) {
      // Calculate the success of the project.  Roll a d100 and if the result in the
      // success table is less than the effective funding then the project was a
      // success.  Otherwise, no, try again next turn.
      let effectiveFunding = Math.round(project.totalFunding * (100 + project.bonus + $ctrl.bonus.global) / 100);
      project.roll = mobius.functions.dieRoll(1,100);
      let success = (effectiveFunding >= mobius.science.tables.success[project.roll])
      let message = success ? "was successful" : "failed";
      project.success = success;
      $ctrl.events.push(new mobius.science.event(project.uuid,`${project.name} was effectively funded at ${effectiveFunding} and rolled a ${project.roll} and ${message}.`));
      if(success && !project.stage.finis) {
        project.stage = mobius.science.project.stages[project.stage.next];
        $ctrl.events.push(new mobius.science.event(project.uuid,`${project.name} has moved to the ${project.stage.name} stage.`))
        project.totalFunding = 0;
      }

      // Update project funding for the next turn.
      project.prevFunding = project.totalFunding;
      project.funding = 0;

      _data.save();
    }
    else {
      $ctrl.events.push(new mobius.science.event(project.uuid,`${project.name} was not funded this turn.  No roll.`));
    }
  };

  $ctrl.clearProjects = function() {
    mobius.science.modal.confirm($uibModal,'Science Manager','Are you sure you want to clear all of the projects?').result.then(
      // The modal was confirmed.  Clear the projects.
      function () {
      $ctrl.projects = _data.clearProjects();
      _data.save();
    });
  };

  // Remove those projects with checked checkboxes /////////////////////////////////////////////////
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
	controller: ["$scope","mobius.science.data","$uibModal","$window",mobius.science.controller],
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
      if(project.stage && project.stage.finis !== true) {
        filtered.push(project);
      }
    });
    return filtered;
  };
}]);
