mobius.auth = {};

mobius.app.factory('mobius.auth.service',["$http","$window","mobius.auth.session",function($http,$window,_session){
  var _service = {};
  _service.login = function(credentials) {
    return $http.post('/rest/auth',credentials).then(function(res){
      _session.create(res);
    });
  };
}]);
