(function() {
    'use strict';

    angular
        .module('app.units')
        .controller('UnitsController', UnitsController);

    UnitsController.$inject = ['$window','block.alerts.alertFactory','block.user-login.service'];

    /* @ngInject */
    function UnitsController($window,alert,user) {
        var $ctrl = this;

        $ctrl.$onInit = activate;

        function activate() {
          $ctrl.session = user.getSession();

          $ctrl.ui = {};
          $ctrl.ui.alerts = [];
          $ctrl.ui.history = [{state:'',label:'Units',active:true}];
          $ctrl.ui.message = "Create, replace, design!  Do it all here!";
          $ctrl.ui.title = "Units Management";
        }
    }
})();
