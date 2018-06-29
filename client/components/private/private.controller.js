'use strict';
(function(){

class PrivateComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('tigerApp')
  .component('private', {
    templateUrl: 'components/private/private.html',
    controller: PrivateComponent
  });

})();
