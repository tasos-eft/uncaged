'use strict';
(function() {

  class WalletComponent {
    constructor($state, WILfactory, GlobalFactory, $mdDialog) {
      this.state = $state;
      this.WILfactory = WILfactory;
      this.GlobalFactory = GlobalFactory;
      this.mdDialog = $mdDialog;
    }

    $onInit() {
      this.session();
    }

    session() {
      // first check if user can redeem
      this.canUserRedeem = this.GlobalFactory.retriveData('can-redeem');
      if ( !this.canUserRedeem ) {
        this.state.go('revisit');
      }
      // no coupons
      this.WILcoupon = this.GlobalFactory.retriveData('coupon');
      if ( !this.WILcoupon ) {
        this.state.go('empty-wallet');
      }
      // no pubs
      this.pubs = this.GlobalFactory.retriveData('places');
      if ( !this.pubs ) {
        this.state.go('empty-wallet');
      }
      this.showWallet = this.pubs.length;
    }

    toPubs(ev) {
      if (this.pubs) {
        this.state.go('pubs', { origin: 'list'});
      }
      else {
        console.error('there are not any available pubs');
        //this.showConfirm(ev);
      }
    }

    toLocation(ev) {
      if (this.pubs) {
        this.state.go('location');
      }
      else {
        console.error('there are not any available pubs');
        // this.showConfirm(ev);
      }
    }

    showConfirm(ev) {
      var t = 'PUB LIST IS NOT LOADED';
      var c = 'Sorry, the list with all the available pubs is missing';
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = this.mdDialog.confirm()
      .title(t)
      .ariaLabel('pub list')
      .textContent(c)
      .targetEvent(ev)
      .ok('Yes');

      this.mdDialog.show( confirm )
      .then( (value) => {
        this.route.reload();
      })
      .catch( (error) => {
        console.error(error);
      });
    }

    home() {
      this.state.go('main');
    }

    wallet() {
      this.state.go('wallet');
    }

  }

  angular.module('tigerApp')
    .component('wallet', {
      templateUrl: 'components/wallet/wallet.html',
      controller: WalletComponent
    });

})();
