'use strict';

/**
 * @ngdoc function
 * @name viralDi.controller:SettingsController
 * @description
 * # PaymentsController
 */
angular.module('viralDi')
  .controller('PaymentController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, PaypalService) {

    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    $scope.makePayment = function() {
      PaypalService.initPaymentUI().then(function() {

        PaypalService.makePayment(90, "Total Amount").then(function(response) {

          alert("Thanks for payment");

        }, function(error) {

          alert("transaction cancelled");

        });

      });
    }



  });