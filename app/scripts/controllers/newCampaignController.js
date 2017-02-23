angular.module('viralDL')
  .controller('NewCampaignController', function($scope, $rootScope, $ionicLoading, $ionicModal, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $window, $interval, Campaign, $ionicHistory, ionicDatePicker, $ionicScrollDelegate, base) {
    // $ionicSideMenuDelegate.canDragContent(true);
    $scope.user = Storage.getUser();
    // console.log('user',$scope.user);
    $scope.today = new Date();
    $scope.isToTouched = false;
    $scope.base = base;
    $scope.withShare = true;
    $scope.withoutShare = false;
    $scope.withShareAddYes=false;
    $scope.withShareAddNo=false;
    $scope.withDiscountTypePer=false;
    $scope.withDiscountTypeDol=false;
    $scope.$on('$ionicView.enter', function(event, viewData) {
      console.log('ionicView.enter');
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
            // alert('Please provide your business details to start new campaign');
            $ionicPopup.alert({
              title: 'refer99',
              template: "Please provide your business details to start new campaign"
            }).then(function(res) {
              $state.go("app.business_profile");
            });
          } else {
            if ($scope.user_data.last_payment) {
              var monthDiff = moment(moment()).diff(moment($scope.user_data.last_payment), 'months', true);
              // console.log('monthDiff', monthDiff);
              if (monthDiff >= 1) {
                // alert('Your monthly subscribtion is expired.Please make payment.');
                // $state.go('app.payment');
                $ionicPopup.alert({
                  title: 'refer99',
                  template: 'Your monthly subscribtion is expired.Please make payment.'
                }).then(function(res) {
                  // console.log('Thank you for not eating my delicious ice cream cone');
                  $state.go('app.payment');
                });
              }
            } else if (!$scope.user_data.last_payment) {
              // alert('Please make payment to start campaigns.');
              $scope.isPaidUser = false;
              if (!$scope.user_data.origin) {
                if ($scope.user_data.camp_trial) {
                  $scope.is_trail_user = false;
                  $scope.trail_type = "campaigner";
                  $ionicPopup.alert({
                    title: 'refer99',
                    template: 'Your trial period is expired.Please make payment!'
                  }).then(function(res) {
                    // console.log('Thank you for not eating my delicious ice cream cone');
                    $state.go('app.payment');
                  });
                } else {
                  $scope.is_trail_user = true;
                  $scope.trail_type = "campaigner";
                }
              } else if ($scope.user_data.origin == "IN") {
                if ($scope.user_data.camp_trial) {
                  $scope.is_trail_user = false;
                  $scope.trail_type = "campaigner";
                  $ionicPopup.alert({
                    title: 'refer99',
                    template: 'Your trial period is expired.Please make payment!'
                  }).then(function(res) {
                    // console.log('Thank you for not eating my delicious ice cream cone');
                    // $state.go('app.payment');
                  });
                } else {
                  $scope.is_trail_user = true;
                  $scope.trail_type = "campaigner";
                }
              } else {
                var dayDiff = moment(moment()).diff(moment($scope.user_data.created), 'days', true);
                if (dayDiff >= 14) {
                  $scope.is_trail_user = false;
                  $ionicPopup.alert({
                    title: 'refer99',
                    template: 'Your trial period is expired.Please make payment!'
                  }).then(function(res) {
                    // console.log('Thank you for not eating my delicious ice cream cone');
                    $state.go('app.payment');
                  });
                } else {
                  $scope.is_trail_user = true;
                  $scope.trail_type = "weeker";
                }
              }
            }
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
          // $scope.camp_data.cp_offer = "On your purchase of $100 or more(Some exclusions may apply.See store for more detail).";
          $scope.camp_data.cp_terms = "Must present coupon at time of purchase to redeem.Cannot be combined with any other offer, coupon.";
          $scope.dateObj1 = {
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
          $scope.dateObj2 = {
            callback: function(val) { //Mandatory
              // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
              // console.log($scope.camp_data.start_date.getFullYear(), $scope.camp_data.start_date.getMonth(), $scope.camp_data.start_date.getDate());
              if (new Date(val) < $scope.camp_data.start_date) {
                $ionicPopup.alert({
                  title: 'refer99',
                  template: 'Please Select Date Greater than ' + moment($scope.camp_data.start_date).format('DD-MMMM-YYYY')
                }).then(function(res) {
                  console.log('Thank you for not eating my delicious ice cream cone');
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
        }
      });
    });
    // $scope.camp_data.start_date = new Date();

    $scope.openFromDatePicker = function() {
      ionicDatePicker.openDatePicker($scope.dateObj1);
    };
    $scope.openToDatePicker = function() {
      ionicDatePicker.openDatePicker($scope.dateObj2);
      $scope.isToTouched = true;
    };
    $scope.createCampaign = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'refer99',
        template: "Campaign cannot be edited after create, except extend end date only.Please make sure before creating a campaign."
      });

      confirmPopup.then(function(res) {
        if (res) {
          var data = {
            m_id: $scope.user.userId,
            cp_name: $scope.camp_data.cp_name,
            start_date: new Date($scope.camp_data.start_date),
            end_date: new Date($scope.camp_data.end_date),
            // discount_type: $scope.camp_data.discount_type,
            // discount_amount: $scope.camp_data.discount_amount,
            cp_offer: $scope.camp_data.cp_offer,
            cp_terms: $scope.camp_data.cp_terms,
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
              $ionicPopup.alert({
                title: 'refer99',
                template: "Invalid data"
              });
            } else {
              console.log('data', data);
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              /*  $state.go("app.view_coupon", {
                  camp_id: data.id
                });*/
              $ionicHistory.clearCache();
              $state.go("app.dashboard", {}, {
                reload: true
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
        } else {

        }
      });
    };
    $scope.goToNext = function() {
      $scope.cp_screen_first = false;
      $scope.cp_screen_second = true;
      $ionicScrollDelegate.scrollTop(true);
    }
    $scope.goToCoupon = function() {
      $scope.cp_screen_second = false;
      $scope.cp_screen_third = true;
      $ionicScrollDelegate.scrollTop(true);
    }
    $scope.goBack = function() {
      $scope.cp_screen_first = true;
      $scope.cp_screen_second = false;
      $scope.cp_screen_third = false;
      $ionicScrollDelegate.scrollTop(true);
    }
    $scope.getDateFormally = function(date) {
      return moment.utc(date).format('LL');
    };

  });
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = this.getDate().toString();
  return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
};
