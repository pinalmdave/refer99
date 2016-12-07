angular.module('viralDi')
  .controller('NewCampaignController', function($scope, $rootScope, $ionicLoading, $ionicModal, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $window, $interval, Campaign) {
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    // console.log('user',$scope.user);
    (function init() {
      $scope.camp_data = {};
      $scope.camp_data.bussiness_type = "default";
      $scope.cp_screen_first = true;
      $scope.cp_screen_second = false;
      $scope.camp_data.discount_type = "default";
    })();
    $scope.createCampaign = function() {
      var data = {
        m_id: $scope.user.userId,
        cp_name: $scope.camp_data.cp_name,
        start_date: new Date($scope.camp_data.start_date),
        end_date: new Date($scope.camp_data.end_date),
        bussiness_name: $scope.camp_data.bussiness_name,
        bussiness_type: $scope.camp_data.bussiness_type,
        discount_type: $scope.camp_data.discount_type,
        discount_amount: $scope.camp_data.discount_amount,
        cp_info: $scope.camp_data.cp_info,
        cp_terms: $scope.camp_data.cp_terms,
        cp_email: $scope.camp_data.cp_email
      };
      console.log(data, $scope.camp_data);
      $ionicLoading.show({
        template: 'Loading...'
      });
      Campaign.create_new_campaign(data, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
          alert("Invalid data");
        } else {
          console.log('data', data);
          $state.go('app.dashboard');
        }
      });
    };
  });
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = this.getDate().toString();
  return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
};