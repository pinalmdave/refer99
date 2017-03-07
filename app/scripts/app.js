'use strict';

/**
 * @ngdoc overview
 * @name viralDL
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */

angular.module('viralDL', ['ionic', 'ngCordova', 'ngResource', 'ngSanitize', 'restangular', 'LocalStorageModule', 'ionic-datepicker', 'ionic.rating'])

.run(function($ionicPlatform, Notification, User) {

  document.addEventListener('deviceready', function() {
    console.log('--------------- CORDOVA READY -----------------');
    /*  Notification.registerDevice(function() {
        User.addDeviceToken(function(err, user) {
          if (err) {
            console.log('err', err);
          } else {
            console.log('user', user);
          }
        });
      });*/
    $ionicPlatform.ready(function() {
      // save to use plugins here
      FCMPlugin.subscribeToTopic('Viral99');
      FCMPlugin.onNotification(
        function(data) {
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.
            console.log(JSON.stringify(data));
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.
            console.log(JSON.stringify(data));
          }
        },
        function(msg) {
          console.log('onNotification callback successfully registered: ' + msg);
        },
        function(err) {
          console.log('Error registering onNotification callback: ' + err);
        }
      );
    });

  });


})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, RestangularProvider, api, localStorageServiceProvider, StorageProvider) {
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');
    RestangularProvider.setBaseUrl(api);
    var user = StorageProvider.$get().getUser();
    var didTutorial = StorageProvider.$get().getDidTutorial();
    RestangularProvider.setDefaultRequestParams({
      access_token: user ? user.id : ""
    });
    /*RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params) {
      // console.log('config', StorageProvider.$get().getUser())
      // var user = StorageProvider.$get().getUser();
      return {
        element: element,
        params: _.extend(params, {
          access_token: user ? user.id : ''
        })
      };
    });*/

    localStorageServiceProvider
      .setPrefix('viralDL')
      .setStorageType('localStorage');
    // Application routing
    $stateProvider
      .state('intro', {
        url: '/',
        templateUrl: 'templates/views/intro.html',
        controller: 'IntroController'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('app.home', {
        url: '/home',
        cache: true,
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
        cache: true,
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
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/forgot_password.html',
            controller: 'ForgotPasswordController',
            controllerAs: 'forgot'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/settings.html',
            controller: 'SettingsController',
            controllerAs: 'settings'
          }
        }
      })
      .state('app.register', {
        url: '/register',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/register.html',
            controller: 'RegisterController',
            controllerAs: 'register'
          }
        }
      })
      .state('app.new_campaign', {
        url: '/new_campaign',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/new_campaign.html',
            controller: 'NewCampaignController',
            controllerAs: 'newCampaign'
          }
        }
      })
      .state('app.payment', {
        url: '/payment',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/payment.html',
            controller: 'PaymentController',
            controllerAs: 'payment'
          }
        }
      })
      .state('app.notification', {
        url: '/notification',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/notification.html',
            controller: 'NotificationController',
            controllerAs: 'notification'
          }
        }
      })
      .state('app.view_coupon', {
        url: '/:camp_id/view_coupon',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/coupon.html',
            controller: 'ViewCouponController',
            controllerAs: 'viewCoupon'
          }
        }
      })
      .state('app.send_coupons', {
        url: '/:camp_id/send_coupons',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/send_coupons.html',
            controller: 'SendCouponController',
            controllerAs: 'coupon'
          }
        }
      })
      .state('app.manage_customers', {
        url: '/manage_customers',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/manage_customers.html',
            controller: 'ManageCustomersController',
            controllerAs: 'manage'
          }
        }
      })
      .state('app.validate_coupon', {
        url: '/validate_coupon',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/validate.html',
            controller: 'ValidateCouponController',
            controllerAs: 'validate'
          }
        }
      })
      .state('app.business_profile', {
        url: '/business_profile',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/business_profile.html',
            controller: 'BusinessProfileController',
            controllerAs: 'profile'
          }
        }
      })
      .state('app.contact_us', {
        url: '/contact_us',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/contact_us.html',
            controller: 'ContactUsController',
            controllerAs: 'contactUs'
          }
        }
      })
      .state('app.edit_campaign', {
        url: '/campaign/:camp_id',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/edit_campaign.html',
            controller: 'EditCampaignController',
            controllerAs: 'contactUs'
          }
        }
      })

    .state('app.help', {
      url: '/help',
      cache: false,
      views: {
        'viewContent': {
          templateUrl: 'templates/views/help.html'
        }
      }
    })

    .state('app.start', {
      url: '/start',
      cache: true,
      views: {
        'viewContent': {
          templateUrl: 'templates/views/start.html',
          controller: 'HomeController'
        }
      }
    });



    // redirects to default route for undefined routes
    if (!didTutorial) {
      $urlRouterProvider.otherwise('/');
    } else if (user) {
      // $urlRouterProvider.otherwise('/app/dashboard');
      if (user.user.last_payment) {
        /*var monthDiff = moment(moment()).diff(moment(user.user.last_payment), 'months', true);
        if (monthDiff >= 1) {
          $urlRouterProvider.otherwise('/app/payment');
        } else {*/
        $urlRouterProvider.otherwise('/app/dashboard');
        // }
      } else if (!user.user.last_payment) {
        $urlRouterProvider.otherwise('/app/payment');
      } else {
        $urlRouterProvider.otherwise('/app/dashboard');
      }
    } else {
      $urlRouterProvider.otherwise('/app/start');
    }
  }).constant('api', 'http://refer99.com:3001/api')
  .constant('base', 'http://refer99.com:3001')
  // }).constant('api', 'http://35.162.137.242:3001/api')
  // .constant('base', 'http://35.162.137.242:3001')
  .constant('GCM', {
    senderId: ''
  }).constant('facebook', {
    Id: '1178098532304502'
  })
  .constant('business_logo', 'http://refer99.com:3001/storage/business_logo/');
