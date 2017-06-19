////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Namespace
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science = {};

// Science Events
mobius.science.events = {};
mobius.science.events.dirty = "mobius.science.events.dirty";

mobius.science.project = function(name,description,stage,bonus) {
  this.name = name;
  this.description = description;
  this.stage = stage;
  this.bonus = bonus;
  this.funding = 0;
  this.prevFunding = 0;
  this.totalFunding = 0;
};

mobius.science.project.stages = [
  {name:"Discovery",index:0,next:1},
  {name:"Research",index:1,next:2},
  {name:"Development",index:2,next:3},
  {name:"Completed",index:3,fin:true}
];

mobius.science.modal = {};
mobius.science.modal.confirm = function($uibModal,title,message) {
  return $uibModal.open({
    animation: true,
    component: 'confirmModal',
    resolve: {
      options: function() {
        return {ttl: title,msg: message};
      }
    }
  });
};

mobius.science.modal.funding = function($uibModal,projects) {
  return $uibModal.open({
    animation: true,
    component: 'mobius.modal.science.funding',
    resolve: {
      options: function() {
        return {
          'projects': projects
        };
      }
    }
  });
};

// Science Funding Modal ///////////////////////////////////////////////////////////////////////////
mobius.app.component("mobius.modal.science.funding",{
  templateUrl: 'app/component/science/science.funding.html',
  controller: ["$scope","$location",function($scope,$location) {
    const $ctrl = this;

    $ctrl.confirm = function() {};
    $ctrl.cancel = function() { $ctrl.dismiss(); };

    $ctrl.$onInit = function() {
      $ctrl.options = $ctrl.resolve.options;
    };
  }],
  bindings: {
    resolve: "<",
    dismiss: "&",
    close: "&"
  }
});
