(function() {
  'use strict';

  angular
    .module('viralDL')
    .service('User', User);

  /** @ngInject */
  function User(Restangular, Storage, Notification, $rootScope, $cordovaDevice) {
    var thisVar = this;
    this.login = function(data, type, next) {
      Restangular
        .one('members')
        .all('login')
        .post(data, {
          include: 'user'
        })
        .then(function(data) {
          // do on success
          if (type == "fb") {
            data.user_type = "fb";
          } else {
            data.user_type = "sys";
          }
          if (data.user.last_payment) {
            var monthDiff = moment(moment()).diff(moment(data.user.last_payment), 'months', true);
            if (monthDiff >= 1) {
              data.is_paid_user = false;
            } else {
              data.is_paid_user = true;
            }
          } else if (!data.user.last_payment) {
            data.is_paid_user = false;
            if (!data.user.origin) {
              if (data.user.camp_trial) {
                data.is_trail_user = false;
                data.trail_type = "campaigner";
              } else {
                data.is_trail_user = true;
                data.trail_type = "campaigner";
              }
            } else if (data.user.origin == "IN") {
              if (data.user.camp_trial) {
                data.is_trail_user = false;
                data.trail_type = "campaigner";
              } else {
                data.is_trail_user = true;
                data.trail_type = "campaigner";
              }
            } else {
              var dayDiff = moment(moment()).diff(moment(data.user.created), 'days', true);
              if (dayDiff >= 14) {
                data.is_trail_user = false;
              } else {
                data.is_trail_user = true;
                data.trail_type = "weeker";
              }
            }
          } else {
            data.is_paid_user = false;
          }
          Storage.setUser(data.plain());
          Restangular.setDefaultRequestParams({
            access_token: data.id
          });
          Notification.registerDevice(data.userId, function() {
            // do nothing
          });
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.get_user_campaigns = function(next) {
      Restangular
        .one('members')
        .one('get_user_campaigns')
        .get()
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.update_user = function(id, data, next) {
      Restangular
        .one('members')
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
    this.get_user = function(id, next) {
      Restangular
        .one('members')
        .one(id)
        .get()
        .then(function(data) {
          // do on success
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.get_user_payments = function(id, next) {
      Restangular
        .one('members')
        .one(id)
        .get({
          filter: {
            "include": 'payments'
          }
        })
        .then(function(data) {
          // do on success
          return next(null, data.plain());
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.get_user_customers = function(next) {
      Restangular
        .one('members')
        .one('get_user_customers')
        .get()
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.change_password = function(data, next) {
      Restangular
        .one('members')
        .all('change_password')
        .post(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.create_payment = function(data, next) {
      Restangular
        .all('payments')
        .post(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.send_forget_password_email = function(data, next) {
      Restangular
        .one('members')
        .one('send_reset_password_link')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.send_contact_us_query = function(data, next) {
      Restangular
        .all('faqs')
        .post(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.registerUser = function(data, next) {
      Restangular
        .one('members')
        .one('sign_universal')
        .get(data)
        .then(function(data) {
          // do on success
          if (data) {
            // Storage.setUser(data.object);
            /*Notification.registerDevice(function() {
              thisVar.addDeviceToken(function(err, user) {
                if (err) {
                  console.log('err #getUser @User.Service.js: ', err);
                }
              });
              // do nothing
            });*/
            return next(null, data);
          } else {
            return next(data, null);
          }
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };

    this.clearToken = function(id, next) {
      var data = {};
      var devicePlatform = $cordovaDevice.getPlatform();
      if (devicePlatform === 'Android') {
        data.m_token_firebase = "";
      } else if (devicePlatform === 'iOS') {
        data.m_device = "";
      } else {
        return next(null, {});
        Restangular.setDefaultRequestParams({
          access_token: ""
        });
      }
      Restangular
        .one('members')
        .one(id)
        .customPUT(data)
        .then(function(data) {
          // do on success
          return next(null, data.plain());
          Restangular.setDefaultRequestParams({
            access_token: ""
          });
        }, function(error) {
          // do on failure
          return next(error, null);
        });

    };

    this.get_user_notifications = function(queryFilter, next) {
      Restangular
        .one('notifications')
        .get(queryFilter)
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
