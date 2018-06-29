'use strict';

angular.module('tigerApp')
  .factory('WILfactory', function($http) {
    // Service logic

    var WILfactory = {};

    // private promise calls here
    WILfactory.submitUser = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/create',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.findUser = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/find',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.checkPin = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/pin',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.sendPin = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/sms',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.findOffers = function() {
      return $http.post('/api/WIL/offers');
    };

    WILfactory.whereToRedeem = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/where',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.issueCoupon = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/coupons',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.redeemCoupon = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/redeem',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.checkCoupon = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/check',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.canRedeem = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/check-user',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    WILfactory.getPints = function(data) {
      return $http({
        method: 'POST',
        url: '/api/WIL/pints',
        headers: 'Content-Type: application/json',
        data: {
          data
        }
      });
    };

    // Public API here
    return WILfactory;

  });
