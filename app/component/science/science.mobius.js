////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Namespace
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science = {};

// Science Events ///////////////////////////////////////////////////////////////////////
mobius.science.events = {};
mobius.science.events.dirty = "mobius.science.events.dirty";

mobius.science.project = function(name,description,stage,bonus,fail) {
  this.uuid = window.uuid.v4();
  this.name = name;
  this.description = description;
  this.stage = stage;
  this.bonus = bonus;
  this.funding = 0;
  this.prevFunding = 0;
  this.totalFunding = 0;
  this.roll = undefined;
  this.success = false;
  this.failChance = fail || 1;
};

mobius.science.event = function(project,text,options) {
  this.project = project;
  this.text = text;
  _.defaults(this,options);
};

mobius.science.project.stages = [
  {name:"Discovery",index:0,next:1},
  {name:"Research",index:1,next:2},
  {name:"Development",index:2,next:3},
  {name:"Completed",index:3,finis:true}
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
  controller: ["$scope","$location","$window",function($scope,$location,$window) {
    const $ctrl = this;

    $ctrl.confirm = function() {
      $ctrl.close({$value:$ctrl.options});
    };
    $ctrl.cancel = function() { $ctrl.dismiss(); };

    $ctrl.updateFunding = function(project) {
      project.totalFunding = project.prevFunding + project.funding;
    };

    $ctrl.$onInit = function() {
      $ctrl.options = $window.angular.copy($ctrl.resolve.options);
    };
  }],
  bindings: {
    resolve: "<",
    dismiss: "&",
    close: "&"
  }
});

// Scince Tables ////////////////////////////////////////////////////////////////////////
mobius.science.tables = {};
mobius.science.tables.success = {
  1: 25,
  2: 50,
  3: 75,
  4: 100,
  5: 125,
  6: 150,
  7: 175,
  8: 200,
  9: 225,
  10: 250,
  11: 275,
  12: 300,
  13: 325,
  14: 350,
  15: 375,
  16: 400,
  17: 425,
  18: 450,
  19: 475,
  20: 500,
  21: 525,
  22: 550,
  23: 575,
  24: 600,
  25: 625,
  26: 650,
  27: 675,
  28: 700,
  29: 725,
  30: 750,
  31: 775,
  32: 800,
  33: 825,
  34: 850,
  35: 875,
  36: 900,
  37: 925,
  38: 950,
  39: 975,
  40: 1000,
  41: 1025,
  42: 1050,
  43: 1075,
  44: 1100,
  45: 1125,
  46: 1150,
  47: 1175,
  48: 1200,
  49: 1250,
  50: 1300,
  51: 1350,
  52: 1400,
  53: 1450,
  54: 1500,
  55: 1550,
  56: 1600,
  57: 1650,
  58: 1700,
  59: 1750,
  60: 1800,
  61: 1850,
  62: 1900,
  63: 1950,
  64: 2000,
  65: 2050,
  66: 2100,
  67: 2150,
  68: 2200,
  69: 2250,
  70: 2300,
  71: 2350,
  72: 2400,
  73: 2500,
  74: 2600,
  75: 2700,
  76: 2800,
  77: 2900,
  78: 3000,
  79: 3100,
  80: 3200,
  81: 3300,
  82: 3400,
  83: 3500,
  84: 3600,
  85: 3800,
  86: 4000,
  87: 4200,
  88: 4400,
  89: 4600,
  90: 4800,
  91: 5200,
  92: 5600,
  93: 6000,
  94: 6800,
  95: 7600,
  96: 9200,
  97: 12400,
  98: 18800,
  99: 31500,
  100: 57200
};
