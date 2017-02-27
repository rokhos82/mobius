////////////////////////////////////////////////////////////////////////////////////////////////
// BattleEngine2 Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////
var mobiusEngine = {};

////////////////////////////////////////////////////////////////////////////////////////////////
// BattleEngine2 angular module
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app = angular.module('mobiusEngine',['ui.bootstrap','ui.router']);

mobiusEngine.app.config(['$compileProvider','$stateProvider','$locationProvider',
    function ($compileProvider,$stateProvider,$locationProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob|data):/);

        var defaultState = {
        	name: 'main',
        	url: '/',
        	component: 'mainWelcome'
        };

        var combatState = {
        	name: 'combat',
        	url: '/combat',
        	component: 'combatEngine'
        };

        var fleetState = {
        	name: 'fleet',
        	url: '/fleet',
        	component: 'fleetMain'
        };

        var unitState = {
        	name: 'unit',
        	url: '/unit',
        	component: 'unitMain'
        };

        var reportState = {
        	name: 'reports',
        	url: '/reports',
        	component: 'reportsMain'
        };

        var reportDtlState = {
            name: 'report',
            url: '/reports/{reportID}',
            component: 'reportsDetail',
            resolve: {
                simulation: ["mobius.data.simulation","$transition$",function(_data,$transition$) {
                    return _data.getSimulation($transition.params().key);
                }]
            }
        };

        $stateProvider.state(defaultState);
        $stateProvider.state(combatState);
        $stateProvider.state(fleetState);
        $stateProvider.state(unitState);
        $stateProvider.state(reportState);
}]);