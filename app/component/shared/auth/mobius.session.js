mobius.session = {};

mobius.app.service('mobius.auth.session',[function(){
  $service = this;

  $service.create = function(user) {
    this.uuid = user.uuid;
    this.user = user;
    this.level = user.level;
  };

  $service.destroy = function() {
    this.uuid = null;
    this.user = null;
    this.level = null;
  };

  return $service;
}]);
