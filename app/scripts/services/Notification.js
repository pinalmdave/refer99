(function() {
    'use strict';

    angular
        .module('viralDi')
        .service('Notification', Notification);

    /** @ngInject */
    function Notification($cordovaDevice, GCM, $cordovaPush, $rootScope, Storage, $state) {

        this.registerDevice = function(next) {
            var devicePlatform = $cordovaDevice.getPlatform();
            console.log('devicePlatform', devicePlatform);
            var deviceConfig = {};

            if (devicePlatform === 'Android') {
                deviceConfig = {
                    senderID: GCM.senderId,
                    icon: "icon"
                };
                $cordovaPush.register(deviceConfig).then(function(result) {
                    console.log('result: ', result);
                }, function(err) {
                    console.log('Registration Error #registerDevice @Notification.js: ' + JSON.stringify(err));
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                    switch (notification.event) {
                        case 'registered':
                            if (notification.regid.length > 0) {
                                console.log('registered', notification);
                                Storage.setDevice(devicePlatform, notification.regid);
                                next();
                            }
                            break;

                        case 'message':
                        console.log('new notification',JSON.stringify(notification));
                            if (!notification.foreground && notification.coldstart) {
                                $rootScope.$broadcast('notification', notification);
                            }
                            break;

                        case 'error':
                            alert('GCM error = ' + notification.msg);
                            break;

                        default:
                            alert('An unknown GCM event has occurred');
                            break;
                    }
                });
            } else if (devicePlatform === 'iOS') {
                deviceConfig = {
                    badge: true,
                    sound: true,
                    alert: true
                };
                $cordovaPush.register(deviceConfig).then(function(deviceToken) {
                    console.log('deviceToken', deviceToken);
                    Storage.setDevice(devicePlatform, deviceToken);
                    next();
                }, function(err) {
                    alert('Registration Error: ' + JSON.stringify(err));
                    console.log('Registration Error: ' + JSON.stringify(err));
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                    if (notification.alert) {
                        if (!notification.foreground && notification.coldstart) {
                            $rootScope.$broadcast('notification', notification);
                        }
                    }

                    if (notification.sound) {
                        var snd = new Media(event.sound);
                        snd.play();
                    }

                    if (notification.badge) {
                        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                            // Success!
                        }, function(err) {
                            // An error occurred. Show a message to the user
                        });
                    }
                });
            }
        };

        this.changeState = function() {
            console.log('in change state');
            var notification = Storage.getNotification();
            console.log('notification', notification);

            /*if (notification && notification.payload) {
              switch (notification.payload.detail.what) {
                case 'CHAT_MESSAGE': $state.go('app.message', {
                  roomId: notification.payload.detail.roomId
                });
                  break;
                case 'FORUM_MESSAGE': $state.go('app.forums', {
                  slug: notification.payload.detail.slug,
                  page: '1'
                });
                  break;
                case 'FRIEND_TOOK_TEST': $state.go('app.profile', {
                  authId: notification.payload.detail.authId
                });
                  break;
                case 'NEW_POST': $state.go('app.forums', {
                  slug: notification.payload.detail.forum_slug,
                  page: '1'
                });
                  break;
                case 'NEW_COMMENT': $state.go('');
                  break;
              }
            }*/
            return Storage.clearNotification();
        };

        this.setAppState = function(state) {
            return Storage.setAppState(state)
        };

        this.getAppState = function() {
            return Storage.getAppState();
        };

    }
})();
