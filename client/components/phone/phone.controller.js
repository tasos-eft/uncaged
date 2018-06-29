'use strict';


(function() {

  class PhoneComponent {
    constructor($window, $filter, $state, $uibModal, WILfactory, GlobalFactory) {
      this.window = $window;
      this.filter = $filter;
      this.state = $state;
      this.WILfactory = WILfactory;
      this.GlobalFactory = GlobalFactory;
      this.uibModal = $uibModal;
    }

    $onInit() {
      this.session();
      this.androidKeyboard();
      this.setProviders();
      this.getImagePath();
    }

    session() {
      // first check if user can redeem
      this.canUserRedeem = this.GlobalFactory.retriveData('can-redeem');
      if ( !this.canUserRedeem ) {
        this.state.go('revisit');
      }
      this.fullname = this.GlobalFactory.retriveData('facebook-name');
      this.dateOfBirth = this.GlobalFactory.retriveData('user-dob');
      if (!this.fullname) {
        this.state.go('main');
      }
      if (!this.dateOfBirth){
        this.state.go('main');
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

    /* dynamicaly gets gen art path from server */
    getImagePath() {
      this.imgPath = this.GlobalFactory.retriveData('genart-path');
    }
    /* home and wallet nav buttons */
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
    /* set mobile providers */
    setProviders() {
      this.providers = [
        {code:'083'},
        {code:'085'},
        {code:'086'},
        {code:'087'},
        {code:'089'}
      ];
      this.selectedProvider = this.providers[3].code;
    }

    /* watch changes  */
    changeProviders(value) {
      this.selectedProvider = value;
    }

    getModalController() {
      return ['$scope', '$uibModalInstance',function($scope, $uibModalInstance) {
        $scope.ok = function() {
          $uibModalInstance.dismiss('cancel');
        };
      }];
    }

    termsModal() {
      this.uibModal.open({
        animation: true,
        templateUrl: 'app/main/terms.html',
        controller: this.getModalController(),
        size: 'md',
        windowClass: 'center-modal',
        resolve: {}
      });
    }

    policyModal() {
      this.uibModal.open({
        animation: true,
        templateUrl: 'app/main/privacy.html',
        controller: this.getModalController(),
        size: 'md',
        windowClass: 'center-modal',
        resolve: {}
      });
    }

    canRedeem( mobile ) {
      // magnificent seven
      var lastSeven = mobile.substr(mobile.length - 7);
      // le'me through
      if ('0000000' === lastSeven) {
        this.GlobalFactory.storeData('can-redeem', true);
      }
      // check for ban
      else {
        var user = {
          phone: mobile
        };
        user = JSON.stringify(user);
        // check if user is eligible for redeem
        this.WILfactory.canRedeem(user)
        .then((response) => {
          this.canUserRedeem = response.data.can_redeem;
          this.GlobalFactory.storeData('can-redeem', this.canUserRedeem);
          if ( !this.canUserRedeem ) {
            this.state.go('revisit');
          }
        })
        .catch((err) => {
          console.error('revisit error', err);
        });
      }
    }

    /* from this function we only get the final 7 numbers */
    phoneFormation(mobile) {
      mobile = mobile.replace(/\D/g,'');
      var length = '';
      if ( mobile ) {
        length = mobile.toString().length;
      }
      this.phoneNumber = mobile;
      if ( 7 === length ) {
        this.validPhone = true;
      }
      else {
        this.validPhone = false;
      }
      return this.validPhone;
    }

    /* find or create a user & store data to memory to pass it on other ctrl */
    setUser() {

      this.formatedPhone = '+353 ' + this.selectedProvider + ' ' + this.phoneNumber;
      var userPhone = {
        phone: this.formatedPhone
      };
      userPhone = JSON.stringify(userPhone);
      // store given phone number for future use
      this.GlobalFactory.storeData('user-phone', this.formatedPhone);

      // before checking if user exist or create a new one
      // check if provided phone belongs to a user that cannot redeem for the day
      this.canRedeem( this.formatedPhone );

      this.WILfactory.findUser(userPhone)
        .then(response => {
          // check if user exists
          if (response.data.result.succeeded) {
            this.WILuser  = response.data.user;
            this.WILtoken = response.data.token;
            this.GlobalFactory.storeData('WIL-user', this.WILuser);
            this.GlobalFactory.storeData('WIL-user-token', this.WILtoken);
          }
          return response.data.result.succeeded;
          // if not (response.data.result.succeeded = false), create one
        })
        .then( (userExists) => {
          /*
              if user doesn't exist (response.data.result.succeeded = false)
              create a new user on WIL's CMS, using provided phone
              and facebook fullname
          */

          if (!userExists) {
            var userCreate = {
              phone: this.formatedPhone,
              fullname: this.fullname
            };
            userCreate = JSON.stringify(userCreate);
            // make REST call for user creation
            this.WILfactory.submitUser(userCreate)
              .then(response => {
                this.WILuser  = response.data.user;
                this.WILtoken = response.data.token;
                this.GlobalFactory.storeData('WIL-user', this.WILuser);
                this.GlobalFactory.storeData('WIL-user-token', this.WILtoken);
              })
              .catch((err) => {
                console.error('can not create new user ', err);
              });
          }
          // if user exists send him an SMS
          else {
            this.sendSMS();
          }
          // then change state
          this.state.go('pin');
        })
        .catch(err => {
          console.error('setting up user returned an error ', err);
        });
    }

    /* send SMS to user */
    sendSMS() {
      this.user = this.GlobalFactory.retriveData('WIL-user');
      if (this.user) {
        var userPhone = {
          phone: this.user.phone
        };
        userPhone = JSON.stringify(userPhone);
        this.WILfactory.sendPin(userPhone)
        .then( (respone) => {
          this.smsResult = respone.data.result;
        })
        .catch((err) => {
          console.error('pin not found', err);
        });
      }
      else {
        console.error('SMS error');
        // alert('pin number is not valid');
      }
    }
    // validate
    validForm() {
      if ( this.agree && this.validPhone ) {
        return true;
      }
      else {
        return false;
      }
    }

  }

  angular.module('tigerApp')
    .component('phone', {
      templateUrl: 'components/phone/phone.html',
      controller: PhoneComponent
    });

})();
