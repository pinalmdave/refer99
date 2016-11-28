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
    this.bookings = function(data, next) {
      Restangular
        .one('venue')
        .one('bookings')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.confirmBooking = function(data, next) {
      Restangular
        .one('venue')
        .one('confirm')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.declineBooking = function(data, next) {
      Restangular
        .one('venue')
        .one('decline')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.closeBooking = function(data, next) {
      Restangular
        .one('venue')
        .one('close')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.openBooking = function(data, next) {
      Restangular
        .one('venue')
        .one('open')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
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
    this.pendingRatings = function(data, next) {
      Restangular
        .one('venue')
        .one('pendingRatings')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.rateCustomer = function(data, next) {
      var params = "id=" + data.id + "&ticketId=" + data.ticketId + "&userId=" + data.userId + "&ratings=" + data.overAllRating + "&ratings=" + data.tippingBehave + "&ratings=" + data.genralBehave + "&authToken=" + data.authToken;
      console.log('params', data, params);
      Restangular
        .one('venue')
        .one('rateCustomer?' + params)
        .get()
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.defaultInvoices = function(data, next) {
      Restangular
        .one('billing')
        .one('defaultInvoices')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.getInvoiceData = function(data, next) {
      Restangular
        .one('billing')
        .one('invoices')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.defaultCleared = function(data, next) {
      Restangular
        .one('billing')
        .one('defaultCleared')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.getClearedData = function(data, next) {
      Restangular
        .one('billing')
        .one('cleared')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.raiseQuery = function(data, next) {
      Restangular
        .one('billing')
        .one('raiseQuery')
        .get(data)
        .then(function(data) {
          // do on success
          return next(null, data);
        }, function(error) {
          // do on failure
          return next(error, null);
        });
    };
    this.discount = function(data, next) {
      Restangular
        .one('venue')
        .one('discount')
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
        .one('newuser')
        .one('register?' + data)
        .get()
        .then(function(data) {
          // do on success
          if (data.success) {
            Storage.setUser(data.object);
            Notification.registerDevice(function() {
              thisVar.addDeviceToken(function(err, user) {
                if (err) {
                  console.log('err #getUser @User.Service.js: ', err);
                }
              });
              // do nothing
            });
            return next(null, data);
          } else {
            return next(data, null);
          }
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