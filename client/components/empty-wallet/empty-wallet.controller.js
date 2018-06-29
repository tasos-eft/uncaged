'use strict';
(function(){

class EmptyWalletComponent {
  constructor($state, GlobalFactory) {
    this.state = $state;
    this.GlobalFactory = GlobalFactory;
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
    // if user hasn't provided a name via fb login or a date of birth, go back to main page
    this.fullname = this.GlobalFactory.retriveData('facebook-name');
    this.dateOfBirth = this.GlobalFactory.retriveData('user-dob');
    if ( (!this.fullname) || (!this.dateOfBirth) ) {
      this.state.go('main');
    }
  }

  home() {
    this.state.go('main');
    this.clearAll();
  }

  wallet() {
    this.state.go('empty-wallet');
  }

  clearAll() {
    this.GlobalFactory.clear();
  }

  art() {
    this.state.go('art');
  }
}

angular.module('tigerApp')
  .component('emptyWallet', {
    templateUrl: 'components/empty-wallet/empty-wallet.html',
    controller: EmptyWalletComponent
  });

})();
