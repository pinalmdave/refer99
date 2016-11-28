'use strict';

/**
 * @ngdoc function
 * @name viralDi.controller:RegisterController
 * @description
 * # RegisterController
 */
angular.module('viralDi')
    .controller('RegisterController', function($scope, $ionicPopup, $ionicModal, User, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate) {
        var register = this;
        $scope.userContacts = [];
        $scope.detailsView = true;
        $scope.managerView = false;
        $scope.ownerView = false;
        $scope.managerDetails = [];
        var detailsString = "";
        var managerString = "";
        var ownerString = "";
        $scope.addContact = function(contact) {
            console.log('addContact', contact)
            $scope.isDuplicate = false;
            if (contact) {
                if (contact < 999999999) {
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: "Invalid Phone number."
                    });
                    return;
                }
                if ($scope.userContacts.length == 0) {
                    $scope.userContacts.push(contact);
                } else {
                    $scope.userContacts.forEach(function(elem, i) {
                        if (elem == contact) {
                            $ionicPopup.alert({
                                title: 'Alert!',
                                template: "Please add unique contact."
                            });
                            $scope.isDuplicate = true;
                        }
                        if ((i == ($scope.userContacts.length - 1)) && !$scope.isDuplicate) {
                            $scope.userContacts.push(contact);
                        }
                    });
                }
            }
        };
        /* $scope.addManager = function(name, title, email, phone) {
             if (!name || !title || !email || !phone) {
                 $ionicPopup.alert({
                     title: 'Alert!',
                     template: "*Please fill all required fields."
                 });
             } else {
                 $scope.managerDetails.push({
                     name: name,
                     title: title,
                     email: email,
                     phone: phone
                 });

             }
         };*/
        /* $scope.removeManager = function(index) {
             $scope.managerDetails.splice(index, 1);
         };*/
        $scope.removeContact = function(index) {
            $scope.userContacts.splice(index, 1);
        };
        $scope.getDetails = function(name, email, phone) {
            detailsString = ""
            console.log('getDetails', name, email, phone)
            if (($scope.userContacts.length == 0) && !phone) {
                $ionicPopup.alert({
                    title: 'Alert!',
                    template: "Please add atleast 1 Phone number."
                });
            } else if (($scope.userContacts.length == 0) && (phone < 999999999)) {
                $ionicPopup.alert({
                    title: 'Alert!',
                    template: "Invalid phone number."
                });
            } else if (($scope.userContacts.length == 0) && (phone > 999999999)) {
                detailsString = "bName=" + name;
                detailsString += "&bEmail=" + email;
                detailsString += "&bPhNumber=" + phone;
                $scope.detailsView = false;
                $scope.managerView = true;
                $scope.ownerView = false;
            } else {
                detailsString = "bName=" + name;
                detailsString += "&bEmail=" + email;
                $scope.userContacts.forEach(function(elem, i) {
                    detailsString += "&bPhNumber=" + elem;
                });
                $scope.detailsView = false;
                $scope.managerView = true;
                $scope.ownerView = false;
            }
        };
        $scope.getManager = function(managerName, managerTitle, managerPhone, managerEmail) {
            managerString = "&mName=" + managerName;
            managerString += "&mEmail=" + managerEmail;
            managerString += "&mTitle=" + managerTitle;
            managerString += "&mPhNumber" + managerPhone;
            $scope.detailsView = false;
            $scope.managerView = false;
            $scope.ownerView = true;
            /* console.log('getManager', $scope.managerDetails);
             if ($scope.managerDetails.length == 0) {
                 $ionicPopup.alert({
                     title: 'Alert!',
                     template: "Please enter atleast 1 manager details."
                 });
             } else {
                 $scope.detailsView = false;
                 $scope.managerView = false;
                 $scope.ownerView = true;
             }*/
        };
        $scope.backDetails = function() {
            $scope.detailsView = true;
            $scope.managerView = false;
            $scope.ownerView = false;
        };
        $scope.backManager = function() {
            $scope.detailsView = false;
            $scope.managerView = true;
            $scope.ownerView = false;
        };
        $scope.getOwner = function(name, email, phone) {
            console.log('getOwner', name, email, phone)
            ownerString = "&oName=" + name;
            ownerString += "&oEmail=" + email;
            ownerString += "&oPhNumber=" + phone;
            var data = detailsString + managerString + ownerString;
            console.log('data', data);
            $ionicLoading.show({
                template: 'Loading...'
            });
            User.registerUser(data, function(err, data) {
                $ionicLoading.hide();
                if (err) {
                    console.log('err', err);
                    $ionicPopup.alert({
                        title: 'Sorry!',
                        template: err.displayMsg
                    });
                } else {
                    console.log('data', data);
                    if (data && data.displayMsg) {
                        $ionicPopup.alert({
                            title: 'Congratulations!',
                            template: data.displayMsg
                        });
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.dashboard');
                    }
                }
            });
        };
        $scope.getTerms = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            startApp.set({ /* params */
                "action": "ACTION_VIEW",
                "uri": "http://viralDiapp.in/VendorTerms&Conditions.html"
            }).start(function() { /* success */
                // console  .log("OK");
                $ionicLoading.hide();
            }, function(error) { /* fail */
                // alert(error);
                $ionicLoading.hide();
            });
        }
    });
