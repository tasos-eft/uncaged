'use strict';

angular.module('tigerApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ui.bootstrap',
    'cgPrompt',
    'ui.router',
    'LocalStorageModule',
    'facebook',
    'ngKeypad',
    'timer',
    'infinite-scroll',
    'ngFileSaver',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.google.tagmanager'
  ])

  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('tigerApp');
  })

  .config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('tiger')
        .primaryPalette('blue-grey')
        .accentPalette('light-blue')
        .warnPalette('orange');
    $mdThemingProvider.setDefaultTheme('tiger');
  }])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider
      .otherwise('/');

    $stateProvider
    .state('main', {
        url: '/',
        template: '<main></main>'
      });

    $locationProvider.html5Mode(true);

  });
