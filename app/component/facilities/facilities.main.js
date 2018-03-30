mobius.facilities.controller = function($scope,$window,$uibModal,$filter) {
  var $ctrl = this;

  $ctrl.$onInit = function() {
    $ctrl.title = "Facilities Manager";
    $ctrl.welcome = "<p>Here be dragons!</p>";
    $ctrl.alerts = [];
  };

  $ctrl.onNewFacility = function(options) {
    let fac = null;
    if(options.type === mobius.facilities.type["research"]) {
      fac = new mobius.facilities.research(options);
    }
  };
};

mobius.app.component("mobius.facilities.main",{
  templateUrl: 'app/component/facilities/facilities.main.html',
  controller: ["$scope","$window","$uibModal","$filter",mobius.facilities.controller],
  bindings: {}
});
