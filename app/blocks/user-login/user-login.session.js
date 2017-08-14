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
        this.retrieve = retrieve;
        this.save = save;

        function create(jwt) {
          this.jwt = jwt;
          // Todo: decode JWT and store claims.
          let parts = jwt.split('.');
          console.log(parts);
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

        function retrieve() {}

        function save() {}
    }
})();
