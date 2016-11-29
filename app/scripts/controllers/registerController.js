'use strict';

/**
 * @ngdoc function
 * @name viralDi.controller:RegisterController
 * @description
 * # RegisterController
 */
angular.module('viralDi')
  .controller('RegisterController', function($scope, $ionicPopup, $ionicModal, User, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate) {
    var register = this;
    $scope.register_user = function(username, userEmail, password) {
      console.log('register', userEmail, password);
      if (username && userEmail && password) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        var signupData = {
          username: username,
          email: userEmail,
          password: password
        };
        User.registerUser(signupData, function(err, data) {
          $scope.res_signup = true;
          if (err) {
            $ionicLoading.hide();
            console.log('err', err);
            if (err.data && err.data.error && err.data.error.message) {
              $scope.signupMessage = err.data.error.message;
            } else {
              $scope.signupMessage = "Please try after some time."
            }
          } else {
            // console.log('register', data);
            $scope.signupMessage = "Success."
            var loginData={
                email:signupData.email,
                password:signupData.password
            };
            User.login(loginData, function(err, res) {
              $ionicLoading.hide();
              if (err) {
                if (err.data && err.data.error && err.data.error.message) {
                  $scope.signupMessage = err.data.error.message;
                } else {
                  $scope.signupMessage = "Please try after some time."
                }
              } else {
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                $state.go('app.dashboard');
              }
            });
          }
        });
      }
    };
  });