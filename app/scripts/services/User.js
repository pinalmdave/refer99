(function() {
  'use strict';

  angular
    .module('viralDi')
    .service('User', User);

  /** @ngInject */
  function User(Restangular, Storage, Notification) {
    var thisVar = this;
    this.login = function(data, next) {
      Restangular
        .one('members')
        .all('login')
        .post(data)
        .then(function(data) {
          // do on success
          Storage.setUser(data.plain());
          /*Notification.registerDevice(function() {
              thisVar.addDeviceToken(function(err, user) {
                  if (err) {
                      console.log('err #getUser @User.Service.js: ', err);
                  }
              });
              // do nothing
          });*/
          return next(null, data.plain());
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
    
    this.clearToken = function(data, next) {
      Restangular
        .one('venue')
        .one('cleargcm')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
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