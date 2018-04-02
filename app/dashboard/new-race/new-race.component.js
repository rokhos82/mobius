(function() {
  'use strict';

  angular
    .module('app.dashboard.new-race')
    .component('newRace', newRace());

  /* @ngInject */
  function newRace() {
    var component = {
        templateUrl: 'new-race.html',
        controller: newRaceController,
    };

    return component;
  }

  newRaceController.$inject = [];

  /* @ngInject */
  function newRaceController() {
  }
})();
