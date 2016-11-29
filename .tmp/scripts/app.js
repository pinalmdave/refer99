'use strict';

/**
 * @ngdoc overview
 * @name viralDi
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */

angular.module('viralDi', ['ionic', 'ngCordova', 'ngResource', 'ngSanitize', 'restangular', 'LocalStorageModule','ionic-datepicker','ionic.rating'])

.run(function($ionicPlatform, Notification, User) {

    document.addEventListener('deviceready', function() {
        console.log('--------------- CORDOVA READY -----------------');
        Notification.setAppState(true);
        Notification.registerDevice(function() {
            User.addDeviceToken(function(err, user) {
                if (err) {
                    console.log('err', err);
                } else {
                    console.log('user', user);
                }
            });
        });
        Notification.changeState();

    });

    document.addEventListener('resume', function() {
        Notification.changeState();
    }, false);

    document.addEventListener('pause', function() {
        Notification.setAppState(false);
    }, false);
    $ionicPlatform.ready(function() {
        // save to use plugins here
    });

    // add possible global event handlers here

})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, RestangularProvider, api, localStorageServiceProvider, StorageProvider) {
        // register $http interceptors, if any. e.g.
        // $httpProvider.interceptors.push('interceptor-name');
        RestangularProvider.setBaseUrl(api);
        var user = StorageProvider.$get().getUser();
         RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params) {
             // console.log('config', StorageProvider.$get().getUser())
             // var user = StorageProvider.$get().getUser();
             return {
                 element: element,
                 params: _.extend(params, {
                     access_token: user ? user.id : ''
                 })
             };
         });

        localStorageServiceProvider
            .setPrefix('viralDi')
            .setStorageType('localStorage');
        // Application routing
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('app.home', {
                url: '/home',
                cache: false,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/home.html',
                        controller: 'HomeController',
                        controllerAs: 'home'
                    }
                }
            })
            .state('app.dashboard', {
                url: '/dashboard',
                cache: false,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/dashboard.html',
                        controller: 'DashboardController',
                        controllerAs: 'userDash'
                    }
                }
            })
            .state('app.forgot_password', {
                url: '/forgot_password',
                cache: true,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/forgot_password.html',
                        controller: 'ForgotPasswordController',
                        controllerAs: 'forgot'
                    }
                }
            })
            .state('app.cleared', {
                url: '/clearedPayments',
                cache: false,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/cleared.html',
                        controller: 'ClearedPaymentController',
                        controllerAs: 'cleared'
                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                cache: true,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/settings.html'
                    }
                }
            })
            .state('app.register', {
                url: '/register',
                cache: false,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/register.html',
                        controller: 'RegisterController',
                        controllerAs: 'register'
                    }
                }
            });


        // redirects to default route for undefined routes
        if (user) {
            $urlRouterProvider.otherwise('/app/dashboard');
        } else {
            $urlRouterProvider.otherwise('/app/home');
        }
    // }).constant('api', 'http://')
    }).constant('api', 'http://localhost:3000/api')
    .constant('GCM', {
        senderId: ''
    });