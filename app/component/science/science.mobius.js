////////////////////////////////////////////////////////////////////////////////////////////////////
// Mobius Science Namespace
////////////////////////////////////////////////////////////////////////////////////////////////////
mobius.science = {};

// Science Events ///////////////////////////////////////////////////////////////////////
mobius.science.events = {};
mobius.science.events.dirty = "mobius.science.events.dirty";

mobius.science.project = function(name,description,stage,bonus) {
  this.uuid = window.uuid.v4();
  this.name = name;
  this.description = description;
  this.stage = stage;
  this.bonus = bonus;
  this.funding = 0;
  this.prevFunding = 0;
  this.totalFunding = 0;
  this.roll = undefined;
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
  controller: ["$scope","$location","$window",function($scope,$location,$window) {
    const $ctrl = this;

    $ctrl.confirm = function() {
      $ctrl.close({$value:$ctrl.options});
    };
    $ctrl.cancel = function() { $ctrl.dismiss(); };

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
  25: 1,
  50: 2,
  75: 3,
  100: 4,
  125: 5,
  150: 6,
  175: 7,
  200: 8,
  225: 9,
  250: 10,
  275: 11,
  300: 12,
  325: 13,
  350: 14,
  375: 15,
  400: 16,
  425: 17,
  450: 18,
  475: 19,
  500: 20,
  525: 21,
  550: 22,
  575: 23,
  600: 24,
  625: 25,
  650: 26,
  675: 27,
  700: 28,
  725: 29,
  750: 30,
  775: 31,
  800: 32,
  825: 33,
  850: 34,
  875: 35,
  900: 36,
  925: 37,
  950: 38,
  975: 39,
  1000: 40,
  1025: 41,
  1050: 42,
  1075: 43,
  1100: 44,
  1125: 45,
  1150: 46,
  1175: 47,
  1200: 48,
  1250: 49,
  1300: 50,
  1350: 51,
  1400: 52,
  1450: 53,
  1500: 54,
  1550: 55,
  1600: 56,
  1650: 57,
  1700: 58,
  1750: 59,
  1800: 60,
  1850: 61,
  1900: 62,
  1950: 63,
  2000: 64,
  2050: 65,
  2100: 66,
  2150: 67,
  2200: 68,
  2250: 69,
  2300: 70,
  2350: 71,
  2400: 72,
  2500: 73,
  2600: 74,
  2700: 75,
  2800: 76,
  2900: 77,
  3000: 78,
  3100: 79,
  3200: 80,
  3300: 81,
  3400: 82,
  3500: 83,
  3600: 84,
  3800: 85,
  4000: 86,
  4200: 87,
  4400: 88,
  4600: 89,
  4800: 90,
  5200: 91,
  5600: 92,
  6000: 93,
  6800: 94,
  7600: 95,
  9200: 96,
  12400: 97,
  18800: 98,
  31500: 99,
  57200: 100
};
