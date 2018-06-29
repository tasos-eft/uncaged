'use strict';
(function(){

class RevisitComponent {
  constructor() {
    this.hello = 'hello';
  }

}

angular.module('tigerApp')
  .component('revisit', {
    templateUrl: 'components/revisit/revisit.html',
    controller: RevisitComponent
  });

})();
