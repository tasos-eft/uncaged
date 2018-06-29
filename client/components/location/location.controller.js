'use strict';
(function() {

  class LocationComponent {

    constructor($state, GlobalFactory, LocationFactory, $mdDialog) {
      this.state = $state;
      this.GlobalFactory = GlobalFactory;
      this.LocationFactory = LocationFactory;
      this.mdDialog = $mdDialog;
    }

    // The are no pubs nearby. Please choose from the  list of participating pubs.

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
    }

    back() {
      this.state.go('wallet');
    }

    wallet() {
      if (this.WILcoupon) {
        this.state.go('wallet');
      }
      else {
        this.state.go('empty-wallet');
      }
    }

    locatePubsNearBy() {
      this.LocationFactory.getLocation()
      .then( (response) => {
        this.userLocation = response.data.location;
        this.GlobalFactory.storeData('user-location', this.userLocation);
        return this.userLocation;
      })
      .then( (currentLocation) => {
        this.checkProximity( currentLocation );
      })
      .catch( (err) => {
        console.error('geolocation error ', err);
      });
    }

    checkProximity( currentLocation ) {
      // request  => current location + all places
      // response => places (pubs) within 2.5km radius
      var targetCoords = [];
      this.pubs = this.GlobalFactory.retriveData('places');
      if (this.pubs) {
        // add current location first
        targetCoords.push({
          id: '0',
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          description: 'location of the user',
          name: 'current location'
        });
        // then add coords for all pubs1
        angular.forEach(this.pubs, function(value) {
          targetCoords.push({
            id: value.id,
            lat: value.lat,
            lng: value.lng,
            description: value.description,
            name: value.name
          });
        });
      } else {
        console.error('location');
      }

      targetCoords = JSON.stringify(targetCoords);
      this.LocationFactory.sendCoordinates(targetCoords)
        .then( (response) => {
          this.pubsNearBy = response.data;
          this.GlobalFactory.storeData('pubs-nead-by', this.pubsNearBy);
          return this.pubsNearBy;
        })
        .then( (pubs) => {
          this.pubsLocation( pubs );
          this.state.go('pubs', { origin: 'pin'});
        })
        .catch( (err) => {
          console.error('find pubs near by error ', err);
        });
    }

    pubsLocation(pubs) {
      // if ( 0 === pubs.length ) {
      //   this.mdDialog.show(
      //     this.mdDialog.alert()
      //     .parent(angular.element(document.querySelector('#pubs')))
      //     .clickOutsideToClose(true)
      //     .title('no pubs')
      //     .textContent('There are no pubs nearby. Please choose from the list of participating pubs')
      //     .ariaLabel('pubs alert')
      //     .ok('OK')
      //   );
      // }
      this.GlobalFactory.storeData('pubs-nead-by', pubs);
    }

  }

  angular.module('tigerApp')
    .component('location', {
      templateUrl: 'components/location/location.html',
      controller: LocationComponent
    });

})();

/* * * * * * * * * * * * * * * * * * * */
/* hardcoded havas location for testing purposes */
/*
targetCoords.push({
 id: '0',
 lat: '53.347704',
 lng: '-6.259034',
 description: 'location of the user',
 name: 'current location'
});
*/
/* * * * * * * * * * * * * * * * * * * */
