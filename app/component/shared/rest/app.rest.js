mobius.rest = {};

mobius.rest.service = mobius.app.factory('mobius.rest',["$http",function($http){
  var $svc = {};
  $svc.settings = {};
  return function(options) {
    console.log(options);
  };
}]);
