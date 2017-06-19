////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Main UI
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
// Science Component Controller
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science.controller = function($scope,_data,$uibModal) {
  const $ctrl = this;

  $ctrl.stages = mobius.science.project.stages;

  $ctrl.welcome = "<p>Welcome to the science manager."

  $ctrl.data = {};

  $ctrl.events = _data.listEvents();

  $ctrl.projects = _data.listProjects();

  $ctrl.ui = {
    selectedProjects: []
  };

  $ctrl.addProject = function(proj) {
    let project = new mobius.science.project(proj.name,"",proj.stage,proj.bonus);
    $ctrl.projects.push(project);
    _data.save();
  };

  $ctrl.updateProjects = function() {};

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
    let selected = $ctrl.ui.selectedProjects;
    for(var i = 0;i < selected.length;i++) {
      let checked = selected[i];
      // Is the checkbox checked?
      if(checked) {
        // Yes, then remove that project.
        $ctrl.projects.splice(i,1);
      }
    }
    $ctrl.ui.selectedProjects = [];
    _data.save();
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
