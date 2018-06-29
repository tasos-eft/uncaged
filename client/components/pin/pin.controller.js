'use strict';
(function(){

class pinComponent {
  constructor($window, $state, GlobalFactory, WILfactory, $mdDialog) {
    this.window = $window;
    this.state = $state;
    this.GlobalFactory = GlobalFactory;
    this.WILfactory = WILfactory;
    this.mdDialog = $mdDialog;
  }

  $onInit() {
    this.session();
    this.androidKeyboard();
    this.getImagePath();
  }

  session() {
    // first check if user can redeem
    this.canUserRedeem = this.GlobalFactory.retriveData('can-redeem');
    if ( !this.canUserRedeem ) {
      this.state.go('revisit');
    }
    this.userPhone = this.GlobalFactory.retriveData('user-phone');
    // if user hasn't provided a phone, name and  date of birth, are required for a phone
    if (!this.userPhone)  {
      this.state.go('phone');
    }
    this.WILcoupon = this.GlobalFactory.retriveData('coupon');
  }

  /* push screen up on android*/
  androidKeyboard() {

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf('android') > -1; //&& ua.indexOf('mobile');
    if (!isAndroid) {
        return;
    }

    var windowEl = angular.element(this.window);

    var lastHeight = windowEl.height();  //  store the intial height.
    var lastWidth = windowEl.width();    //  store the intial width.
    var keyboardIsOn = false;

    windowEl.resize(function() {
        var inputInFocus = $('input');
        if (inputInFocus.is(':focus')) {
            keyboardIsOn =
                ((lastWidth == windowEl.width()) && (lastHeight > windowEl.height()));
        }
        if (keyboardIsOn && inputInFocus.is(':focus')) {
            inputInFocus[0].scrollIntoViewIfNeeded();
        } else {
            $('div.section-container')[0].scrollIntoViewIfNeeded();
        }
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

  getImagePath() {
    this.imgPath = this.GlobalFactory.retriveData('genart-path');
  }

  pinValidation( pin ) {
    pin = pin.replace(/\D/g,'');
    var length = '';
    length = pin.toString().length;
    this.pin = pin;
    if ( 4 === length ) {
      this.showArrow = true;
    }
    else {
      this.showArrow = false;
    }
  }

  nextScreen() {
    // get user from local storage
    this.user = this.GlobalFactory.retriveData('WIL-user');
    if ( !this.user ) {
      this.mdDialog.show(
        this.mdDialog.alert()
        .parent(angular.element(document.querySelector('#pin')))
        .clickOutsideToClose(true)
        .title('user alert')
        .textContent('Sorry, the user does not exist')
        .ariaLabel('user alert')
        .ok('OK')
      );
    }
    
    // verify PIN on WIL api
    var pinData = {
      phone: this.user.phone,
      pin: this.pin
    };
    pinData = JSON.stringify(pinData);
    this.WILfactory.checkPin(pinData)
    .then( (respone) => {
      this.validPin = respone.data.result;
      /*
          verified user = WIL user with valid DOB,
          verified age session,
          and valid phone number (through SMS validation)
      */
      this.verifiedUser = this.GlobalFactory.storeData('verified-user', this.validPin.succeeded);
      return this.validPin.succeeded;
    })
    .then( (onSuccess) => {
      if ( onSuccess ) {
        this.state.go('share');
      }
      else {
        this.mdDialog.show(
          this.mdDialog.alert()
          .parent(angular.element(document.querySelector('#pin')))
          .clickOutsideToClose(true)
          .title('pin verification error')
          .textContent('The code you entered is incorrect. Check your text message and give it another try.')
          .ariaLabel('pin alert')
          .ok('OK')
        );
      }
    })
    .catch((err) => {
      this.mdDialog.show(
        this.mdDialog.alert()
        .parent(angular.element(document.querySelector('#pin')))
        .clickOutsideToClose(true)
        .title('The code you entered is incorrect. Check your text message and give it another try.')
        .textContent(err)
        .ariaLabel('pin alert')
        .ok('OK')
      );
    });
  }


}

angular.module('tigerApp')
  .component('pin', {
    templateUrl: 'components/pin/pin.html',
    controller: pinComponent
  });

})();
