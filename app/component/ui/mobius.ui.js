////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Generic UI Namepsace
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.ui = {};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Select Form Element
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.ui.select = mobius.app.component('mobiusSelect',{
  template: '<div class="form-group"><label for="select" class="control-label col-lg-2">{{$ctrl.label}}</label><div class="col-lg-10"><select id="select" class="form-control" ng-options="{{$ctrl.selector}} in $ctrl.options" ng-model="$ctrl.selected" ng-change="$ctrl.change()"></select></div></div>',
  controller: ["$scope","$window",function($scope,$window) {
    const $ctrl = this;

    $ctrl.change = function() {
      $ctrl.mobiusSelected = $ctrl.selected;
    };

    $ctrl.$onInit = function() {
      $ctrl.options = $window.angular.copy($ctrl.mobiusOptions);
      $ctrl.selector = $window.angular.copy($ctrl.mobiusSelector);
      $ctrl.label = $window.angular.copy($ctrl.mobiusLabel);
      $ctrl.selected = $ctrl.options[0];
      $ctrl.mobiusSelected = $ctrl.selected;
    };
  }],
  bindings: {
    mobiusOptions: "<",
    mobiusSelector: "@",
    mobiusLabel: "@",
    mobiusSelected: "="
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Number Input Form Element
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.ui.number = mobius.app.component('mobiusNumber',{
  template: '',
  controller: ["$scope","$window",function($scope,$window){
    const $ctrl = this;

    $ctrl.$onInit = function() {};
  }],
  bindings: {}
});
