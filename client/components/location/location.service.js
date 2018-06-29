'use strict';

angular.module('tigerApp')
.factory('LocationFactory', function($http) {
  // Service logic

  var LocationFactory = {};

  // private promise calls here
  LocationFactory.getLocation = function() {
    return $http({
      method: 'POST',
      url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC0HhMQuV6_rOs5U_2TKxLFyXtJcJYKd8M',
      headers: 'Content-Type: application/json'
    });
  };

  LocationFactory.sendCoordinates = function(data) {
    return $http({
      method: 'POST',
      url: '/api/Tiger/location',
      headers: 'Content-Type: application/json',
      data: {
        data
      }
    });
  };

  // Public API here
  return LocationFactory;

});
