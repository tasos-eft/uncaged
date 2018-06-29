'use strict';
(function(){

class TicketsComponent {
  constructor($state, $mdDialog, $window, Facebook, GlobalFactory) {
    this.state = $state;
    this.mdDialog = $mdDialog;
    this.window = $window;
    this.Facebook = Facebook;
    this.GlobalFactory = GlobalFactory;
  }

  $onInit() {
    this.getImagePath();
    this.session();
  }

  session() {
    // retrive facebookID;
    this.facebookID = this.GlobalFactory.retriveData('facebook-id');
    // retrive coupon data;
    this.WILcoupon = this.GlobalFactory.retriveData('coupon');
    // remove pubs
    this.GlobalFactory.removeData('places');
  }

  getImagePath() {
    this.imgPath = this.GlobalFactory.retriveData('genart-path');
  }

  /* POST A FEED WITH DIALOG using FB.ui */
  shareAPI() {
    // check if user is connected to facebook
    this.Facebook.api(
      '/me',
      (response) => {
        /* cehck if user is connected to facebook */
        if ( response.error ) {
          this.showAlert('facebook login', 'you are not connected to facebook');
          return;
        }
        else {
          /* API share photo */
          this.Facebook.api(
            '/me/photos',
            'post',
            {
              caption: 'Check out my personalised piece of art from Tiger Beer! Log in to www.uncage.ie to get yours and a complimentary pint',
              url: this.imgPath
            },
            (response) => {
              if ( !response.error) {
                this.showAlert('Sharing your artwork', 'Thanks. We’ve shared your Uncage Original to your facebook profile');
              }
              else {
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
      description: 'Check out my personalised piece of art from Tiger Beer! Log in to www.uncage.ie to get yours and a complimentary pint' }
    );
  }

  showAlert(title, content) {
    var alert = this.mdDialog.alert({
      title: title,
      textContent: content,
      ok: 'OK'
    });
    this.mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
      });
  }

  message() {
    this.showAlert('Saving your artwork', 'To save your artwork just tap and hold on the image and save it to your phone');
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

}

angular.module('tigerApp')
  .component('tickets', {
    templateUrl: 'components/tickets/tickets.html',
    controller: TicketsComponent
  });

})();
