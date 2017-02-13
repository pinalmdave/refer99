'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:ValidateCouponController
 * @description
 * # ValidateCouponController
 */
angular.module('viralDL')
  .controller('ContactUsController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, Campaign,$ionicPopup) {

     // $ionicSideMenuDelegate.canDragContent(true);
    $scope.category = "default";
    $scope.user = Storage.getUser();
    $scope.send_query = function() {
      if ($scope.category == "default") {
        // alert('Please select category!');
        $ionicPopup.alert({
            title: 'refer99',
            template: 'Please select category!'
          });   
        return;
      }
      if (!$scope.description) {
        // alert('Please enter description!');
        $ionicPopup.alert({
            title: 'refer99',
            template: 'Please enter description!'
          });   
        return;
      }
      var data = {
        category: $scope.category,
        description: $scope.description
      };
      if ($scope.user) {
        data.m_id = $scope.user.userId;
      }
      $ionicLoading.show({
        template: 'Loading...'
      });
      User.send_contact_us_query(data, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('user_data', data);
          // alert('We will contact you soon.');
          $ionicPopup.alert({
            title: 'refer99',
            template: 'We will contact you soon.'
          });   
        }
      });

    };

  });