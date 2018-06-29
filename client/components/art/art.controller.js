'use strict';
(function(){

class ArtComponent {
  constructor($state, $location, $mdDialog, GlobalFactory, GenApp) {
    this.state = $state;
    this.location = $location;
    this.mdDialog = $mdDialog;
    this.GlobalFactory = GlobalFactory;
    this.GenApp = GenApp;
  }

  $onInit() {
    this.session();
    this.setImageFolder();
    this.loader();
    this.loadArtPiece();
    this.WILcoupon = this.GlobalFactory.retriveData('coupon');
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

  setImageFolder() {
    // store each user's generative art to a sheperate folder
    this.folder = this.GlobalFactory.retriveData('facebook-name');
    /* remove spaces & special characters */
    // this.folder = this.folder.replace(/[^\w\s]/gi, '');
    this.folder = this.folder.replace(/ /g,'.');
  }

  loadArtPiece() {
    var GenAppContainer = angular.element('#genAppContanier');

    this.dateOfBirth = JSON.parse(this.dateOfBirth);
    // populate JSON config
    var zodiac = 1;
    switch (this.dateOfBirth.BirthYear % 12) {
      case 0:
        zodiac = 1;
        break;
      case 1:
        zodiac = 2;
        break;
      case 2:
        zodiac = 3;
        break;
      case 3:
        zodiac = 4;
        break;
      case 4:
        zodiac = 5;
        break;
      case 5:
        zodiac = 6;
        break;
      case 6:
        zodiac = 7;
        break;
      case 7:
        zodiac = 8;
        break;
      case 8:
        zodiac = 9;
        break;
      case 9:
        zodiac = 10;
        break;
      case 10:
        zodiac = 11;
        break;
      case 11:
        zodiac = 12;
        break;

      default:
        zodiac = 1;
    }

    var hour = new Date().getHours();

    var config = {
      params: {
        fullname: this.fullname,
        zodiac: zodiac,
        dob_dd: this.dateOfBirth.BirthDay,
        dob_mm: this.dateOfBirth.BirthMonth,
        dob_yyyy: this.dateOfBirth.BirthYear,
        x: '1.0',
        y: '0.5',
        z: '1.0',
        hour: hour,
        startDay: '7',
        startNight: '19',
        mode: 'composer'
      }
    };
    config = JSON.stringify(config);
    this.GenApp.init(GenAppContainer, config, this.caller, true); // config array
  }

  loader() {
    this.artCover = angular.element( document.querySelector('#art-container') );
    this.spinCover = angular.element( document.querySelector('#spinner') );
    // hide spinner
    this.spinCover.addClass('spin-off');
    // hide save art button
    this.saveArt = angular.element( document.querySelector('#save-art') );
    this.saveArt.addClass('spin-off');
  }

  caller( ) {
    // show  arrow
    var saveArt = angular.element( document.querySelector('#save-art') );
    saveArt.removeClass('spin-off');
  }

  // post generative art image to the server
  saveArtPiece() {
    // hide art
    this.artCover.addClass('spin-off');
    // show spinner
    this.spinCover.removeClass('spin-off');

    var base64 = angular.element('#genAppContanier canvas').getCanvasImage();
        base64 = base64.replace('data:image/png;base64,', '');

    var genArtData = JSON.stringify({
      base64: base64,
      folder: this.folder
    });

    this.GenApp.saveBase64( genArtData )
      .then(response => {
        if (response.data) {
          this.img = response.data;
        }
        return this.img;
      })
      .then( (imageData) => {
        // var fullpath = (this.location.protocol() + '://' + this.location.host() + ':' + this.location.port() + '/' + imageData.path);
        var fullpath = (this.location.protocol() + '://' + this.location.host() + '/' + imageData.path);
        this.path = this.GlobalFactory.storeData('genart-path', fullpath);
        // hide art
        this.artCover.removeClass('spin-off');
        // show spinner
        this.spinCover.addClass('spin-off');
        if (this.path) {
          this.state.go('phone');
        }
        else {
          console.error('image generation error');
        }
      })
      .catch(err => {
        console.error('save image to base64 returned an error ', err);
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

}

angular.module('tigerApp')
  .component('art', {
    templateUrl: 'components/art/art.html',
    controller: ArtComponent
  });

})();
