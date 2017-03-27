angular.module('viralDL')
  .controller('HelpController', function($scope, $rootScope, $ionicLoading,$ionicScrollDelegate, $sce, $templateRequest, $state, Storage, User, $ionicPopup, $ionicSideMenuDelegate, $stateParams, $ionicModal, business_logo) {
    $ionicModal.fromTemplateUrl('answer.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.answer = modal;
    });
    $scope.openModal = function(ques) {
      $scope.ques=ques;
      $scope.answer.show();
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
    };
    $scope.closeModal = function(ques) {
      $scope.answer.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.answer.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  });
