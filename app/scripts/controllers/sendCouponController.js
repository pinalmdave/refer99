angular.module('viralDL')
  .controller('SendCouponController', function($scope, $rootScope, $ionicLoading, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, Campaign, Customer, $cordovaSocialSharing, $cordovaActionSheet) {
    var coupon = this;
    $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    var campId = $stateParams.camp_id;
    $scope.contact = {};
    $scope.cust_contacts = [];
    $scope.cust_emails = [];
    (function init() {
      User.get_user_customers(function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaigns', data);
          $scope.user_camp_data = data.result;
          data.result.campaigns.forEach(function(elem) {
            if (campId == elem.id) {
              $scope.selectedCamp = elem;
            }
          });
          data.result.customers.forEach(function(elem) {
            if (elem.cust_contact && elem.cust_contact != null) {
              $scope.cust_contacts.push(elem.cust_contact);
            }
            if (elem.cust_email) {
              $scope.cust_emails.push(elem.cust_email);
            }
          });
        }
      });
    })();
    $scope.showShareActions = function() {
      var options = {
        'title': 'How do you want to share coupons?',
        'buttonLabels': ['Whatsapp', 'Text Message', 'Email'],
        'androidEnableCancelButton': true, // default false
        'addCancelButtonWithLabel': 'Cancel'
      };
      $cordovaActionSheet.show(options)
        .then(function(btnIndex) {
          var index = btnIndex;
          if (index == 1) {
            $scope.shareCoupon("whatsapp");
          } else if (index == 2) {
            $scope.shareCoupon("sms");
          } else if (index == 3) {
            $scope.shareCoupon("email");
          }

        });
    }
    $scope.shareCoupon = function(shareType) {
      if (shareType == "whatsapp") {
        var message = "Shared Coupon";
        var link = "http://viraldl.tk/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        $cordovaSocialSharing
          .shareViaWhatsApp(message, null, link)
          .then(function(result) {
            // alert("Thanks for sharing");
            $ionicPopup.alert({
              title: 'refer99',
              template: "Thanks for sharing"
            });
            // Success!
            console.log('result', result);
          }, function(err) {
            // alert("Please install whatsapp to share coupon link!");
            $ionicPopup.alert({
              title: 'refer99',
              template: "Please install whatsapp to share coupon link!"
            });
            // An error occurred. Show a message to the user
            console.log('err', err);
          });
      } else if (shareType == "sms") {
        var message = "http://viraldl.tk/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        $cordovaSocialSharing
          .shareViaSMS(message, $scope.cust_contacts)
          .then(function(result) {
            $ionicPopup.alert({
              title: 'refer99',
              template: "Thanks for sharing"
            });
            // Success!
            console.log('result', result);
          }, function(err) {
            $ionicPopup.alert({
              title: 'refer99',
              template: "Please try after some time"
            });
            // An error occurred. Show a message to the user
            console.log('err', err);
          });

      } else if (shareType == "email") {
        var message = "http://viraldl.tk/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        var subject = "refer99 coupon shared";
        $cordovaSocialSharing
          .shareViaEmail(message, subject, $scope.cust_emails, [], [], null)
          .then(function(result) {
            $ionicPopup.alert({
              title: 'refer99',
              template: "Thanks for sharing"
            });
            // Success!
            console.log('result', result);
          }, function(err) {
            $ionicPopup.alert({
              title: 'refer99',
              template: "Please try after some time"
            });
            // An error occurred. Show a message to the user
            console.log('err', err);
          });
      }
      // this is the complete list of currently supported params you can pass to the plugin (all optional)

    }
    $scope.addCustomerSendCoupon = function() {
      console.log('customer', $scope.contact);
      $ionicLoading.show({
        template: 'Loading...'
      });
      $scope.contact.m_id = $scope.user.userId;
      Customer.add_customer($scope.contact, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
          if (err.data && err.data.error && err.data.error.message) {
            $ionicPopup.alert({
              title: 'refer99',
              template: err.data.error.message
            });
          } else {
            $ionicPopup.alert({
              title: 'refer99',
              template: "Please try after some time"
            });
          }
        } else {
          // console.log('customers', data);
          var message = "http://viraldl.tk/admin/app/#/" + $scope.selectedCamp.id + "/coupon_share";
          $cordovaSocialSharing
            .shareViaSMS(message, $scope.contact.cust_contact)
            .then(function(result) {
              // Success!
              $ionicPopup.alert({
                title: 'refer99',
                template: "Thanks for sharing"
              });
              console.log('result', result);
              $scope.contact = {};
            }, function(err) {
              $scope.contact = {};
              $ionicPopup.alert({
                title: 'refer99',
                template: "Please try after some time"
              });
              // An error occurred. Show a message to the user
              console.log('err', err);
            });

        }
      });
    }

  });