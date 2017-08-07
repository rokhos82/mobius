(function() {
  'use strict';

  angular
    .module('app.science')
    .filter('completedResearch', completedResearch);

  completedResearch.$inject = ['$window'];
  /* @ngInject */
  function completedResearch($window) {
    return completedResearchFilter

    function completedResearchFilter(projects) {
      let filtered = [];
      $window.angular.forEach(projects,function(project) {
        if(project.state && project.state.finis === true) {
          filtered.push(project);
        }
      });
      return filtered;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.science')
    .filter('activeResearch', activeResearch);

  activeResearch.$inject = ['$window'];
  /* @ngInject */
  function activeResearch($window) {
    return activeResearchFilter

    function activeResearchFilter(projects) {
      let filtered = [];
      /*$window.angular.forEach(projects,function(project,index){
        if(project.stage && project.stage.finis !== true && project.status === mobius.science.project.statuses[0]) {
          filtered.push(project);
        }
      });
      return filtered;//*/
      return projects;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.science')
    .filter('suspendedResearch', suspendedResearch);

  suspendedResearch.$inject = ['$window'];
  /* @ngInject */
  function suspendedResearch($window) {
    return suspendedResearchFilter

    function suspendedResearchFilter(projects) {
      let filtered = [];
      /*$window.angular.forEach(projects,function(project,index){
        if (project.stage && project.stage.finis !== true && project.status === mobius.science.project.statuses[1]) {
          filtered.push(project);
        }
      });
      return filtered;//*/
      return projects;
    }
  }
})();
