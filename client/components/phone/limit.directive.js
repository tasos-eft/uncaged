'use strict';

angular.module('tigerApp')
  .directive('limit', function () {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var lim = parseInt(attrs.limit);
            angular.element(elem).on('keypress', function(e) {
                if (this.value.length === lim) {
                  e.preventDefault();
                }
            });
        }
    };
  });
