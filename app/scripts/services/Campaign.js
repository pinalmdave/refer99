(function() {
  'use strict';

  angular
    .module('viralDi')
    .service('Campaign', Campaign);

  /** @ngInject */
  function Campaign(Restangular, Storage, Notification) {
    var thisVar = this;
    this.create_new_campaign = function(data,next) {
      Restangular
        .all('campaigns')
        .post(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
  }

})();