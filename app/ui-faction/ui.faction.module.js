BattleEngine2.faction = angular.module("be2.faction",["be2.data"]);

////////////////////////////////////////////////////////////////////////////////////////////////
// FactionService
////////////////////////////////////////////////////////////////////////////////////////////////
BattleEngine2.faction.factory("be2.faction.service",["$log","be2.data.store",function($log,$data)
	var _factionDefaults = {
		"fleets": {},
		"enemies": {},
		"name": "",
		"description": ""
	};

	var _create = function(dict) {
	};

	var _add = function(obj) {};

	var _exists = function(uuid) {};

	var _validate = function(obj) {};

	return {
		add: _add,
		create: _create,
		exists: _exists,
		validate: _validate
	}
}]);