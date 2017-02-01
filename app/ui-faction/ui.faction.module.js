BattleEngine2.faction = angular.module("mobius.faction",["mobius.data"]);

////////////////////////////////////////////////////////////////////////////////////////////////
// FactionService
////////////////////////////////////////////////////////////////////////////////////////////////
BattleEngine2.faction.factory("mobius.faction.service",["$log","mobius.data.store",function($log,$data)
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