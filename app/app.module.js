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

        $stateProvider.state(defaultState);
        $stateProvider.state(combatState);
}]);