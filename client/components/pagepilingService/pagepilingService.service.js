
'use strict';

angular.module('tigerApp')
  .service('pagepilingService', function() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var pagepilingService = {};

    // getter setter on memory
    pagepilingService.setAgeGate = function(data) {
      pagepilingService.data = data;
    };

    pagepilingService.pageTransition = function( ) {
      // initialize pagepiling.js tailored to our needs
      $('#pagepiling').pagepiling({
        direction: 'vertical',
        verticalCentered: true,
        anchors: ['agegate', 'stepone', 'steptwo', 'stepthree', 'fblogin'],
        scrollingSpeed: 1600,
        easing: 'swing',
        loopBottom: false,
        loopTop: false,
        css3: true,
        navigation: false,
        normalScrollElements: null,
        normalScrollElementTouchThreshold: 5,
        touchSensitivity: 5,
        keyboardScrolling: true,
        sectionSelector: '.section',
        animateAnchor: true,
        //events
        onLeave: function(index, nextIndex, direction){},
        afterLoad: function(anchorLink, index){
          var pass = pagepilingService.data;
          if ( (1 === index) && (!pass) )  {
            $('#pagepiling').pagepiling.setAllowScrolling(false);
          }
          else {
            $('#pagepiling').pagepiling.setAllowScrolling(true);
          }
        },
        afterRender: function(){}
      });
    };

    return pagepilingService;

  });
