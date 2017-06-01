////////////////////////////////////////////////////////////////////////////////////////////////
// BattleEngine2 Global Namespace Variable
////////////////////////////////////////////////////////////////////////////////////////////////
var mobiusEngine = {};
var mobius = {};

////////////////////////////////////////////////////////////////////////////////////////////////
// BattleEngine2 angular module
////////////////////////////////////////////////////////////////////////////////////////////////
mobiusEngine.app = angular.module('mobiusEngine',['ui.bootstrap','ui.router','ngSanitize']);
mobius.app = mobiusEngine.app;

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

        var fleetDtlState = {
            name: 'fleetDtl',
            url: '/fleet/{fleetID}',
            component: 'fleetDetail',
            resolve: {
                uuid: ["$transition$",function($transition$) {
                    return $transition$.params().fleetID;
                }]
            }
        };

        var unitState = {
        	name: 'unit',
        	url: '/unit',
        	component: 'unitMain'
        };

        var unitImport = {
            name: 'unitImport',
            url: '/unit/import/{import}',
            component: 'unitImport',
            resolve: {
                import: ["$transition$",function($transition$) {
                    return $transition$.params().import;
                }]
            }
        };

        var unitDetail = {
            name: 'unitDtl',
            url: '/unit/{uuid}',
            component: 'unitDetail',
            resolve: {
                uuid: ["$transition$",function($transition$) {
                    return $transition$.params().uuid;
                }]
            }
        };

        var reportState = {
        	name: 'reports',
        	url: '/reports',
        	component: 'reportsMain',
        };

        var reportDtlState = {
            name: 'report',
            url: '/reports/{reportID}',
            component: 'reportsDetail',
            resolve: {
                uuid: ["mobius.data.simulation","$transition$",function(_data,$transition$) {
                    return $transition$.params().reportID;
                }]
            }
        };

        var simulator = {
            name: 'simulator',
            url: '/simulator',
            component: 'simulatorMain',
            resolve: {}
        };

        $stateProvider.state(defaultState);
        $stateProvider.state(combatState);
        $stateProvider.state(fleetState);
        $stateProvider.state(fleetDtlState);
        $stateProvider.state(unitState);
        $stateProvider.state(unitImport);
        $stateProvider.state(unitDetail);
        $stateProvider.state(reportState);
        $stateProvider.state(reportDtlState);
        $stateProvider.state(simulator);
}]);
