'use strict';
(function(){

class PubsComponent {
  constructor($state, $stateParams, $window, GlobalFactory, LocationFactory) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.window = $window;
    this.GlobalFactory = GlobalFactory;
    this.LocationFactory = LocationFactory;
  }

  $onInit() {
    this.session();
    this.getPubs();
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
    // first time
    this.pubCookie = this.GlobalFactory.retriveData('pub-cookie');
    if (!this.pubCookie) {
      // reload window
      this.window.location.reload();
      this.GlobalFactory.storeData('pub-cookie', true);
    }
  }

  back() {
    this.GlobalFactory.removeData('pub-cookie');
    this.state.go('wallet');
  }

  wallet() {
    this.GlobalFactory.removeData('pub-cookie');
    if (this.WILcoupon) {
      this.state.go('wallet');
    }
    else {
      this.state.go('empty-wallet');
    }
  }

  getPubs() {
    this.origin = this.stateParams.origin;
    // determine user's origin, list or pin (GPS)
    if ('list' === this.origin) {
      // full list is displayed
      this.pubs = this.GlobalFactory.retriveData('places');
    }

    if ('pin' === this.origin) {
      // pin, GPS-located based list is displayed
      this.pubsNearBy = this.GlobalFactory.retriveData('pubs-nead-by');
      /*
          pubs near by are stored to an array of objects
          if this array doesn't contain data will either return empty [] or undefined
          to avoid tricky comparations we transfor this array to a json string
          and conduct our comparation to the result
      */
      var checker = JSON.stringify(this.pubsNearBy);
      if (  'null' === checker || '[]' === checker ) {
        this.pubs = this.GlobalFactory.retriveData('places');
      }
      else {
        /* if no pubs near location, return the full list */
        this.pubs = this.pubsNearBy;
      }
    }

    if (this.pubs) {
      this.moreThanFive = this.initializePubList();
    }
  }
  /* build the pub list dynamically and display it via infinite-scroll */
  initializePubList() {
    if (this.pubs.length >= 5 ) {
      this.pubList = this.pubs.slice(0, 5);
      return true;
    }
    else {
      this.pubList = this.pubs.slice(0, this.pubs.length);
      return false;
    }
  }
  /* initially show only 6 pubs, then populate list with more */
  loadMorePubs() {
    if (this.pubList.length <  this.pubs.length ) {
      this.pubList = this.pubs.slice(0, this.pubList.length + 1);
    }
  }

  roadToRedemption(id) {
    this.GlobalFactory.removeData('pub-cookie');
    this.state.go('redeem', { pubID: id });
  }

}

angular.module('tigerApp')
  .component('pubs', {
    templateUrl: 'components/pubs/pubs.html',
    controller: PubsComponent
  });

})();
