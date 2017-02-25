////////////////////////////////////////////////////////////////////////////////////////////////
// BattleEngine2 Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////
var mobiusEngine = {};

////////////////////////////////////////////////////////////////////////////////////////////////
// BattleEngine2 angular module
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app = angular.module('mobiusEngine',['ui.bootstrap','ui.router']);

mobiusEngine.app.config(['$compileProvider','$stateProvider',
    function ($compileProvider,$stateProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob|data):/);

        var defaultState = {
        	name: 'main',
        	url: '/',
        	template: '<main-welcome></main-welcome>'
        };

        var combatState = {
        	name: 'combat',
        	url: '/combat',
        	template: '<combat-engine></combat-engine>'
        };

        var fleetState = {
        	name: 'fleet',
        	url: '/fleet',
        	template: '<fleet-main></fleet-main>'
        };

        var unitState = {
        	name: 'unit',
        	url: '/unit',
        	template: '<unit-main></unit-main>'
        };

        var reportState = {
        	name: 'reports',
        	url: '/reports',
        	template: '<reports-main></reports-main>'
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