'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('viralDL')
  .controller('HomeController', function($scope, $ionicPopup, $ionicModal, User, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $cordovaFacebook, Storage) {
    var home = this;
    $ionicSideMenuDelegate.canDragContent(false)
    var user = Storage.getUser();
    (function init() {
      if (user) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.dashboard');
      }
    })();
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
        User.login(data, "sys", function(err, data) {
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
            if (!data.user.last_payment) {
              $state.go('app.payment');
            } else if (data.user.last_payment) {
              var monthDiff = moment(moment()).diff(moment(data.user.last_payment), 'months', true);
              // console.log('monthDiff', monthDiff);
              if (monthDiff >= 1) {
                alert('Your monthly subscribtion is expired.Please make payment.');
                $state.go('app.payment');
              } else {
                $state.go('app.dashboard');
              }
            } else {
              $state.go('app.dashboard');
            }
          }
        });
      }
    };
    $scope.facebookLogin = function() {
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
              var loginData = {
                email: success.email,
                password: "fb"
              };
              User.login(loginData, "fb", function(err, res) {
                $ionicLoading.hide();
                if (err) {
                  console.log('err', err);
                  $scope.invalidUserPass = true;
                } else {
                  console.log('login', res);
                  $scope.invalidUserPass = false;
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.go('app.dashboard');
                }
              });
            }, function(error) {
              // error
              $ionicLoading.hide();
              console.log('error', error);
              alert("Please try again letter.")
            });
        }, function(error) {
          // error
          console.log('error', error);
          alert("Please try again letter.")
        });

    };
  });