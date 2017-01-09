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
          if (!data.user.last_payment) {
            data.is_paid_user = false;
          } else if (data.user.last_payment) {
            var monthDiff = moment(moment()).diff(moment(data.user.last_payment), 'months', true);
            if (monthDiff >= 1) {
              data.is_paid_user = false;
            } else {
              data.is_paid_user = true;
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

    this.addDeviceToken = function(next) {
      var user = Storage.getUser();
      console.log('user', user);
      var device = Storage.getDevice();
      console.log('device', device);
      if (!user) {
        return next(null, null);
      } else if (!device || !device.token) {
        return next(null, user);
      } else if (user.deviceToken && user.deviceToken == device.token) {
        return next(null, user);
      }
      var data = {
        id: user.id,
        apn: false,
        authToken: user.authToken,
        regId: device.token
      };
      Restangular
        .one('venue')
        .one('gcmreg')
        .get(data)
        .then(function(data) {
          console.log('gcmreg', data)
          user.deviceToken = device.token;
          Storage.setUser(user);
          return next(null, user);
        }, function(error) {
          return next(error, null);
        });
    };
  }

})();