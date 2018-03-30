(function() {
    'use strict';

    angular
        .module('app.fleets')
        .controller('FleetsController', FleetsController);

    FleetsController.$inject = ['$window','block.user-login.session'];

    /* @ngInject */
    function FleetsController($window,$session) {
        var $ctrl = this;

        $ctrl.$onInit = activate;

        function activate() {
          $ctrl.session = $session;

          $ctrl.ui = {};
          $ctrl.ui.alerts = [];
          $ctrl.ui.history = [{state:'',label:'Fleets Management',active:true}];
          $ctrl.ui.message = "Organize your units into groups here!";
          $ctrl.ui.title = "Fleets Management";
        }
    }
})();
