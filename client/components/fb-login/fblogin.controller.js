(function() {
  'use strict';

  function FBauthenticationController($scope, $state, $location, $mdDialog, $window, Facebook, GlobalFactory, WILfactory) {

    WILfactory.getPints()
    .then(response => {
      $scope.offer = response.data.offer;
      $scope.pints = $scope.offer.limit - $scope.offer.redeemed;
    })
    .catch(error => {
      console.error('get pints error', error);
    });

    $scope.checkChromeIOS = function() {
      var userAgent = $window.navigator.userAgent;
      if (userAgent.match('CriOS')) {
        return true;
      }
    };

    // check if user is logged in or not

    Facebook.getLoginStatus(function(response) {
        $scope.status = response.status;
        return $scope.status;
      })
      .then((statusRes) => {
        if ('connected' === statusRes.status) {
          $scope.loggedIn = true;
        } else {
          $scope.loggedIn = false;
        }
        return $scope.loggedIn;
      })
      .then((loggerRes) => {
        if (loggerRes) {
          Facebook.api('/me', function(response) {
            $scope.user = response.name;
            GlobalFactory.storeData('facebook-name', response.name);
            $scope.id = response.id;
            GlobalFactory.storeData('facebook-id', response.id);
          });
        }
      })
      .catch((err) => {
        console.error('get error ', err);
      });

    $scope.loginFB = function() {
      // fix iOS Chrome
      if ( $scope.checkChromeIOS() ) {
        /*   *    *   *   *   *   *  publish_actions   *    *    *   *   *   */
        /* $window.location.href = 'https://www.facebook.com/dialog/oauth?client_id=274435409597699&redirect_uri='+ document.location.href +'&scope=email,public_profile,publish_actions'; 8?
        /*   *    *   *   *   *   *  publish_actions   *    *    *   *   *   */
        $window.location.href = 'https://www.facebook.com/dialog/oauth?client_id=274435409597699&redirect_uri='+ document.location.href +'&scope=email,public_profile';
      }

      /*
      no publish_actions
      *   *    *   *   *   *   *    *   *   *   *   *    *   *   *   *   *    *   *   *

      Facebook.login( (response) => {
        return response.authResponse;
      }, { scope: 'publish_actions'} )

      *   *    *   *   *   *   *    *   *   *   *   *    *   *   *   *   *    *   *   *
      */


      Facebook.login( (response) => {
        return response.authResponse;
      })

      .then( (authRes) => {
        if ('connected' === authRes.status) {
          $scope.loggedIn = true;
          Facebook.api('/me', function(response) {
            $scope.user = response.name;
            GlobalFactory.storeData('facebook-name', response.name);
            $scope.id = response.id;
            GlobalFactory.storeData('facebook-id', response.id);
            $state.go('art');
          });
        } else {
          $scope.loggedIn = false;
          console.error('User cancelled login or did not fully authorize.');
        }
      })

      .catch((err) => {
        console.error('get error ', err);
      });

    };

    $scope.next = function(ev) {
      var ageV = GlobalFactory.retriveData('age-verification');
      if (ageV) {
        $state.go('art');
      }
      else {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#terms-container')))
          .clickOutsideToClose(true)
          .title('age verification')
          .textContent('Sorry, you have to be of legal drinking age to enter this site')
          .ariaLabel('age gate alert')
          .ok('OK')
          .targetEvent(ev)
        );

        $location.hash('agegate');
      }
    };

  }

  angular
    .module('tigerApp')
    .config(function(FacebookProvider) {
      // Set your appId through the setAppId method or
      // use the shortcut in the initialize method directly.

      // local.host:9000
      // var APP_ID = '259266744432189';

      // uncaged.cycrm.net
      // var APP_ID = '259207314438132';

      // https://uncage.ie/
      var APP_ID = '274435409597699';

      FacebookProvider.init(APP_ID);
    })
    .controller('FBauthenticationController', ['$scope', '$state', '$location', '$mdDialog', '$window', 'Facebook', 'GlobalFactory', 'WILfactory',
      FBauthenticationController
    ]);
})();
