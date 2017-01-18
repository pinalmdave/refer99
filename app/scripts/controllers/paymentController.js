'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:SettingsController
 * @description
 * # PaymentsController
 */
angular.module('viralDL')
  .controller('PaymentController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, PaypalService, $state,$ionicPopup) {

    $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    (function init() {
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
    })();
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
            template: "Thanks for the payment."
          }).then(function(){
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