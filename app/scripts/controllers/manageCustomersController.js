'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:ManageCustomersController
 * @description
 * # ManageCustomersController
 */
angular.module('viralDL')
  .controller('ManageCustomersController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, $cordovaContacts, Customer) {

    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    (function init() {
      User.get_user_customers(function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('customers', data);
          $scope.user_cust_data = data.result;
        }
      });
    })();
    $scope.pickContactUsingNativeUI = function() {
      $cordovaContacts.pickContact().then(function(contactPicked) {
        $scope.contact = {};
        if (contactPicked.displayName) {
          $scope.contact.cust_name = contactPicked.displayName;
        }else if (!_.isEmpty(contactPicked.name)) {
          $scope.contact.cust_name = contactPicked.name.formatted;
        }
        if (contactPicked.phoneNumbers && contactPicked.phoneNumbers.length) {
          $scope.contact.cust_contact = contactPicked.phoneNumbers[0].value;
        }
        if (contactPicked.emails && contactPicked.emails.length) {
          $scope.contact.cust_email = contactPicked.emails[0].value;
        }
        $scope.contact.m_id = $scope.user.userId;
        $ionicLoading.show({
          template: 'Loading...'
        });
        Customer.add_customer($scope.contact, function(err, data) {
          $ionicLoading.hide();
          if (err) {
            console.log('err', err);
            if (err.data && err.data.error && err.data.error.message) {
              alert(err.data.error.message);
            } else {
              alert("Please try again later!");
            }
          } else {
            // console.log('customers', data);
            $scope.user_cust_data.customers.push(data);
          }
        });
        // console.log("contactPicked", contactPicked);
      });
    }
    $scope.deleteCustomer = function(index, id) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      var intIndex = $scope.user_cust_data.customers.map(function(el) {
        return el.id;
      }).indexOf(id);
      Customer.remove_customer(id, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          // console.log('customers', data);
          $scope.user_cust_data.customers.splice(intIndex, 1);
        }
      });
    }

  });