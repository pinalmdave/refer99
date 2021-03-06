angular.module('viralDL')
  .controller('DashboardController', function($scope, $rootScope, $ionicLoading, $ionicModal, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $window, $interval, Campaign, $cordovaActionSheet, ionicDatePicker) {
    var userDash = this;
    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.$on('$ionicView.enter', function(event, viewData) {
      $scope.user = Storage.getUser();
      $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner> Loading'
      });
      $scope.dateToExtend = new Date();
      User.get_user_campaigns(function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          $scope.ngClock = true;
          $scope.user_camp_data = data.result;
          if ($scope.user_camp_data.last_payment) {
            $scope.disable_camp = false;
            $scope.isPaidUser = true;
          } else if (!$scope.user_camp_data.last_payment) {
            // alert('Please make payment to start campaigns.');
            $scope.isPaidUser = false;
            $state.go('app.payment');
          }
          $scope.user_camp_data.campaigns.forEach(function(item, i) {
            $scope.user_camp_data.campaigns[i].coupons_activated = _.filter(item.coupons, function(o) {
              return o.status == "activated";
            });
            $scope.user_camp_data.campaigns[i].coupons_redeemed = _.filter(item.coupons, function(o) {
              return o.status == "redeemed";
            });
          });
          console.log('campaigns', $scope.user_camp_data);
        }
      });
    });

    var updateCampaign = function(id, data, index) {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner> Loading'
      });
      Campaign.update_campaign(id, data, function(err, res) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('res', res);
          $scope.user_camp_data.campaigns[index].end_date = data.end_date;
        }
      });
    }

    $scope.openDatePicker = function(date, index, id) {
      // console.log('date', new Date(), new Date(date));
      $scope.dateToExtend = new Date(date);
      var dateObj = {
        callback: function(val) { //Mandatory
          console.log('Return value from the datepicker popup is : ' + val, new Date(val), new Date(moment(val).utc()));
          var dataObj = {
            end_date: new Date(val)
          };
          updateCampaign(id, dataObj, index);
        },
        disabledDates: [],
        from: new Date(date), //Optional
        to: new Date(2020, 10, 30), //Optional
        inputDate: $scope.dateToExtend, //Optional
        mondayFirst: true, //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup' //Optional
      };
      ionicDatePicker.openDatePicker(dateObj);
    };
    $scope.getDateFormally = function(date) {
      return moment(date).format('LL');
    };
    $scope.getCampStatus = function(date) {
      var daysDiff = moment(moment(date)).diff(moment(), 'days', true);
      if (daysDiff >= 0) {
        return "Active";
      } else {
        return "Expired";
      }
    };
    $scope.goToSendCoupons = function() {
      $state.go("app.send_coupons", {
        camp_id: $scope.user_camp_data.campaigns[0].id
      });
    };
    $scope.viewCoupon = function(campId) {
      $state.go("app.view_coupon", {
        camp_id: campId
      });
    };
    $scope.findCoupons = function(coupons, type) {
      console.log(coupons, type);
      return _.find(coupons, {
        status: type
      });
    };

    var showCampActionsCallback = function(buttonIndex) {
      console.log('buttonIndex', buttonIndex);
    };


    $scope.showCampActions = function(objIndex, id) {
      var options = {
        'title': 'What do you want with this offer?',
        'buttonLabels': ['Distribute Coupon', 'Extend End Date', 'View Offer'],
        'androidEnableCancelButton': true, // default false
        'addCancelButtonWithLabel': 'Cancel'
      };
      $cordovaActionSheet.show(options)
        .then(function(btnIndex) {
          var index = btnIndex;
          if (index == 1) {
            $state.go('app.send_coupons', {
              camp_id: id
            });
          } else if (index == 2) {
            var intIndex = $scope.user_camp_data.campaigns.map(function(el) {
              return el.id;
            }).indexOf(id);
            $scope.openDatePicker($scope.user_camp_data.campaigns[intIndex].end_date, intIndex, id);
          } else if (index == 3) {
            $state.go("app.view_coupon", {
              camp_id: id
            });
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
