'use strict';

/**
 * @ngdoc function
 * @name viralDi.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('viralDi')
  .controller('HomeController', function($scope, $ionicPopup, $ionicModal, User, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $cordovaFacebook) {
    var home = this;
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.login = function(userEmail, password) {
      console.log('login', userEmail, password);
      $scope.invalidUserPass = false;
      if (userEmail && password) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        var data = {
          email: userEmail,
          password: password
        };
        User.login(data, function(err, data) {
          $ionicLoading.hide();
          if (err) {
            console.log('err', err);
            $scope.invalidUserPass = true;
          } else {
            console.log('login', data);
            $scope.invalidUserPass = false;
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.dashboard');
          }
        });
      }
    };
    $scope.facebookLogin = function() {
      $cordovaFacebook.login(["public_profile", "email"])
        .then(function(success) {
          console.log('success', success);

          $cordovaFacebook.api("me?fields=name,id,email")
            .then(function(success) {
              // success
              console.log('me', success);
            }, function(error) {
              // error
            });
        }, function(error) {
          // error
          console.log('error', error);
        });

    };
  });