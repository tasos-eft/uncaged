'use strict';

(function() {

  class MainController {

    constructor($window, $state, $location) {
      this.window = $window;
      this.state = $state;
      this.location = $location; 
    }

    move() {
      this.window.location.href = 'http://www.drinkaware.ie/';
    }

    movingBox() {
      this.wt = this.window.innerWidth;
      this.ht = this.window.innerHeight;
      var ax = -(this.wt / 2 - event.clientX) / 50;
      var ay = (this.ht / 2 - event.clientY) / 50;
      this.transform = 'rotateY(' + ax + 'deg) rotateX(' + ay + 'deg)';
      this.boxStyle = {
        'transform': this.transform,
        '-webkit-transform': this.transform,
        '-moz-transform': this.transform,
        '-ms-transform': this.transform
      };
    }

  }

  angular.module('tigerApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });

})();
