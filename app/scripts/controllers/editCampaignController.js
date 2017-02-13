angular.module('viralDL')
  .controller('EditCampaignController', function($scope, $rootScope, $ionicLoading, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, Campaign, Customer, ionicDatePicker,$ionicHistory) {
    var coupon = this;
    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    $ionicLoading.show({
      template: 'Loading...'
    });
    var campId = $stateParams.camp_id;
    (function init() {
      Campaign.get_campaign(campId, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaign', data);
          $scope.camp_data = data;
        }
      });
    })();

    $scope.openFromDatePicker = function() {
      var dateObj1 = {
        callback: function(val) { //Mandatory
          // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
          $scope.camp_data.start_date = new Date(val);
          $scope.camp_data.end_date = undefined;
        },
        disabledDates: [],
        from: new Date(), //Optional
        to: new Date(2020, 10, 30), //Optional
        inputDate: new Date($scope.camp_data.start_date), //Optional
        mondayFirst: true, //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup' //Optional
      };
      ionicDatePicker.openDatePicker(dateObj1);
    };
    $scope.openToDatePicker = function() {
      var dateObj2 = {
        callback: function(val) { //Mandatory
          // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
          // console.log($scope.camp_data.start_date.getFullYear(), $scope.camp_data.start_date.getMonth(), $scope.camp_data.start_date.getDate());
          if (new Date(val) < $scope.camp_data.start_date) {
            $ionicPopup.alert({
              title: 'Message!',
              template: 'Please Select Date Greater than ' + moment($scope.camp_data.start_date).format('DD-MMMM-YYYY')
            });
          } else {
            $scope.camp_data.end_date = new Date(val);
          }
        },
        disabledDates: [],
        from: $scope.camp_data ? $scope.camp_data.start_date : new Date(), //Optional
        to: new Date(2020, 10, 30), //Optional
        inputDate: $scope.camp_data.end_date ? new Date($scope.camp_data.end_date) : $scope.camp_data.start_date,
        mondayFirst: true, //Optional
        closeOnSelect: true, //Optional
        templateType: 'popup' //Optional
      };
      ionicDatePicker.openDatePicker(dateObj2);
      $scope.isToTouched = true;
    };
    $scope.updateCampaign = function() {
      console.log('data', $scope.camp_data)
      $ionicLoading.show({
        template: 'Loading...'
      });
      Campaign.update_campaign(campId, $scope.camp_data, function(err, data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('campaign', data);
          $scope.camp_data = data;
          $state.go('app.dashboard')
        }
      });
    }
    $scope.destroyCampaign = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: $scope.camp_data.cp_name,
        template: 'Are you sure you want to delete this campaign?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          console.log('You are sure');
          $ionicLoading.show({
            template: 'Loading...'
          });
          Campaign.destroy_campaign(campId, function(err, data) {
            $ionicLoading.hide();
            if (err) {
              console.log('err', err);
            } else {
              console.log('destroy_campaign', data);
              // $scope.camp_data = data;
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $ionicSideMenuDelegate.toggleLeft(false);
              $state.go('app.dashboard')
            }
          });
        } else {
          console.log('You are not sure');
        }
      });
    }

  });