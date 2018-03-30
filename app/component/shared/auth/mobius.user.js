mobius.user = {};

mobius.app.const('USER_LEVELS',{
  'user': 10,
  'gm': 5,
  'admin': 0
});

mobius.app.factory('mobius.auth.user',["$rootScope","$window","$resource","USER_LEVELS",function($rootScope,$window,$resource,USER_LEVELS) {
  var _user = {};
  var _default = {
    level: USER_LEVELS.user
    name: 'dev'
  };

  var _service = {};

  return _service;
}]);
