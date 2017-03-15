'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:BusinessProfileController
 * @description
 * # BusinessProfileController
 */
angular.module('viralDL')
  .controller('BusinessProfileController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, PaypalService, api, $cordovaImagePicker, $cordovaFileTransfer, $ionicPopup, $state, $ionicScrollDelegate, $ionicHistory, base, $cordovaToast) {

    //    $ionicSideMenuDelegate.canDragContent(true);
    $scope.$on('$ionicView.enter', function(event, viewData) {
      // $ionicHistory.clearHistory();
      $scope.base = base;
      $scope.user = Storage.getUser();
      console.log('user', $scope.user);
      if ($scope.user.user_type == "fb") {
        $scope.is_fb_user = true;
      }
      $scope.is_disabled = true;
      $ionicLoading.show({
        template: 'Loading...'
      });
      User.get_user($scope.user.userId, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('user_data', data);
          $scope.user_data = data;
          if ($scope.user_data.business_name) {
            $scope.is_disabled = true;
            $scope.isNewUser = false;
          } else {
            $scope.is_disabled = false;
            $scope.isNewUser = true;
          }
          $scope.user_data.business_type = $scope.user_data.business_type ? $scope.user_data.business_type : "default";
          $scope.user_data.state = $scope.user_data.state ? $scope.user_data.state : "default";
          $scope.user_data.work_through = $scope.user_data.work_through ? $scope.user_data.work_through : "location";
        }
      });
    });
    $scope.update_user = function() {
      var data = {
        business_name: $scope.user_data.business_name,
        business_type: $scope.user_data.business_type,
        contact: $scope.user_data.contact,
        contact_person: $scope.user_data.contact_person,
        web_address: $scope.user_data.web_address,
        work_through: $scope.user_data.work_through,
        business_address: $scope.user_data.business_address,
        business_address_opt: $scope.user_data.business_address_opt,
        city: $scope.user_data.city,
        state: $scope.user_data.state,
        zip_code: $scope.user_data.zip_code
      };
      $ionicLoading.show({
        template: 'Loading...'
      });
      User.update_user($scope.user.userId, data, function(err, res) {
        if (err) {
          $ionicLoading.hide();
          console.log('err', err);
        } else {
          console.log('res', res);
          if ($scope.imageFile) {
            var trustHosts = true;
            var options = {};
            $cordovaFileTransfer.upload(api + '/Containers/business_logo/upload', $scope.imageFile, options, trustHosts)
              .then(function(resp) {
                // Success!
                resp.response = JSON.parse(resp.response);
                User.update_user($scope.user.userId, {
                  business_logo: resp.response.result.files.file[0].name
                }, function(err, res) {
                  $ionicLoading.hide();
                  if (err) {
                    console.log('err', err);
                  } else {
                    // alert('Your Business Information is saved successfully');
                    $ionicPopup.alert({
                      title: 'refer99',
                      template: 'Your Business Information is saved successfully'
                    }).then(function() {
                      $scope.is_disabled = true;
                      $scope.isNewUser = false;
                      $scope.user = Storage.getUser();
                      if (!$scope.user.user.last_payment) {
                        $state.go("app.payment");
                      } else if ($scope.user.user.last_payment) {
                        var monthDiff = moment(moment()).diff(moment($scope.user.user.last_payment), 'months', true);
                        // console.log('monthDiff', monthDiff);
                        if (monthDiff >= 1) {
                          $state.go("app.payment");
                          // alert('Your monthly subscribtion is expired.Please make payment.');
                        } else {
                          $state.go("app.dashboard");
                        }
                      } else {
                        $state.go("app.payment");
                      }

                    });
                  }
                });
                // console.log('resp', resp);
              }, function(err) {
                console.log('err', err);
                // Error
                $ionicLoading.hide();
              }, function(progress) {
                // constant progress updates
                // console.log('progress', progress);
              });
          } else {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'refer99',
              template: 'Your Business Information is saved successfully'
            }).then(function() {
              $scope.is_disabled = true;
              $scope.isNewUser = false;
              $scope.user = Storage.getUser();
              if (!$scope.user.user.last_payment) {
                $state.go("app.payment");
              } else if ($scope.user.user.last_payment) {
                var monthDiff = moment(moment()).diff(moment($scope.user.user.last_payment), 'months', true);
                console.log('monthDiff', monthDiff);
                if (monthDiff >= 1) {
                  $state.go("app.payment");
                  // alert('Your monthly subscribtion is expired.Please make payment.');
                } else {
                  $state.go("app.dashboard");
                }
              } else {
                $state.go("app.payment");
              }

            });
          }
        }
      });
    }
    $scope.onFileSelect = function() {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options)
        .then(function(results) {
          if (results && results[0]) {
            $scope.imageFile = results[0];
          }
        }, function(error) {
          // error getting photos
          console.log('error', error);
        });
    }
    $scope.changeIsDisabled = function() {
      $scope.is_disabled = !$scope.is_disabled;
      if ($scope.is_disabled == true) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        User.get_user($scope.user.userId, function(err, data) {
          $ionicLoading.hide();
          if (err) {
            console.log('err', err);
          } else {
            console.log('user_data', data);
            $ionicScrollDelegate.scrollTop(true);
            $scope.user_data = data;
            $scope.user_data.business_type = $scope.user_data.business_type ? $scope.user_data.business_type : "default";
            $scope.user_data.state = $scope.user_data.state ? $scope.user_data.state : "default";
          }
        });
      }
    }
    $scope.showToast = function(data) {
      $cordovaToast.showLongBottom(data).then(function(success) {
        // success
      }, function(error) {
        // error
      });
    };


  });
