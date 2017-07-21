////////////////////////////////////////////////////////////////////////////////
// Mobius Science Namespace
////////////////////////////////////////////////////////////////////////////////
mobius.science = {};

// Science Events //////////////////////////////////////////////////////////////
mobius.science.events = {};
mobius.science.events.dirty = "mobius.science.events.dirty";

// Science Turn Object /////////////////////////////////////////////////////////
mobius.science.turn = function(options) {
  this.uuid = mobius.functions.uuid();
  _.defaults(this,options);
  _.defaults(this,mobius.science.turn.default);
};

mobius.science.turn.default = {
  uuid: "invalid",
  currentTurn: -1,
  projects: {},
  stages: {}
};

mobius.science.turn.prototype.newProject = function(options) {
  // Create the new project and add to the projects hash.  Also flag
  // the turn as dirty for the data service.
  let project = new mobius.science.project(options);
  this.projects[project.uuid] = project;
};

mobius.science.turn.prototype.listProjects = function() {
  // Return the projects hash as an array for use with Angular.
  return _.toArray(this.projects);
};

mobius.science.turn.prototype.getProject = function(uuid) {
  let project = this.projects[uuid] || false;
  return project;
};

mobius.science.turn.prototype.removeProject = function(uuid) {
  delete this.projects[uuid];
};

mobius.science.turn.prototype.updateProject = function(options) {
  let uuid = options.uuid;
  let project = this.projects[uuid];
  let keys = _.keys(_.omit(options,'uuid'));
  _.each(keys,function(key,index,list){
    project[key] = options[key];
  });
};

// Science Turn Setup Stage Object ---------------------------------------------
mobius.science.turn.setup = function() {
  this.projects = {};
};

// Science Project Object //////////////////////////////////////////////////////
mobius.science.project = function(options) {
  // Generate a unique ID for the research project.  Then copy in any options
  // passed and then set any defaults that remain.

  // If the options are a JSON string convert it to an object.
  if(typeof options === "string") {
    options = angular.fromJson(options);
  }

  // Do the options include a UUID?
  this.uuid = options.uuid || mobius.functions.uuid();

  // Apply the options to 'this' and any other default values.
  _.defaults(this,options);
  _.defaults(this,mobius.science.project.default);
};

mobius.science.project.prototype.copy = function() {
  // Since a project object is very simple use Angular to do a copy of the
  // object and return.
  return angular.copy(this);
};

mobius.science.project.prototype.toJson = function() {
  // Use Angular to covert the object to JSON and return the string.
  return angular.toJson(this);
};

// Science Event Log Object ////////////////////////////////////////////////////
mobius.science.event = function(options) {
  _.defaults(this,options);
  _.defaults(this,mobius.science.event.default);
};

mobius.science.project.stages = [
  {name:"Discovery",index:0,next:1},
  {name:"Research",index:1,next:2},
  {name:"Development",index:2,next:3},
  {name:"Completed",index:3,finis:true}
];

mobius.science.project.statuses = ["active","suspended"];

mobius.science.project.default = {
  name: "default",
  description: "this should be replaced",
  stage: mobius.science.project.stages[0],
  bonus: 0,
  failChance: 1,
  funding: 0,
  prevFunding: 0,
  totalFunding: 0,
  status: mobius.science.project.statuses[0]
};

mobius.science.event.default = {
  project: "default",
  text: "Default text please replace.",
  type: "info"
};

mobius.science.modal = {};
mobius.science.modal.confirm = function($uibModal,title,message) {
  return $uibModal.open({
    animation: true,
    backdrop: 'static',
    component: 'confirmModal',
    resolve: {
      options: function() {
        return {ttl: title,msg: message};
      }
    }
  });
};

