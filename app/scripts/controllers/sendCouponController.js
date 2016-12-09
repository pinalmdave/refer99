angular.module('viralDi')
  .controller('SendCouponController', function($scope, $rootScope, $ionicLoading, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, Campaign, Customer,$cordovaSocialSharing) {
    var coupon = this;
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    var campId = $stateParams.camp_id;
    $scope.contact = {};
    (function init() {
      User.get_user_campaigns(function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaigns', data);
          $scope.user_camp_data = data.result;
          $scope.selectedCamp = data.result.campaigns[0];
        }
      });
    })();

    $scope.shareCoupon = function(shareType) {
      /* if (shareType == "whatsapp") {
       } else if (shareType == "sms") {
       } else if (shareType == "email") {
       }*/
      // this is the complete list of currently supported params you can pass to the plugin (all optional)

    }
    $scope.addCustomerSendCoupon = function() {
      Customer.add_customer($scope.contact, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          // console.log('customers', data);
        }
      });
    }

  });