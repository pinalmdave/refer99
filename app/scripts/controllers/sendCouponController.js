angular.module('viralDL')
  .controller('SendCouponController', function($scope, $rootScope, $ionicLoading, $interpolate, $sce, $templateRequest, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, Campaign, Customer, $cordovaSocialSharing, $cordovaActionSheet, $ionicModal, business_logo,$cordovaFacebook) {
    var coupon = this;
    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    var campId = $stateParams.camp_id;
    $scope.contact = {};
    $scope.cust_contacts = [];
    $scope.cust_emails = [];
    $scope.showEmailErr = false;
    $scope.showContactErr = false;
    var templateUrl = $sce.getTrustedResourceUrl('email_template.html');
    (function init() {
      User.get_user_customers(function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaigns', data);
          $scope.user_camp_data = data.result;
          if ($scope.user_camp_data.business_logo) {
            $scope.business_logo = business_logo + $scope.user_camp_data.business_logo;
          } else {
            $scope.business_logo = business_logo + "fb_share.png";
          }
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
      var whatsappBody = "Exclusive offer from " + $scope.user_camp_data.business_name.toUpperCase() + ": " + $scope.selectedCamp.cp_offer.toUpperCase();
      var smsBody = "Hello,Exclusive offer from " + $scope.user_camp_data.business_name.toUpperCase() + ": " + $scope.selectedCamp.cp_offer.toUpperCase() + ". Check this link to get the coupon. http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
      if (shareType == "whatsapp") {
        var message = "Shared Coupon";
        var link = "http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        $cordovaSocialSharing
          .shareViaWhatsApp(whatsappBody, $scope.business_logo, link)
          .then(function(result) {
            // alert("Coupon has been distributed to selected customer(s)");
            $ionicPopup.alert({
              title: 'refer99',
              template: "Coupon has been distributed to selected customer(s)"
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
        var message = "Hello,Thanks for being our loyal customer.We have an exciting offer for you, " + $scope.selectedCamp.cp_offer + ".Click the link to get the offer. http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        $cordovaSocialSharing
          .shareViaSMS(smsBody, $scope.cust_contacts.toString())
          .then(function(result) {
            $ionicPopup.alert({
              title: 'refer99',
              template: "Coupon has been distributed to selected customer(s)"
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
        var message = "http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        var subject = "Exclusive offer from " + $scope.user_camp_data.business_name + ", " + $scope.selectedCamp.cp_offer;
        $templateRequest(templateUrl).then(function(template) {
          var emailBody = $interpolate(template)($scope);
          $cordovaSocialSharing
            .shareViaEmail(emailBody, subject, $scope.cust_emails, [], [], null)
            .then(function(result) {
              $ionicPopup.alert({
                title: 'refer99',
                template: "Coupon has been distributed to selected customer(s)"
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
        }, function() {
          $ionicPopup.alert({
            title: 'refer99',
            template: "Please try after some time"
          });
          // An error has occurred here
        });

      } else if (shareType == "fb") {
        var message = "Exclusive offer from " + $scope.user_camp_data.business_name + ", " + $scope.selectedCamp.cp_offer;
        var link = "http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        /* $cordovaSocialSharing
           .shareViaFacebook(message, null, link)
           .then(function(result) {
             // Success!
             $ionicPopup.alert({
               title: 'refer99',
               template: "Coupon has been distributed to selected customer(s)"
             });
           }, function(err) {
             // An error occurred. Show a message to the user
             console.log('err', err);
             $ionicPopup.alert({
               title: 'refer99',
               template: "Please install facebook app or try after some time"
             });
           });*/
        var options = {
          method: "share",
          href: link,
          caption: message,
          name:$scope.user_camp_data.business_name,
          description:message,
          picture:$scope.business_logo
        };
        $cordovaFacebook.showDialog(options)
          .then(function(success) {
            // success
            $ionicPopup.alert({
                title: 'refer99',
                template: "Coupon has been distributed to selected customer(s)"
              });
            console.log(success);
          }, function(error) {
            // error
            console.log(error);
            $ionicPopup.alert({
               title: 'refer99',
               template: "Please try after some time"
             });
          });
      } else if (shareType == "twitter") {
        var message = "Exclusive offer from " + $scope.user_camp_data.business_name + ", " + $scope.selectedCamp.cp_offer;
        var link = "http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
        $cordovaSocialSharing
          .shareViaTwitter(message, $scope.business_logo, link)
          .then(function(result) {
            // Success!
            $ionicPopup.alert({
              title: 'refer99',
              template: "Campaign may shared on twitter"
            });
          }, function(err) {
            // An error occurred. Show a message to the user
            console.log('err', err);
            $ionicPopup.alert({
              title: 'refer99',
              template: "Please install twitter app or try after some time"
            });
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
          var message = "http://refer99.com/admin/app/#/" + $scope.selectedCamp.id + "/coupon_share";
          $cordovaSocialSharing
            .shareViaSMS(message, $scope.contact.cust_contact)
            .then(function(result) {
              // Success!
              $ionicPopup.alert({
                title: 'refer99',
                template: "Coupon has been distributed to selected customer(s)"
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

    $scope.send_message = function(user_contact) {
      console.log(user_contact);
      var message = "http://refer99.com/admin/app/#/" + $scope.selectedCamp.id + "/coupon_share";
      $cordovaSocialSharing
        .shareViaSMS(message, user_contact)
        .then(function(result) {
          // Success!
          $ionicPopup.alert({
            title: 'refer99',
            template: "Coupon has been distributed to selected customer(s)"
          });
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
    $scope.send_email = function(user_name, user_email) {
      console.log(user_name, user_email);
      var message = "http://refer99.com/admin/#/app/" + $scope.selectedCamp.id + "/coupon_share";
      var subject = "Exclusive offer from " + $scope.user_camp_data.business_name + ", " + $scope.selectedCamp.cp_offer;
      $cordovaSocialSharing
        .shareViaEmail(message, subject, user_email, [], [], null)
        .then(function(result) {
          $ionicPopup.alert({
            title: 'refer99',
            template: "Coupon has been distributed to selected customer(s)"
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


    $ionicModal.fromTemplateUrl('cover_coupon.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });


  });
