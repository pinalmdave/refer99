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
      User.get_user_payments($scope.user.userId, function(err, data) {
        $ionicLoading.hide();
        $scope.isloading = false;
        if (err) {
          console.log('err', err);
        } else {
          console.log('data', data);
          $scope.user_payments = data.payments;
          if (data.last_payment) {
            $scope.isPaidUser = true;
            $scope.dueDate = moment(data.last_payment).add(1, 'M').format('LL');
          } else if (!data.last_payment) {
            $scope.isPaidUser = false;
          } else {
            $scope.isPaidUser = false;
          }
        }
      });
    });
    $scope.makePayment = function(type, value) {
      if (type == "Free") {
        var data = {
          type: type,
          details: {},
          provider: "system",
          m_id: $scope.user.userId
        };
        $ionicLoading.show({
          template: 'Loading...'
        });
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
            // $scope.dueDate = moment(res.created).add(1, 'M').format('LL');
            $ionicPopup.alert({
              title: 'refer99',
              template: "Thanks for choosing free plan"
            }).then(function() {
              $state.go("app.business_profile");
            });
          }
        });
      } else if (type == "Custom") {
        $state.go("app.contact_us");
      } else {
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
                // $scope.dueDate = moment(res.created).add(1, 'M').format('LL');
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

    };


  });
