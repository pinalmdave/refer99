'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:ValidateCouponController
 * @description
 * # ValidateCouponController
 */
angular.module('viralDL')
  .controller('ValidateCouponController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, Campaign, $ionicPopup, $ionicModal) {

    // $ionicSideMenuDelegate.canDragContent(true);
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
        template: '<ion-spinner icon="lines"></ion-spinner> Loading'
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
          $scope.c_data=success.result;
          $scope.openModal();
          console.log('success', success);
        }
      });
    }

    $ionicModal.fromTemplateUrl('cover_details.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  });
