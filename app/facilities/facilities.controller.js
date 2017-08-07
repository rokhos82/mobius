(function() {
    'use strict';

    angular
        .module('app.facilities')
        .controller('FacilitiesController', FacilitiesController);

    FacilitiesController.$inject = ['$window'];

    /* @ngInject */
    function FacilitiesController($window) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Facilities Management',active:true}];
        $ctrl.ui.message = "";
        $ctrl.ui.title = "Facilities Management";

        activate();

        function activate() {

        }
    }
})();
