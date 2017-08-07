(function() {
    'use strict';

    angular
        .module('app.science')
        .controller('ScienceController', ScienceController);

    ScienceController.$inject = ['$window'];

    /* @ngInject */
    function ScienceController($window) {
        var $ctrl = this;

        $ctrl.ui = {};
        $ctrl.ui.history = [{state:'',label:'Science Management',active:true}];
        $ctrl.ui.message = "She blinded me with science!";
        $ctrl.ui.title = "Science Management";

        activate();

        function activate() {

        }
    }
})();
