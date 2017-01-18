'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:ValidateCouponController
 * @description
 * # ValidateCouponController
 */
angular.module('viralDL')
  .controller('ValidateCouponController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, Campaign,$ionicPopup) {

    $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    console.log('user', $scope.user);
    $scope.validate_coupon = function(c_code) {
      if (!c_code) {
        $ionicPopup.alert({
            title: 'refer99',
            template: "Please enter coupon code"
          });
        $scope.couponMessage = "Please enter coupon code!";
        return;
      }
      $ionicLoading.show({
        template: 'Loading...'
      });
      var data = {
        c_code: c_code
      };
      Campaign.validate_coupon(data, function(err, success) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
          if (err.data && err.data.error && err.data.error.message) {
            $scope.couponMessage = err.data.error.message;
          } else {
            $scope.couponMessage = "Please try after some time."
          }
        } else {
          $scope.couponMessage = "Success! Coupon redeemed";
          // $scope.c_code = "";
          console.log('success', success);
        }
      });
    }


  });