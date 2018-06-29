'use strict';

(function() {

  class shareComponent {
    constructor($state, $window, Facebook, GlobalFactory, WILfactory, $mdDialog, $timeout, $http, FileSaver, Blob) {
      this.state = $state;
      this.window = $window;
      this.Facebook = Facebook;
      this.GlobalFactory = GlobalFactory;
      this.WILfactory = WILfactory;
      this.mdDialog = $mdDialog;
      this.timeout = $timeout;
      this.http = $http;
      this.FileSaver = FileSaver;
      this.Blob = Blob;
    }

    $onInit() {
      this.session();
      this.getImagePath();
      this.checkCoupon();
    }

    session() {
      // retrive facebookID;
      this.facebookID = this.GlobalFactory.retriveData('facebook-id');
      // first check if user can redeem
      this.canUserRedeem = this.GlobalFactory.retriveData('can-redeem');
      if (!this.canUserRedeem) {
        this.state.go('revisit');
      }
      // no user
      this.WILuser = this.GlobalFactory.retriveData('WIL-user');
      if (!this.WILuser) {
        console.error('no wil user');
        this.state.go('main');
      }
      // no toker
      this.userToken = this.GlobalFactory.retriveData('WIL-user-token');
      if (!this.userToken) {
        this.userToken = null;
        console.error('no user token on redeem');
        this.state.go('main');
      }
    }

    getImagePath() {
      this.imgPath = this.GlobalFactory.retriveData('genart-path');
    }

    checkCoupon() {
      this.WILcoupon = this.GlobalFactory.retriveData('coupon');
      if (this.WILcoupon) {
        this.pubs = this.GlobalFactory.retriveData('places');
      } else {
        this.getOffers();
      }
    }

    getOffers() {

      this.WILfactory.findOffers()
        .then(response => {
          this.offers = response.data.offers;
          this.WILoffer = this.offers[0];
          return this.WILoffer;
        })
        .then(offer => {
          /* * * * * * * * * * */
          /* *  issue coupon * */
          /* * * * * * * * * * */
          var couponData = {
            offerID: offer.id,
            userID: this.userToken.user_id
          };
          couponData = JSON.stringify(couponData);
          this.WILfactory.issueCoupon(couponData)
            .then(response => {
              // coupon has been issed
              // modal on succesfull coupon issue
              // store coupon on wallet
              if (response.data.result.succeeded) {
                this.WILcoupon = response.data.coupon;
                this.GlobalFactory.storeData('coupon', this.WILcoupon);
              } else {
                console.error('issue coupon error');
                this.showAlert('issue coupon error', 'you did not manage to issue a coupon succesfully');
              }
            })
            .catch((err) => {
              this.showAlert('issue coupon error', err);
              console.error('issue coupon error', err);
            });
          /* * * * * * * * * * * * * */
          /* * get affiliated pubs * */
          /* * * * * * * * * * * * * */
          var offerData = {
            offerID: offer.id
          };
          offerData = JSON.stringify(offerData);
          this.WILfactory.whereToRedeem(offerData)
            .then(response => {
              this.pubs = response.data.places;
              this.GlobalFactory.storeData('places', response.data.places);
            })
            .catch(error => {
              console.error('get pubs error ', error);
            });

          return this.pubs;
        })
        .catch(error => {
          console.error('find offer error ', error);
        });
    }

    showAlert(title, content) {
      var alert = this.mdDialog.alert({
        title: title,
        textContent: content,
        ok: 'OK'
      });
      this.mdDialog
        .show(alert)
        .finally( ()=> {
          console.log('42');
          this.save();
          alert = undefined;
        });
    }

    /* POST A FEED WITH DIALOG using FB.ui */
    shareAPI() {
      // check if user is connected to facebook
      this.Facebook.api(
        '/me',
        (response) => {
          /* cehck if user is connected to facebook */
          if (response.error) {
            this.showAlert('facebook login', 'you are not connected to facebook');
            return;
          } else {
            /* API share photo */
            this.Facebook.api(
              '/me/photos',
              'post', {
                caption: 'Check out my personalised piece of art from Tiger Beer! Log in to www.uncage.ie to get yours and a complimentary pint',
                url: this.imgPath
              },
              (response) => {
                if (!response.error) {
                  this.showAlert('Sharing your artwork', 'Thanks. We’ve shared your Uncage Original to your facebook profile');
                } else {
                  this.showAlert('Sharing artwork error', response.error.message);
                }
              }
            );
            /* API share photo */
          }
          /* cehck if user is connected to facebook */
        }
      );
    }

    shareUI() {
      /* UI share photo */
      this.Facebook.ui({
        method: 'feed',
        name: 'Introducing Tiger Uncage Originals',
        link: 'https://uncage.ie',
        picture: this.imgPath,
        caption: 'Uncage.ie',
        description: 'Check out my personalised piece of art from Tiger Beer! Log in to www.uncage.ie to get yours and a complimentary pint'
      });
    }

    message() {
      this.showAlert('Saving your artwork', 'To save your artwork just tap and hold on the image and save it to your phone');
    }

    home() {
      this.state.go('main');
    }

    wallet() {
      this.WILcoupon = this.GlobalFactory.retriveData('coupon');
      this.timeout(() => {
        if (this.WILcoupon) {
          this.state.go('wallet');
        } else {
          this.mdDialog.show(
            this.mdDialog.alert()
            .parent(angular.element(document.querySelector('#share')))
            .clickOutsideToClose(true)
            .title('no coupon')
            .textContent('currently you do not have a coupon on your wallet please issue one and return')
            .ariaLabel('no coupon')
            .ok('OK')
          );
          this.state.go('empty-wallet');
        }
      }, 1000);
    }

    save() {
      var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (iOS) {
        this.facebookName = this.GlobalFactory.retriveData('facebook-name');
        this.facebookName = this.facebookName.replace(/ /g,'.');
        this.window.location.href = 'http://uncage.ie/save.html?' + this.facebookName;
      }
    }

  }

  angular.module('tigerApp')
    .component('share', {
      templateUrl: 'components/share/share.html',
      controller: shareComponent
    });

})();
