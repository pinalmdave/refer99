'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:MyProfileController
 * @description
 */
angular.module('viralDL')
  .controller('MyProfileController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, Campaign, $ionicPopup) {

    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.$on('$ionicView.enter', function(event, viewData) {
      $scope.user = Storage.getUser();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $scope.isloading = true;
      User.get_user($scope.user.userId, function(err, data) {
        $ionicLoading.hide();
        $scope.isloading = false;
        if (err) {
          console.log('err', err);
        } else {
          console.log('data', data);
          $scope.user_data = data;
          if ($scope.user_data.m_type) {
            $scope.changeState = "app.upgrade";
            $scope.mType = "Change";
          } else {
            $scope.changeState = "app.payment";
            $scope.mType = "Take";
          }
        }
      });
    });

    $scope.getDateFormally = function(date) {
      return moment.utc(date).format('LL');
    };
  });
