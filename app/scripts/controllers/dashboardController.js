angular.module('viralDi')
  .controller('DashboardController', function($scope, $rootScope, $ionicLoading, $ionicModal, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $window, $interval,Campaign) {
    var userDash = this;
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    (function init() {
      User.get_user_campaigns(function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaigns', data);
        }
      });
    })();

  });
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = this.getDate().toString();
  return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
};