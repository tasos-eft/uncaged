'use strict';

angular.module('tigerApp')
  .factory('GlobalFactory', function (localStorageService) {
    /* tiger app global factory */
    var GlobalFactory = {};

    // getter setter on memory
    GlobalFactory.setData = function(data) {
      GlobalFactory.data = data;
    };

    GlobalFactory.getData = function() {
      return GlobalFactory.data;
    };

    // getter setter on localstorage
    GlobalFactory.storeData = function(key, value) {
      return localStorageService.set(key, value);
    };

    GlobalFactory.retriveData = function(key) {
      return localStorageService.get(key);
    };

    GlobalFactory.removeData = function(key) {
      return localStorageService.remove(key);
    };

    GlobalFactory.clear = function() {
      return localStorageService.clearAll();
    };

    // Expose Service
    return GlobalFactory;

  });
