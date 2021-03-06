'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('viralDL')
    .controller('ClearedPaymentController', function($scope, $ionicPopup, $ionicModal, User, Storage, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, ionicDatePicker) {
        var cleared = this;
        $scope.user = Storage.getUser();
        // $scope.fromDate=new Date();
        (function init() {
            var data = {
                id: $scope.user.id,
                authToken: $scope.user.authToken
            };
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner> Loading'
            });
            User.defaultCleared(data, function(err, data) {
                $ionicLoading.hide();
                if (err) {
                    console.log('err', err);
                    // alert(" Error in Login :" + err.data.message)
                } else {
                    console.log('success', data);
                    $scope.clearedData = data.object;
                    $scope.totalAmount();
                    if (data && data.displayMsg) {
                        $ionicPopup.alert({
                            title: 'Message!',
                            template: data.displayMsg
                        });
                    }
                }
            });
            setTimeout(function() {
                console.log('Howdy', window.innerHeight);
                document.getElementById('content').style.height = (window.innerHeight - 155).toString()+'px'; 
            }, 2000);

        })();
        var dateObj1 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                $scope.fromDate = new Date(val);
                $scope.toDate = undefined;
            },
            disabledDates: [],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2018, 10, 30), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };
        var dateObj2 = {
            callback: function(val) { //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                console.log($scope.fromDate.getFullYear(), $scope.fromDate.getMonth(), $scope.fromDate.getDate());
                if (new Date(val) < $scope.fromDate) {
                    $ionicPopup.alert({
                        title: 'Message!',
                        template: 'Please Select Date Greater than ' + moment($scope.fromDate).format('DD-MMMM-YYYY')
                    });
                } else {
                    $scope.toDate = new Date(val);
                    $scope.getClearedData();
                }
            },
            disabledDates: [],
            from: $scope.fromDate, //Optional
            to: new Date(2018, 10, 30), //Optional
            mondayFirst: true, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openFromDatePicker = function() {
            ionicDatePicker.openDatePicker(dateObj1);
        };
        $scope.openToDatePicker = function() {
            ionicDatePicker.openDatePicker(dateObj2);
        };
        $scope.getDayDate = function(date) {
            return moment(date).format('dddd') + ',' + moment(date).format('MMMM DD');
        };
        $scope.getClearedData = function() {
            var data = {
                id: $scope.user.id,
                authToken: $scope.user.authToken,
                fromDate: moment($scope.fromDate).format('YYYY/MM/DD'),
                toDate: moment($scope.toDate).format('YYYY/MM/DD')
            };
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner> Loading'
            });
            User.getClearedData(data, function(err, data) {
                $ionicLoading.hide();
                if (err) {
                    console.log('err', err);
                    // alert(" Error in Login :" + err.data.message)
                } else {
                    console.log('success', data);
                    $scope.clearedData = data.object;
                    $scope.totalAmount();
                    if (data && data.displayMsg) {
                        $ionicPopup.alert({
                            title: 'Message!',
                            template: data.displayMsg
                        });
                    }
                }
            });
        };
        $scope.totalAmount = function() {
            $scope.totalPaid = 0;
            if ($scope.clearedData) {
                $scope.clearedData.forEach(function(elem) {
                    $scope.totalPaid += elem.totalAmount;
                });
            }
        };
    });
