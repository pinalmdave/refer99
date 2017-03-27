(function() {
  'use strict';

  angular
<<<<<<< HEAD
    .module('viralDi')
=======
    .module('viralDL')
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
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
<<<<<<< HEAD
=======
    this.update_customer = function(id, data, next) {
      Restangular
        .one('customers')
        .one(id)
        .customPUT(data)
        .then(function(data) {
          // do on success
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
  }

})();