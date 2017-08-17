(function() {
    'use strict';

    angular
        .module('block.user-login')
        .service('block.user-login.session', sessionService);

    sessionService.$inject = ['$window'];

    /* @ngInject */
    function sessionService($window) {
        this.create = create;
        this.destroy = destroy;
        this.getExpiration = getExpiration;
        this.getLevel = getLevel;
        this.hasState = hasState;
        this.retrieve = retrieve;
        this.save = save;

        function create(jwt) {
          this.jwt = jwt;
          // Todo: decode JWT and store claims.
          let parts = jwt.split('.');
          let header = parts[0];
          let claims = parts[1];
          let signature = parts[2];

          this.claims = $window.angular.fromJson($window.atob(claims));

          return this;
        }

        function destroy() {
          this.jwt = null;
          this.claims = null;
          return this;
        }

        function getExpiration() {
          return this.claims.expiration;
        }

        function getLevel() {
          // Return the user access level or 1000 (which should be higher than anything used).
          // The 1000 should block access to most things that are controlled by user level.
          if(!isNaN(this.claims.level)) {
            return this.claims.level;
          }
          else {
            return 1000;
          }
        }

        function hasState(state) {
          // Determine if the user has access to a given state.
          let exist = false;
          this.claims.states.forEach(function(stt) {
            exist = (stt === state);
          });
          return exist;
        }

        function retrieve() {}

        function save() {}
    }
})();
