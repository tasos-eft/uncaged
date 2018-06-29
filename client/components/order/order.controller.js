'use strict';
(function(){

class OrderComponent {

  constructor($state, $stateParams, $window, $timeout, $mdDialog, GlobalFactory, WILfactory) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.window = $window;
    this.timeout = $timeout;
    this.mdDialog = $mdDialog;
    this.GlobalFactory = GlobalFactory;
    this.WILfactory = WILfactory;
    this.finalCountDown = 121;
  }

  $onInit() {
    this.session();
    this.preventReload();
    this.getDate();
  }

  session() {
    this.pubID = this.stateParams.pubID;
    this.pub = this.findPub( this.pubID );
  }

  preventReload() {
    var wl2 = angular.element(document.querySelector('#order')) ;
    wl2.on('beforeunload', function (event) {
      event.preventDefault();
    });
  }

  home() {
    this.state.go('main');
  }

  wallet() {
    if (this.WILcoupon) {
      this.state.go('wallet');
    }
    else {
      this.state.go('empty-wallet');
    }
  }

  showAlert() {
    var alert = this.mdDialog.alert({
      title: 'Action Alert',
      textContent: 'Something went wrong and we redirecting you on the main page sorry',
      ok: 'OK'
    });
    this.mdDialog
    .show( alert )
    .finally(function() {
      this.state.go('main');
      alert = undefined;
    });
  }

  findPub(pubID) {
    this.pubs = this.GlobalFactory.retriveData('places');
    var found = [];
    if ( !this.pubs ) {
      this.pubs = null;
      console.error('no pubs on redeem');
      found = ['false'];
      this.showAlert();
      this.state.go('empty-wallet');
    }

    angular.forEach(this.pubs, (value, key) => {
      if ( pubID === value.id.toString() ) {
        found = value;
      }
    });
    // returns targeted object
    return found;
  }

  getDate() {
    this.datestamp = Date.now();
  }

  final() {
    // everything's OK remove coupon and places and proceed.
    if (this.pubs) {
      this.GlobalFactory.removeData('places');
      this.state.go('tickets');
    }
    else {
      this.state.go('empty-wallet');
    }

  }

}

angular.module('tigerApp')
  .component('order', {
    templateUrl: 'components/order/order.html',
    controller: OrderComponent
  });

})();
