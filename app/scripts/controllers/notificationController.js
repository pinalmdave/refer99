'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:ValidateCouponController
 * @description
 * # ValidateCouponController
 */
angular.module('viralDL')
  .controller('NotificationController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, Campaign, $ionicPopup) {

    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    var limit = 10;
    var skip = 0;
    $scope.canSeeMore = true;
    (function init() {
      $ionicLoading.show({
        template: 'Loading...'
      });
      var query = {
        filter: {
          "where": {
            "m_id": $scope.user.userId
          },
          "order": 'n_time_created DESC',
          "limit": limit,
          "skip": skip
        }
      };
      User.get_user_notifications(query, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('data', data);
          $scope.user_notifications = data;
        }
      });
    })();
    $scope.get_date_diff = function(date) {
      return moment.duration(moment().diff(moment.utc(date))).humanize() + " ago";
    }
    $scope.see_more_results = function() {
      skip = skip + limit;
      var query = {
        filter: {
          "where": {
            "m_id": $scope.user.userId
          },
          "order": 'n_time_created DESC',
          "limit": limit,
          "skip": skip
        }
      };
      console.log(query);
      User.get_user_notifications(query, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          // console.log('data', data);
          if (!_.isEmpty(data)) {
            _.forEach(data, function(elem) {
              $scope.user_notifications.push(elem);
            });
          } else {
            $scope.canSeeMore = false;
          }
        }
      });
    }
    $scope.doRefreshNotifications = function() {
      limit = 10;
      skip = 0;
      var query = {
        filter: {
          "where": {
            "m_id": $scope.user.userId
          },
          "order": 'n_time_created DESC',
          "limit": limit,
          "skip": skip
        }
      };
      User.get_user_notifications(query, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          $scope.user_notifications = data;
          $scope.$broadcast('scroll.refreshComplete');
          // console.log('data', data);
        }
      });
    }
  });