mobius.science.modal.detail = function($uibModal,project) {
  return $uibModal.open({
    animation: true,
    component: 'mobius.modal.science.detail',
    resolve: {
      options: function() {
        return {
          'project': project
        };
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

mobius.science.modal.new = function($uibModal,project) {
  return $uibModal.open({
    animation: true,
    component: 'mobius.modal.science.new',
    resolve: {
      options: function() {
        return {
          'project': project
        }
      }
    }
  });
};

mobius.science.modal.bonuses = function($uibModal,bonuses) {
  return $uibModal.open({
    animation: true,
    component: 'mobius.modal.science.bonus',
    resolve: {
      options: function() {
        return {
          'bonuses': bonuses
        }
      }
    }
  });
};

// Project Detail Modal ///////////////////////////////////////////////////////////////////////////
mobius.app.component("mobius.modal.science.detail",{
  templateUrl: 'app/component/science/science.detail.html',
  controller: ["$scope","$location","$window",function($scope,$location,$window) {
    const $ctrl = this;

    $ctrl.stages = mobius.science.project.stages;
    $ctrl.statuses = mobius.science.project.statuses;

    $ctrl.confirm = function() {
      $ctrl.close({$value:$ctrl.project});
    };
    $ctrl.cancel = function() { $ctrl.dismiss(); };

    $ctrl.updateFunding = function() {
      $ctrl.project.totalFunding = $ctrl.project.prevFunding + $ctrl.project.funding;
    };

    $ctrl.$onInit = function() {
      $ctrl.options = $window.angular.copy($ctrl.resolve.options);
      $ctrl.project = $ctrl.options.project;
      $ctrl.project.stage = $ctrl.stages[$ctrl.project.stage.index];
      console.log($ctrl.project.stage);
      console.log($ctrl.stages);
    };
  }],
  bindings: {
    resolve: "<",
    dismiss: "&",
    close: "&"
  }
});

// Science Funding Modal ///////////////////////////////////////////////////////////////////////////
mobius.app.component("mobius.modal.science.funding",{
  templateUrl: 'app/component/science/science.funding.html',
  controller: ["$scope","$location","$window","$timeout",function($scope,$location,$window,$timeout) {
    const $ctrl = this;

    $ctrl.stages = mobius.science.project.stages;
    $ctrl.statuses = mobius.science.project.statuses;

    $ctrl.confirm = function() {
      $ctrl.close({$value:$ctrl.options});
    };
    $ctrl.cancel = function() { $ctrl.dismiss(); };

    $ctrl.updateFunding = function(project) {
      project.totalFunding = project.prevFunding + project.funding;
    };

    $ctrl.applyFunding = function(funding) {
      _.each($ctrl.options.projects,function(project){
        project.funding = funding;
        $ctrl.updateFunding(project);
      });
    };

    $ctrl.totalFunding = function() {
      return _.reduce($ctrl.options.projects,function(total,project) { return total + project.funding },0);
    };

    $ctrl.$onInit = function() {
      $ctrl.options = {};
      $ctrl.options.projects = [];
      _.each($ctrl.resolve.options.projects,function(project) {
        $ctrl.options.projects.push(_.pick(project,['uuid','name','funding','prevFunding','totalFunding','success','stage']));
      });

      $timeout(function(){
        $window.document.getElementById('fundingLevel').focus();
      });
    };
  }],
  bindings: {
    resolve: "<",
    dismiss: "&",
    close: "&"
  }
});

// New Project Modal ////////////////////////////////////////////////////////////////////
mobius.app.component("mobius.modal.science.new",{
  templateUrl: 'app/component/science/science.new.html',
  controller: ["$scope","$location","$window","$timeout",function($scope,$location,$window,$timeout) {
    const $ctrl = this;

    $ctrl.stages = mobius.science.project.stages;
    $ctrl.statuses = mobius.science.project.statuses;

    $ctrl.confirm = function() {
      $ctrl.close({$value:$ctrl.options});
    };
    $ctrl.cancel = function() { $ctrl.dismiss(); };

    $ctrl.$onInit = function() {
      $ctrl.options = $window.angular.copy($ctrl.resolve.options);

      $ctrl.options.project = $ctrl.options.project || {};
      $ctrl.project = $ctrl.options.project;

      // If the new project already has a stage then it is most likely a new
      // level to an existing project.
      if($ctrl.project.stage) {
        $ctrl.project.stage = $ctrl.stages[1];
      }
      else {
        $ctrl.project.stage = $ctrl.stages[0];
      }
      delete $ctrl.project.uuid;

      $ctrl.project.status = mobius.science.project.statuses[0];

      $timeout(function(){
        $window.document.getElementById('name').focus();
      });
    };
  }],
  bindings: {
    resolve: "<",
    dismiss: "&",
    close: "&"
  }
});

// Research Bonuses Modal ////////////////////////////////////////////////////////////////////
mobius.app.component("mobius.modal.science.bonus",{
  templateUrl: 'app/component/science/science.bonuses.html',
  controller: ["$scope","$location","$window","$timeout",function($scope,$location,$window,$timeout) {
    const $ctrl = this;

    $ctrl.stages = mobius.science.project.stages;
    $ctrl.statuses = mobius.science.project.statuses;

    $ctrl.confirm = function() {
      $ctrl.close({$value:$ctrl.bonuses});
    };
    $ctrl.cancel = function() { $ctrl.dismiss(); };

    $ctrl.$onInit = function() {
      //$ctrl.options = $window.angular.copy($ctrl.resolve.options);
      $ctrl.bonuses = $window.angular.copy($ctrl.resolve.options.bonuses);
      console.log($ctrl.bonuses);

      /*$timeout(function(){
        $window.document.getElementById('name').focus();
      });//*/
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
