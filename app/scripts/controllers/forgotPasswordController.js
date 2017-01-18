'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:HomeController
 * @description
 * # ForgotPasswordController
 */
angular.module('viralDL')
  .controller('ForgotPasswordController', function($scope, $ionicPopup, $ionicModal, User, Storage, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, ionicDatePicker) {
    var forgot = this;
    $scope.user = Storage.getUser();
    $scope.res_forget = false;
    $scope.$on('$ionicView.enter', function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });

    $scope.send_forgot_email = function(forgetEmail) {
      // console.log('email', forgetEmail);
      if (forgetEmail) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        var data = {
          email: forgetEmail
        };
        User.send_forget_password_email(data, function(err, data) {
          $scope.res_forget = true;
          $ionicLoading.hide();
          if (err) {
            console.log('err', err);
            if (err.data && err.data.error && err.data.error.message) {
              $scope.forgetMessage = err.data.error.message;
            } else {
              $scope.forgetMessage = "Please try after some time."
            }
            // alert($scope.forgetMessage);
            $ionicPopup.alert({
              title: 'refer99',
              template: $scope.forgetMessage
            });
          } else {
            console.log('login', data);
            $scope.forgetMessage = data.result.message;
            // alert("Success! Reset password link send to your email address.");
            $ionicPopup.alert({
              title: 'refer99',
              template: "Success! Reset password link send to your email address."
            });
          }
        });
      }
    };
  });