(function() {
  'use strict';

  angular
    .module('viralDL')
    .service('Customer', Customer);

  /** @ngInject */
  function Customer(Restangular, Storage, Notification) {
    var thisVar = this;
    this.add_customer = function(data,next) {
      Restangular
        .all('customers')
        .post(data)
        .then(function(data) {
          // do on success
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.remove_customer = function(id,next) {
      Restangular
        .one('customers')
        .one(id)
        .remove()
        .then(function(data) {
          // do on success
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
  }

})();