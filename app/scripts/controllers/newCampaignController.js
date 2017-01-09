angular.module('viralDL')
  .controller('NewCampaignController', function($scope, $rootScope, $ionicLoading, $ionicModal, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $window, $interval, Campaign, $ionicHistory, ionicDatePicker, $ionicScrollDelegate) {
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.user = Storage.getUser();
    // console.log('user',$scope.user);
    $scope.today = new Date();
    $scope.isToTouched = false;
    (function init() {
      $scope.camp_data = {};
      $ionicLoading.show({
        template: 'Loading...'
      });
      User.get_user($scope.user.userId, function(err, user_data) {
        $ionicLoading.hide();
        if (err) {
          console.log('err', err);
        } else {
          console.log('user_data', user_data);
          $scope.user_data = user_data;
          if (!user_data.work_through) {
            alert('Please provide your business details to start new campaign');
            $state.go("app.business_profile");
          }
          $scope.camp_data.business_type = user_data.business_type ? user_data.business_type : "default";
          $scope.camp_data.business_name = user_data.business_name;
          $scope.camp_data.contact = user_data.contact;
          $scope.camp_data.contact_person = user_data.contact_person;
          $scope.camp_data.business_address = user_data.business_address;
          $scope.camp_data.business_address_opt = user_data.business_address_opt;
          $scope.camp_data.city = user_data.city;
          $scope.camp_data.state = user_data.state ? user_data.state : "default";
          $scope.camp_data.zip_code = user_data.zip_code;
          $scope.camp_data.start_date = new Date();
          // $scope.camp_data.business_type = "default";
          $scope.cp_screen_first = true;
          $scope.cp_screen_second = false;
          // $scope.camp_data.discount_type = "price";
          $scope.camp_data.redeemable_at = user_data.work_through;
          $scope.camp_data.web_address = user_data.web_address;
          $scope.camp_data.buy_value = 1;
          $scope.camp_data.get_value = 1;
          $scope.camp_data.cp_additional_text = "On your purchase of $100 or more(Some exclusions may apply.See store for more detail).";
          $scope.camp_data.cp_disclaimer = "Must present coupon at time of purchase to redeem.Cannot be combined with any other offer, coupon.";
        }
      });
    })();
    $scope.camp_data.start_date = new Date();
    var dateObj1 = {
      callback: function(val) { //Mandatory
        // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.camp_data.start_date = new Date(val);
        $scope.camp_data.end_date = undefined;
      },
      disabledDates: [],
      from: new Date(), //Optional
      to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: true, //Optional
      templateType: 'popup' //Optional
    };
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
      from: $scope.camp_data.start_date, //Optional
      to: new Date(2020, 10, 30), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: true, //Optional
      templateType: 'popup' //Optional
    };

    $scope.openFromDatePicker = function() {
      ionicDatePicker.openDatePicker(dateObj1);
    };
    $scope.openToDatePicker = function() {
      ionicDatePicker.openDatePicker(dateObj2);
      $scope.isToTouched = true;
    };
    $scope.createCampaign = function() {
      var data = {
        m_id: $scope.user.userId,
        cp_name: $scope.camp_data.cp_name,
        start_date: new Date($scope.camp_data.start_date),
        end_date: new Date($scope.camp_data.end_date),
        discount_type: $scope.camp_data.discount_type,
        discount_amount: $scope.camp_data.discount_amount,
        cp_additional_text: $scope.camp_data.cp_additional_text,
        cp_disclaimer: $scope.camp_data.cp_disclaimer,
        // cp_email: $scope.camp_data.cp_email,
        business_name: $scope.camp_data.business_name,
        business_type: $scope.camp_data.business_type,
        business_address: $scope.camp_data.business_address,
        contact: $scope.camp_data.contact,
        contact_person: $scope.camp_data.contact_person,
        city: $scope.camp_data.city,
        buy_value: $scope.camp_data.buy_value,
        get_value: $scope.camp_data.get_value,
        redeemable_at: $scope.camp_data.redeemable_at,
        web_address: $scope.camp_data.web_address,
        // max_coupons: $scope.camp_data.max_coupons,
        state: $scope.camp_data.state,
        zip_code: $scope.camp_data.zip_code
      };
      console.log(data, $scope.camp_data);
      $ionicLoading.show({
        template: 'Loading...'
      });
      Campaign.create_new_campaign(data, function(err, data) {
        if (err) {
          $ionicLoading.hide();
          console.log('err', err);
          alert("Invalid data");
        } else {
          console.log('data', data);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go("app.view_coupon", {
            camp_id: data.id
          });
          /* if ($scope.is_first_camp) {
             var update = {
               business_name: $scope.user_data.business_name ? $scope.user_data.business_name : $scope.camp_data.business_name,
               business_type: $scope.user_data.business_type ? $scope.user_data.business_type : $scope.camp_data.business_type,
               business_address: $scope.user_data.business_address ? $scope.user_data.business_address : $scope.camp_data.business_address,
               business_address_opt: $scope.user_data.business_address_opt ? $scope.user_data.business_address_opt : $scope.camp_data.business_address_opt,
               contact: $scope.user_data.contact ? $scope.user_data.contact : $scope.camp_data.contact,
               contact_person: $scope.user_data.contact_person ? $scope.user_data.contact_person : $scope.camp_data.contact_person,
               city: $scope.user_data.city ? $scope.user_data.city : $scope.camp_data.city,
               state: $scope.user_data.state ? $scope.user_data.state : $scope.camp_data.state,
               zip_code: $scope.user_data.zip_code ? $scope.user_data.zip_code : $scope.camp_data.zip_code
             };
             User.update_user($scope.user.userId, update, function(err, res) {
               $ionicLoading.hide();
               if (err) {
                 console.log('err', err);
               }
               $ionicHistory.nextViewOptions({
                 disableBack: true
               });
               $state.go("app.view_coupon", {
                 camp_id: data.id
               });
             });
           } else {
             $ionicLoading.hide();
             $ionicHistory.nextViewOptions({
               disableBack: true
             });
             $state.go("app.view_coupon", {
               camp_id: data.id
             });
           }*/
        }
      });
    };
    $scope.goToNext = function() {
      $scope.cp_screen_first = false;
      $scope.cp_screen_second = true;
      $ionicScrollDelegate.scrollTop();
    }
    $scope.goBack = function() {
      $scope.cp_screen_first = true;
      $scope.cp_screen_second = false;
      $ionicScrollDelegate.scrollTop();
    }
  });
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = this.getDate().toString();
  return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
};