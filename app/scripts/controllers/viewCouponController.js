angular.module('viralDL')
  .controller('ViewCouponController', function($scope, $rootScope, $ionicLoading, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, Campaign, Customer, $cordovaSocialSharing, $cordovaActionSheet) {
    var coupon = this;
    $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    var campId = $stateParams.camp_id;
    (function init() {
      Campaign.get_campaign(campId, function(err, success) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaign', success);
          $scope.camp_data = success;
        }
      });
    })();
    $scope.getDateFormally = function(date) {
      return moment.utc(date).format('LL');
    };
  });