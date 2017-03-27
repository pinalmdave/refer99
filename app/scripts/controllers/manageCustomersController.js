'use strict';

/**
 * @ngdoc function
<<<<<<< HEAD
 * @name viralDi.controller:ManageCustomersController
 * @description
 * # ManageCustomersController
 */
angular.module('viralDi')
  .controller('ManageCustomersController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, $cordovaContacts, Customer) {

    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
=======
 * @name viralDL.controller:ManageCustomersController
 * @description
 * # ManageCustomersController
 */
angular.module('viralDL')
  .controller('ManageCustomersController', function($scope, User, $ionicSideMenuDelegate, $ionicLoading, Storage, $cordovaContacts, Customer, $ionicPopup) {

    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner> Loading'
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
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
<<<<<<< HEAD
=======
        } else if (!_.isEmpty(contactPicked.name)) {
          $scope.contact.cust_name = contactPicked.name.formatted;
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
        }
        if (contactPicked.phoneNumbers && contactPicked.phoneNumbers.length) {
          $scope.contact.cust_contact = contactPicked.phoneNumbers[0].value;
        }
        if (contactPicked.emails && contactPicked.emails.length) {
          $scope.contact.cust_email = contactPicked.emails[0].value;
        }
        $scope.contact.m_id = $scope.user.userId;
        $ionicLoading.show({
<<<<<<< HEAD
          template: 'Loading...'
=======
          template: '<ion-spinner icon="lines"></ion-spinner> Loading'
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
        });
        Customer.add_customer($scope.contact, function(err, data) {
          $ionicLoading.hide();
          if (err) {
            console.log('err', err);
<<<<<<< HEAD
=======
            if (err.data && err.data.error && err.data.error.message) {
              // alert(err.data.error.message);
              $ionicPopup.alert({
                title: 'refer99',
                template: err.data.error.message
              });
            } else {
              // alert("Please try again later!");
              $ionicPopup.alert({
                title: 'refer99',
                template: "Please try again letter."
              });
            }
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
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
<<<<<<< HEAD
        template: 'Loading...'
      });
=======
        template: '<ion-spinner icon="lines"></ion-spinner> Loading'
      });
      var intIndex = $scope.user_cust_data.customers.map(function(el) {
        return el.id;
      }).indexOf(id);
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e
      Customer.remove_customer(id, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          // console.log('customers', data);
<<<<<<< HEAD
          $scope.user_cust_data.customers.splice(index, 1);
        }
      });
    }
=======
          $scope.user_cust_data.customers.splice(intIndex, 1);
        }
      });
    }
    $scope.updateCustomer = function(id) {
      var intIndex = $scope.user_cust_data.customers.map(function(el) {
        return el.id;
      }).indexOf(id);
      $scope.custData = {};
      $scope.custData.cust_name = $scope.user_cust_data.customers[intIndex].cust_name;
      $scope.custData.cust_contact = $scope.user_cust_data.customers[intIndex].cust_contact;
      $scope.custData.cust_email = $scope.user_cust_data.customers[intIndex].cust_email;
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="custData.cust_name" placeholder="Name"></br><input type="text" ng-model="custData.cust_contact" placeholder="Contact Number"></br><input type="email" ng-model="custData.cust_email" placeholder="Email">',
        title: 'Edit Customer',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            console.log($scope.custData);
            if (!$scope.custData.cust_name) {
              $ionicPopup.alert({
                title: 'refer99',
                template: "Invalid customer name."
              });
              return;
            }
            if (!$scope.custData.cust_contact) {
              $ionicPopup.alert({
                title: 'refer99',
                template: "Invalid contact number."
              });
              return;
            }
            $ionicLoading.show({
              template: '<ion-spinner icon="lines"></ion-spinner> Loading'
            });
            Customer.update_customer(id, $scope.custData, function(err, data) {
              $ionicLoading.hide();
              if (err) {
                console.log('err', err);
              } else {
                console.log('update_data', data);
                $scope.user_cust_data.customers[intIndex].cust_name = $scope.custData.cust_name;
                $scope.user_cust_data.customers[intIndex].cust_contact = $scope.custData.cust_contact;
                $scope.user_cust_data.customers[intIndex].cust_email = $scope.custData.cust_email;
              }
            });
          }
        }]
      });

    }
>>>>>>> 5c0dd0ed570e776f4b1337d6a0376e403a27e37e

  });