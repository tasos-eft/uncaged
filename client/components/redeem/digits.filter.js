'use strict';

angular.module('tigerApp')
  .filter('digits', function () {
    return function (number, length) {
      var doubeDigit = parseInt(number, 10);
      length = parseInt(length, 10);

      if (isNaN(doubeDigit) || isNaN(length)) {
        return number;
      }

      doubeDigit = '' + doubeDigit;
      while (doubeDigit.length < length) {
        doubeDigit = '0' + doubeDigit;
      }

      return doubeDigit;
    };
  });
