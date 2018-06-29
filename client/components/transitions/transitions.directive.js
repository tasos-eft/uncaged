'use strict';

angular.module('tigerApp')
  .directive('transitions', function (pagepilingService) {
    return {
      // templateUrl: 'components/transitions/transitions.html',
      restrict: 'EA',
      link: function () {
        pagepilingService.pageTransition( $, document, window, undefined );

      }
    };
  });
