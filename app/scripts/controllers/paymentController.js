'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:SettingsController
 * @description
 * # PaymentsController
 */
angular.module('viralDL')
  .controller('PaymentController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, PaypalService, $state, $ionicPopup) {

    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    $scope.$on('$ionicView.enter', function(event, viewData) {
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
          if (!data.last_payment) {
            $scope.isPaidUser = false;
            if (!data.origin) {
              $scope.is_trail_user = true;
              $scope.trail_type = "campaigner";
            } else if (data.origin == "IN") {
              if (data.camp_trial) {
                $scope.is_trail_user = false;
                $scope.trail_type = "campaigner";
              } else {
                $scope.is_trail_user = true;
                $scope.trail_type = "campaigner";
              }
            } else {
              var dayDiff = moment(moment()).diff(moment(data.created), 'days', true);
              if (dayDiff >= 14) {
                $scope.is_trail_user = false;
              } else {
                $scope.is_trail_user = true;
                $scope.trail_type = "weeker";
              }
            }
          } else if (data.last_payment) {
            var monthDiff = moment(moment()).diff(moment(data.last_payment), 'months', true);
            // console.log('monthDiff', monthDiff);
            if (monthDiff >= 1) {
              $scope.isPaidUser = false;
              // alert('Your monthly subscribtion is expired.Please make payment.');
            } else {
              $scope.isPaidUser = true;
              $scope.dueDate = moment(data.last_payment).add(1, 'M').format('LL');
              console.log('dueDate', $scope.dueDate);
            }
          } else {
            $scope.isPaidUser = false;
          }
        }
      });
    });
    $scope.makePayment = function(type, value) {
      PaypalService.initPaymentUI().then(function() {

        PaypalService.makePayment(value, type).then(function(response) {
          console.log('response', response);
          $ionicLoading.show({
            template: 'Loading...'
          });
          var data = {
            type: type,
            details: response,
            provider: "paypal",
            m_id: $scope.user.userId
          };
          User.create_payment(data, function(err, res) {
            $ionicLoading.hide();
            if (err) {
              console.log('err', err);
            } else {
              console.log('res', res);
              $scope.isPaidUser = true;
              $scope.user.is_paid_user = true;
              $scope.user.user.last_payment = res.created;
              Storage.setUser($scope.user);
              $scope.dueDate = moment(res.created).add(1, 'M').format('LL');
              $ionicPopup.alert({
                title: 'refer99',
                template: "Payment Processed Successfully"
              }).then(function() {
                $state.go("app.business_profile");
              });
            }
          });

        }, function(error) {

          $ionicPopup.alert({
            title: 'refer99',
            template: "Transaction cancelled"
          });

        });

      });
    }



  });
