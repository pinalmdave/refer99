'use strict';

/**
 * @ngdoc function
 * @name viralDL.controller:MainController
 * @description
 * # IntroController
 * This controller handles the Intro
 */
angular.module('viralDL')
  .controller('IntroController', function($scope, $state, Storage,$ionicHistory) {

    // Called to navigate to the main app
    $scope.startApp = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      Storage.setDidTutorial();
      $state.go('app.start');

      // Set a flag that we finished the tutorial
    };

    //No this is silly
    // Check if the user already did the tutorial and skip it if so

    if (Storage.getDidTutorial()) {
      console.log('Skip intro');
      // $scope.startApp();
    }



    // Move to the next slide
    $scope.next = function() {
      $scope.$broadcast('slideBox.nextSlide');
    };

    // Our initial right buttons
    var rightButtons = [{
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Go to the next slide on tap
        $scope.next();
      }
    }];

    // Our initial left buttons
    var leftButtons = [{
      content: 'Skip',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Start the app on tap
        $scope.startApp();
      }
    }];

    // Bind the left and right buttons to the scope
    $scope.leftButtons = leftButtons;
    $scope.rightButtons = rightButtons;


    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      // console.log(index);
      // Check if we should update the left buttons
      if (index > 0) {
        // If this is not the first slide, give it a back button
        $scope.leftButtons = [{
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function(e) {
            // Move to the previous slide
            $scope.$broadcast('slideBox.prevSlide');
          }
        }];
      } else {
        // This is the first slide, use the default left buttons
        $scope.leftButtons = leftButtons;
      }

      // If this is the last slide, set the right button to
      // move to the app
      if (index == 2) {
        $scope.rightButtons = [{
          content: 'Start using MyApp',
          type: 'button-positive button-clear',
          tap: function(e) {
            $scope.startApp();
          }
        }];
      } else {
        // Otherwise, use the default buttons
        $scope.rightButtons = rightButtons;
      }
    };
  });
