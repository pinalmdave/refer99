(function() {
  'use strict';

  angular
    .module('viralDi')
    .service('Storage', Storage);

  /** @ngInject */
  function Storage(localStorageService) {

    this.setUser = function(user) {
      return localStorageService.set('user', user);
    };
    this.setDidTutorial = function() {
      return localStorageService.set('didTutorial', true);
    };
    this.getDidTutorial = function() {
      return localStorageService.get('didTutorial');
    };
    this.getUser = function() {
      return localStorageService.get('user');
    };

    this.removeUser = function() {
      localStorageService.remove('user');
    };
    this.setDevice = function(device, deviceToken) {
      return localStorageService.set('device', {
        platform: device,
        token: deviceToken
      });
    };
    this.getDevice = function() {
      return localStorageService.get('device');
    };
    this.removeDevice = function() {
      return localStorageService.remove('device');
    };
    this.clearAll = function() {
      return localStorageService.clearAll();
    };
    this.setNotification = function(notification) {
      return localStorageService.set('notification', notification);
    };
    this.getNotification = function() {
      return localStorageService.get('notification');
    };
    this.clearNotification = function() {
      return localStorageService.remove('notification');
    };
    this.setAppState = function(state) {
      return localStorageService.set('appState', state);
    };
    this.getAppState = function() {
      return localStorageService.get('appState');
    };
  }

})();