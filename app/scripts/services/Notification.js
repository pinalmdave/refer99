(function() {
  'use strict';

  angular
    .module('viralDL')
    .service('Notification', Notification);

  /** @ngInject */
  //change gcm to fcm
  function Notification($cordovaDevice, $rootScope, Storage, $state, Restangular) {

    this.registerDevice = function(id, next) {
      /*var devicePlatform = $cordovaDevice.getPlatform();
      console.log('devicePlatform', devicePlatform);
      var deviceConfig = {};
      if (devicePlatform === 'Android') {
        FCMPlugin.getToken(
          function(token) {
            Restangular
              .one('members')
              .one(id)
              .customPUT({
                m_token_firebase: token
              })
              .then(function(data) {
                // do on success
              }, function(error) {
                // do on failure
                console.log('err', error);
              });
          },
          function(err) {
            console.log('error retrieving token: ' + err);
          }
        );
      } else if (devicePlatform === 'iOS') {
        FCMPlugin.getToken(
          function(token) {
            Restangular
              .one('members')
              .one(id)
              .customPUT({
                m_device: token
              })
              .then(function(data) {
                // do on success
              }, function(error) {
                // do on failure
                console.log('err', error);
              });
          },
          function(err) {
            console.log('error retrieving token: ' + err);
          }
        );
      }*/
    };
    

  }
})();