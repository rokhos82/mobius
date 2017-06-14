mobius.rest = {};

mobius.rest.service = mobius.app.factory('mobius.rest',["$http","$cacheFactory",function($http,$cacheFactory){
  var _svc = {};
  var _cache = $cacheFactory("mobius.rest.service");
  $http.defaults.cache = _cache;

  _svc.getSettings = function() {
    return $http.get("rest/settings.php");
  };

  return _svc;
}]);
