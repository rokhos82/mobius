mobius.session = {};

mobius.app.service('mobius.auth.session',[function(){
  $service = this;
  
  $service.create = function(sessionId,userId,userLevel) {
    this.session = sessionId;
    this.user = userId;
    this.level = userRole;
  };

  $service.destroy = function() {
    this.session = null;
    this.user = null;
    this.level = null;
  };

  return $service;
}]);
