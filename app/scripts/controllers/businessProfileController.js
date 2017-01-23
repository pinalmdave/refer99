'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:BusinessProfileController
 * @description
 * # BusinessProfileController
 */
angular.module('viralDL')
  .controller('BusinessProfileController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, PaypalService, api, $cordovaImagePicker, $cordovaFileTransfer, $ionicPopup, $state, $ionicScrollDelegate) {

    $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    console.log('user', $scope.user);
    if ($scope.user.user_type == "fb") {
      $scope.is_fb_user = true;
    }
    $scope.is_disabled = true;
    (function init() {
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
          $scope.user_data.business_type = $scope.user_data.business_type ? $scope.user_data.business_type : "default";
          $scope.user_data.state = $scope.user_data.state ? $scope.user_data.state : "default";
        }
      });
    })();
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
                      $state.go("app.dashboard");
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
              $state.go("app.dashboard");
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


  });