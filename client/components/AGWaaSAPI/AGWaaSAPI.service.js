'use strict';

angular.module('tigerApp')
.factory('AGWaaSfactory', function($http) {
  // Service logic

  /* age gate factory */
  var AGWaaSfactory = {};
  AGWaaSfactory.data = null;

  // post data to age gate
  AGWaaSfactory.postData = function(age) {
    return $http.post('/api/AGWaaS/agegate', age);
  };

  // Expose Service
  return AGWaaSfactory;

});
