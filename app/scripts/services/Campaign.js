(function() {
  'use strict';

  angular
    .module('viralDL')
    .service('Campaign', Campaign);

  /** @ngInject */
  function Campaign(Restangular, Storage, Notification) {
    var thisVar = this;
    this.create_new_campaign = function(data, next) {
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
    this.get_campaign = function(campId, next) {
      var options = {
        filter: {
          "include": "members"
        }
      };
      Restangular
        .one('campaigns')
        .one(campId)
        .get(options)
        .then(function(data) {
          // do on success
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.update_campaign = function(id, data, next) {
      Restangular
        .one('campaigns')
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
    this.destroy_campaign = function(id, next) {
      Restangular
        .one('campaigns')
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
    this.validate_coupon = function(data, next) {
      Restangular
        .one('coupons')
        .one('validate_coupon')
        .get(data)
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
