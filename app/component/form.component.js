////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Form Component
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.input = {};
mobius.input.types = {
  text: "text"
};

var mobiusInputCtrl = function($scope) {
  var $ctrl = this;

  $ctrl.types = mobius.input.types;
};

mobius.app.component("mobiusInput"),{
  templateUrl: "app/component/form.component.html",
  controller: ["$scope",mobiusInputCtrl],
  bindings: {
    model: "=",
    type: "@",
    id: "@",
    label: "@"
  }
});
