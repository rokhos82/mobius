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
      $ctrl.options = $ctrl.mobiusOptions;
      //$ctrl.options = $window.angular.copy($ctrl.mobiusOptions);
      $ctrl.selector = $window.angular.copy($ctrl.mobiusSelector);
      $ctrl.label = $window.angular.copy($ctrl.mobiusLabel);

      let selected = $ctrl.mobiusSelected ? $ctrl.mobiusSelected.index : 0;
      $ctrl.selected = $ctrl.options[selected] || $ctrl.options[0];
      $ctrl.mobiusSelected = $ctrl.selected;
    };

    $scope.$on("mobius.reset",function(){
      $ctrl.selected = $ctrl.options[0];
      $ctrl.change();
    });
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
  template: '<div class="form-group"><label for="{{$ctrl.mobiusId}}" class="control-label col-lg-2">{{$ctrl.label}}</label><div class="col-lg-10"><input id="{{$ctrl.mobiusId}}" type="number" class="form-control" ng-model="$ctrl.value" placeholder="{{$ctrl.placeholder}}" /><div class="checkbox" ng-if="$ctrl.checkbox"><label><input type="checkbox" ng-model="$ctrl.checkboxModel" />{{$ctrl.checkbox}}</label></div></div></div>',
  controller: ["$scope","$window",function($scope,$window){
    const $ctrl = this;

    $ctrl.$onInit = function() {};
  }],
  bindings: {
    label: "@",
    value: "=",
    placeholder: "@",
    mobiusId: "@",
    checkbox: "@",
    checkboxModel: "="
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Number Input Form Element
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.ui.text = mobius.app.component('mobiusText',{
  template: '<div class="form-group"><label for="text" class="control-label col-lg-2">{{$ctrl.label}}</label><div class="col-lg-10"><input id="text" type="text" class="form-control" ng-model="$ctrl.value" placeholder="{{$ctrl.placeholder}}" /></div></div>',
  controller: ["$scope","$window",function($scope,$window){
    const $ctrl = this;

    $ctrl.$onInit = function() {};
  }],
  bindings: {
    label: "@",
    value: "=",
    placeholder: "@"
  }
});
