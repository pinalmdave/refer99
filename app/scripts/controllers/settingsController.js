'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:SettingsController
 * @description
 * # SettingsController
 */
angular.module('viralDL')
  .controller('SettingsController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, PaypalService,$ionicPopup) {

    $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    console.log('user', $scope.user);
    if ($scope.user.user_type == "fb") {
      $scope.is_fb_user = true;
    }
    $scope.change_pass = {
      isErr: false,
      message: ""
    };
    $scope.s3OptionsUri = {};
    $scope.change_password = function(old_pass, new_pass, confirm_pass) {
      // console.log(old_pass, new_pass, confirm_pass);
      if (!old_pass) {
        $scope.change_pass = {
          isErr: true,
          message: "Please enter old password"
        };
      } else if (!new_pass) {
        $scope.change_pass = {
          isErr: true,
          message: "Please enter new password"
        };
      } else if (!confirm_pass) {
        $scope.change_pass = {
          isErr: true,
          message: "Please confirm your password"
        };
      } else if (new_pass !== confirm_pass) {
        $scope.change_pass = {
          isErr: true,
          message: "Passwords not matched!"
        };
      } else {
        $ionicLoading.show({
          template: 'Loading...'
        });
        var data = {
          old_password: old_pass,
          new_password: new_pass
        };
        User.change_password(data, function(err, data) {
          $ionicLoading.hide();
          if (err) {
            if (err.data && err.data.error && err.data.error.message) {
              $scope.change_pass = {
                isErr: true,
                message: err.data.error.message
              };
            } else {
              $scope.change_pass = {
                isErr: true,
                message: "Please try after some time."
              };
            }
          } else {
            $scope.change_pass = {
              isErr: false,
              message: ""
            };
            console.log('data', data);
            $ionicPopup.alert({
            title: 'refer99',
            template: "Password changed successfully"
          });
          }
        });
      }
    };


  });