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
      console.log(toState, fromState);
      console.log('ionicHistory', $ionicHistory.viewHistory());
      if (!$ionicHistory.viewHistory().backView) {
        $ionicSideMenuDelegate.canDragContent(false);
        $ionicSideMenuDelegate.toggleLeft(false);
      }
      $scope.user = Storage.getUser();
    });
    console.log('ionicHistory', $ionicHistory.viewHistory());
    if (!$ionicHistory.viewHistory().backView) {
      $ionicSideMenuDelegate.canDragContent(false);
      $ionicSideMenuDelegate.toggleLeft(false);
    }
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
            disableBack: true,
            historyRoot: true
          });
          // $ionicHistory.clearCache();
          $state.go('app.start');
          $ionicSideMenuDelegate.toggleLeft(false);
        }
      });

    };
  });
