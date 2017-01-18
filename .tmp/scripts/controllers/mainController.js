'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:MainController
 * @description
 * # MainController
 * This controller handles the side menu
 */
angular.module('viralDL')
  .controller('MainController', function($scope, $rootScope, Storage, $state, $ionicSideMenuDelegate, User, $ionicLoading, $ionicHistory, $cordovaFacebook) {
    var main = this;
    $scope.user = Storage.getUser();
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
      console.log("Changing state to :");
      console.log(toState);
      $scope.user = Storage.getUser();
    });
    // do something with $scope
    $scope.logout = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
      User.clearToken($scope.user.userId, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('success', data);
          Storage.removeUser();
          // Storage.clearAll();
          $scope.user = undefined;
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.home');
          $ionicSideMenuDelegate.toggleLeft(false);
        }
      });

    };
  });