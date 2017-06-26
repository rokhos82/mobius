////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Main UI
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
// Science Component Controller
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science.controller = function($scope,_data,$uibModal) {
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
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.app.component("scienceMain",{
	templateUrl: 'app/component/science/science.main.html',
	controller: ["$scope","mobius.science.data","$uibModal",mobius.science.controller],
	bindings: {}
});
