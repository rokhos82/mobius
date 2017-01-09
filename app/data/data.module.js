BattleEngine2.data = angular.module("be2.data",[]);

////////////////////////////////////////////////////////////////////////////////////////////////
// be2.data - this is the main data store for the entire application
////////////////////////////////////////////////////////////////////////////////////////////////
BattleEngine2.data.factory("be2.data.store",[function(){
	var _data = {
		state: {
			factions: {
				list: []
			},
			fleets: {
				list: []
			},
			units: {
				list: []
			},
			templates: {
				list: []
			},
			entities: {
				list: []
			}
		},
		ui: {
			faction: {},
			fleet: {},
			unit: {},
			template: {},
			entity: {},
			main: {},
			debug: true
		},
		combat: {}
	};

	return _data;
}]);