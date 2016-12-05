angular.module('viralDi')
  .controller('NewCampaignController', function($scope, $rootScope, $ionicLoading, $ionicModal, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $window, $interval, Campaign) {
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    (function init() {
      $scope.bussiness_type = "default";
      $scope.cp_screen_first = true;
      $scope.cp_screen_second = false;
      $scope.discount_type = "default";
    })();

  });
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = this.getDate().toString();
  return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
};