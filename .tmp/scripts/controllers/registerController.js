'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:RegisterController
 * @description
 * # RegisterController
 */
angular.module('viralDL')
  .controller('RegisterController', function($scope, $ionicPopup, $ionicModal, User, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $cordovaFacebook, $cordovaGeolocation) {
    var register = this;
    /*$scope.$on('$ionicView.enter', function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });*/
    $scope.showErrMessages = false;
    $scope.showSignInErrMessages = false;
    $scope.$on('$ionicView.enter', function(event, viewData) {
      geoLocate();
    });

    function geoLocate() {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $scope.country_data;
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log('latlng', lat, long);
          var geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(lat, long);
          geocoder.geocode({
            latLng: latlng
          }, function(responses) {
            if (responses && responses.length > 0) {
              // fn(responses[0].formatted_address);
              // console.log('responses[0]', responses[0]);
              var itemsProcessed = 0;
              // console.log(_.isEmpty($scope.country_data));
              responses[0].address_components.forEach(function(item, i, array) {
                if (!_.isEmpty(item.types)) {
                  item.types.forEach(function(i_item, j) {
                    if (i_item == "country") {
                      $scope.country_data = item;
                    }
                  });
                }
                itemsProcessed++;
                if (itemsProcessed === array.length) {
                  // console.log(_.isEmpty($scope.country_data));
                  if (_.isEmpty($scope.country_data)) {
                    $scope.country_data = {};
                    $scope.country_data.short_name = "N/A";
                  }
                  console.log('$scope.country_data', $scope.country_data);
                }
              });
            } else {
              $scope.country_data = {};
              $scope.country_data.short_name = "N/A";
              // alert('Error while trying to find the location');
            }
          });
        }, function(err) {
          // error
          $scope.country_data = {};
          $scope.country_data.short_name = "N/A";
          console.log('err', err);
        });
    };
    $scope.register_user = function(username, userEmail, password) {
      console.log('register', userEmail, password);
      if (username && userEmail && password) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        var signupData = {
          username: username,
          email: userEmail,
          password: password,
          origin:$scope.country_data.short_name
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
                  email: success.email,
                  origin:$scope.country_data.short_name
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
