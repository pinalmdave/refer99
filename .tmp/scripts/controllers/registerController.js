'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:RegisterController
 * @description
 * # RegisterController
 */
angular.module('viralDL')
  .controller('RegisterController', function($scope, $ionicPopup, $ionicModal, User, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $cordovaFacebook) {
    var register = this;
    /*$scope.$on('$ionicView.enter', function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });*/
    $scope.showErrMessages = false;
    $scope.showSignInErrMessages = false;
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
            var loginData = {
              email: signupData.email,
              password: signupData.password
            };
            User.login(loginData, "sys", function(err, res) {
              $ionicLoading.hide();
              if (err) {
                if (err.data && err.data.error && err.data.error.message) {
                  $scope.signupMessage = err.data.error.message;
                } else {
                  $scope.signupMessage = "Please try after some time."
                }
              } else {
                console.log('res', res);
                $ionicHistory.nextViewOptions({
                  disableBack: true,
                  historyRoot: true
                });
                $state.go('app.payment');
              }
            });
          }
        });
      }
    };

    $scope.facebookSignup = function() {
      $cordovaFacebook.login(["public_profile", "email"])
        .then(function(success) {
          console.log('success', success);
          $ionicLoading.show({
            template: 'Loading...'
          });
          $cordovaFacebook.api("me?fields=name,id,email")
            .then(function(success) {
              // success
              console.log('me', success);
              if (success.email && success.name) {
                var signupData = {
                  username: success.name,
                  email: success.email
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
                    var loginData = {
                      email: signupData.email,
                      password: "fb"
                    };
                    User.login(loginData, "fb", function(err, res) {
                      $ionicLoading.hide();
                      if (err) {
                        if (err.data && err.data.error && err.data.error.message) {
                          $scope.signupMessage = err.data.error.message;
                        } else {
                          $scope.signupMessage = "Please try after some time."
                        }
                      } else {
                        console.log('res', res);
                        $ionicHistory.nextViewOptions({
                          disableBack: true,
                          historyRoot: true
                        });
                        $state.go('app.payment');
                      }
                    });
                  }
                });
              } else {
                $ionicLoading.hide();
                // alert("Unable get your email and name please change your facebook privay settings.")
                $ionicPopup.alert({
                  title: 'refer99',
                  template: "Unable get your email and name please change your facebook privay settings."
                });
              }
            }, function(error) {
              // error
              $ionicLoading.hide();
              $scope.res_signup = true;
              $scope.signupMessage = "Please try after some time."
            });
        }, function(error) {
          // error
          $scope.signupMessage = "Please try after some time."
          console.log('error', error);
        });

    };
  });
