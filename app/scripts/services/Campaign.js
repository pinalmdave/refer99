(function() {
  'use strict';

  angular
    .module('viralDi')
    .service('Campaign', Campaign);

  /** @ngInject */
  function Campaign(Restangular, Storage, Notification) {
    var thisVar = this;

  }

})();