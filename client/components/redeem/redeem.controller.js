'use strict';

(function() {

  class RedeemComponent {
    constructor($state, $stateParams, $mdDialog, $window, GlobalFactory, WILfactory) {
      this.state = $state;
      this.stateParams = $stateParams;
      this.mdDialog = $mdDialog;
      this.window = $window;
      this.GlobalFactory = GlobalFactory;
      this.WILfactory = WILfactory;
    }

    $onInit() {
      this.getDate();
      this.session();
    }

    session() {

      this.pubID = this.stateParams.pubID;
      this.pub = this.findPub( this.pubID );

      this.userToken = this.GlobalFactory.retriveData('WIL-user-token');
      if ( !this.userToken ) {
        this.userToken = null;
        console.error('no user token on redeem');
        this.state.go('main');
      }

      this.WILcoupon = this.GlobalFactory.retriveData('coupon');
      if ( !this.WILcoupon ) {
        this.WILcoupon = null;
        console.error('no coupon on redeem');
        this.state.go('empty-wallet');
      }
      else {
        // check if coupon is up to date
        var check = {
          userToken: this.userToken.hash
        };
        check = JSON.stringify(check);

        this.WILfactory.checkCoupon(check)
        .then(response => {
          return response.data;
        })
        .then( ( existingCoupons ) => {
          if ( existingCoupons.result ) {
            // check user coupon history
            this.userCouponData = existingCoupons.coupons;
            // check if stored coupon is redeemed (obsolite)

            this.userCouponData.forEach(v => {
              if (v.code === this.WILcoupon.code ) {
                if ( v.redeemed_at ) {
                  this.GlobalFactory.removeData('coupon');
                }
              }
            });
          }
        })
        .catch(error => {
          console.error('get error ', error);
        });
      }

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
    move() {
      this.window.location.href = 'http://www.drinkaware.ie/';
    }

    showConfirm(ev) {
      var t = 'ARE YOU READY TO ORDER YOUR PINT?';
      var c = 'Remember your complimentary pint is only available in ' + this.pub.name + ' & will expire after two minutes. Please make sure you are at the bar before proceeding ';
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = this.mdDialog.confirm()
      .title(t)
      .ariaLabel('free pint')
      .textContent(c)
      .targetEvent(ev)
      .ok('Yes')
      .cancel('No');

      this.mdDialog.show( confirm )
      .then( (value) => {        
        this.pintRedemption();
      })
      .catch( (value) => {
        this.state.go('wallet');
      });
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

    pintRedemption() {

      var redeem = {
        userToken: this.userToken.hash,
        couponCode: this.WILcoupon.code,
        placeID: this.pubID
      };
      redeem = JSON.stringify(redeem);

      this.WILfactory.redeemCoupon(redeem)
      .then(response => {
        this.redeemed = response.data.redeemed;
        return this.redeemed;
      })
      .then( (redeemed) => {
        this.couponRedeemed = redeemed;
        // if coupon is redeemed please remove related data
        if (redeemed) {
          // remove stored data
          this.GlobalFactory.removeData('WIL-user');
          this.GlobalFactory.removeData('WIL-user-token');
          //this.GlobalFactory.removeData('places');
          this.GlobalFactory.removeData('user-location');
          this.GlobalFactory.removeData('pubs-nead-by');
          this.GlobalFactory.removeData('coupon');

          this.state.go('order', { pubID: this.pub.id });
        }

        this.WILcoupon = this.GlobalFactory.retriveData('coupon');
      })
      .catch(error => {
        console.error('get error ', error);
      });
    }

    getDate() {
      this.datestamp = Date.now();
    }

  }

  angular.module('tigerApp')
  .component('redeem', {
    templateUrl: 'components/redeem/redeem.html',
    controller: RedeemComponent
  });

})();
