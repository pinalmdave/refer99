'use strict';

/**
 * @ngdoc function
 * @name viralDi.controller:HomeController
 * @description
 * # ForgotPasswordController
 */
angular.module('viralDi')
  .controller('ForgotPasswordController', function($scope, $ionicPopup, $ionicModal, User, Storage, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, ionicDatePicker) {
    var forgot = this;
    $scope.user = Storage.getUser();
    $scope.res_forget = false;
    (function init() {})();

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
            }else{
                $scope.forgetMessage="Please try after some time."
            }
          } else {
            console.log('login', data);
            $scope.forgetMessage = data.result.message;
          }
        });
      }
    };
  });