(function() {
  'use strict';

  function AgeGateCtrl($scope, $location, $mdDialog, AGWaaSfactory, GlobalFactory, pagepilingService) {

    var regexD = new RegExp('(0[1-9]|[12][0-9]|3[01])'),
    regexM = new RegExp('^(0?[1-9]|1[012])$'),
    regexY = new RegExp('^([0-9][0-9])$'),
    counter = 0;

    $scope.inputVal = '';

    $scope.msg = '';

    $scope.clr = { id:10, value:'CLR' };
    $scope.del = { id:11, value:'' };

    angular.element( document.querySelector( '#DD' ) ).addClass('active-input');

    function onKeyPressed(data) {
      // clear all input character
      if (data === 'CLR') {
        $scope.inputVal = '';
        counter = 0;
      }
      // clear last number character
      if (data === '') {
        if (counter > 5) {
          counter = 5;
          $scope.inputVal = $scope.inputVal.substring(0, 5);
          $scope.inputVal = $scope.inputVal.slice(0, $scope.inputVal.length - 1);
          counter--;
        }
        else {
          $scope.inputVal = $scope.inputVal.slice(0, $scope.inputVal.length - 1);
          if (counter > 0 ) {
            counter--;
          }
        }
      }
      // numerical inputs
      if ((data !== 'CLR') && (data !== '')) {
        $scope.inputVal += data;
        counter++;
      }
      // set view model
      $scope.day = $scope.inputVal.substring(0, 2);
      $scope.month = $scope.inputVal.substring(2, 4);
      $scope.year = $scope.inputVal.substring(4, 6);
      // check input validation
      $scope.validDay = regexD.test($scope.day);
      $scope.validMonth = regexM.test($scope.month);
      $scope.validYear = regexY.test($scope.year);

      /* highlight input */
      if (counter < 2 ) {
        $scope.focusDD();
      }
      if (counter >= 2 && counter < 4 ) {
        $scope.focusMM();
      }
      if (counter >= 4 ) {
        $scope.focusYY();
      }

      if ($scope.validDay && $scope.validMonth && $scope.validYear) {
        $scope.enter = true;
      }
      else {
        $scope.enter = false;
      }

      // color validation on screen for day and month values (year is always correct)
      if (counter) {
        $scope.validate($scope.day, $scope.month, counter);
      }
      else {
        angular.element( document.querySelector( '#DD' ) ).removeClass('green');
        angular.element( document.querySelector( '#DD' ) ).removeClass('red');
        angular.element( document.querySelector( '#MM' ) ).removeClass('green');
        angular.element( document.querySelector( '#MM' ) ).removeClass('red');
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
      }

      if (6 === counter) {
        if (!$scope.validDay) {
          $scope.msg += 'DD should be between 01-31\n';
        }
        if (!$scope.validMonth) {
          $scope.msg += 'MM should be between 01-12\n';
        }
        if (!$scope.validYear) {
          $scope.msg += 'YY should be between 01-99\n';
        }
        if (false === $scope.enter) {
          $scope.validDateOfBirth($scope.msg);
        }

      }
    };
    // focus
    $scope.focusDD = function () {
      angular.element( document.querySelector( '#DD' ) ).addClass('active-input');
      // remove rest
      angular.element( document.querySelector( '#MM' ) ).removeClass('active-input');
      angular.element( document.querySelector( '#YY' ) ).removeClass('active-input');
    };
    $scope.focusMM = function () {
      angular.element( document.querySelector( '#MM' ) ).addClass('active-input');
      // remove rest
      angular.element( document.querySelector( '#DD' ) ).removeClass('active-input');
      angular.element( document.querySelector( '#YY' ) ).removeClass('active-input');
    };
    $scope.focusYY = function () {
      angular.element( document.querySelector( '#YY' ) ).addClass('active-input');
      // remove rest
      angular.element( document.querySelector( '#MM' ) ).removeClass('active-input');
      angular.element( document.querySelector( '#DD' ) ).removeClass('active-input');
    };
    // valid
    $scope.validate = function (day, month, counter) {
      day = parseInt(day);
      month = parseInt(month);

      switch (counter) {
        case 1:
        angular.element( document.querySelector( '#DD' ) ).removeClass('green');
        angular.element( document.querySelector( '#DD' ) ).removeClass('red');
        angular.element( document.querySelector( '#MM' ) ).removeClass('green');
        angular.element( document.querySelector( '#MM' ) ).removeClass('red');
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
        break;

        case 2:
        if (0 === day || day > 31) {
          angular.element( document.querySelector( '#DD' ) ).addClass('red');
        }
        else {
          angular.element( document.querySelector( '#DD' ) ).addClass('green');
        }
        angular.element( document.querySelector( '#MM' ) ).removeClass('green');
        angular.element( document.querySelector( '#MM' ) ).removeClass('red');
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
        break;

        case 3:
        if (0 === day || day > 31) {
          angular.element( document.querySelector( '#DD' ) ).addClass('red');
        }
        else {
          angular.element( document.querySelector( '#DD' ) ).addClass('green');
        }
        angular.element( document.querySelector( '#MM' ) ).removeClass('red');
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
        break;

        case 4:
        if (0 === day || day > 31) {
          angular.element( document.querySelector( '#DD' ) ).addClass('red');
        }
        else {
          angular.element( document.querySelector( '#DD' ) ).addClass('green');
        }
        if (0 === month || month > 12) {
          angular.element( document.querySelector( '#MM' ) ).addClass('red');
        }
        else {
          angular.element( document.querySelector( '#MM' ) ).addClass('green');
        }
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
        break;

        case 5:
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
        break;

        case 6:
        angular.element( document.querySelector( '#YY' ) ).addClass('green');
        break;

        default:
        angular.element( document.querySelector( '#DD' ) ).removeClass('green');
        angular.element( document.querySelector( '#DD' ) ).removeClass('red');
        angular.element( document.querySelector( '#MM' ) ).removeClass('green');
        angular.element( document.querySelector( '#MM' ) ).removeClass('red');
        angular.element( document.querySelector( '#YY' ) ).removeClass('green');
      }


    };

    $scope.validDateOfBirth = function(msg) {
      var alert = $mdDialog.alert({
        title: 'Age verification failed',
        textContent: 'Please enter your date of birth in the format DD-MM-YY\n' + msg,
        ok: 'OK'
      });
      $mdDialog
        .show( alert )
        .finally( ()=> {
          $scope.inputVal = '';
          counter = 0;
          $scope.msg = '';
          $scope.day = '';
          $scope.month = '';
          $scope.year = '';
          angular.element( document.querySelector( '#DD' ) ).removeClass('green');
          angular.element( document.querySelector( '#DD' ) ).removeClass('red');
          angular.element( document.querySelector( '#MM' ) ).removeClass('green');
          angular.element( document.querySelector( '#MM' ) ).removeClass('red');
          angular.element( document.querySelector( '#YY' ) ).removeClass('green');
          angular.element( document.querySelector( '#DD' ) ).addClass('active-input');
          angular.element( document.querySelector( '#MM' ) ).removeClass('active-input');
          angular.element( document.querySelector( '#YY' ) ).removeClass('active-input');
          alert = undefined;
        });
    };

    $scope.onKeyPressed = onKeyPressed;

    $scope.ageGatePost = function(ev) {
      $scope.age = {};
      if (($scope.year > 0) && ($scope.year <= 16)) {
        $scope.age = {
          BirthDay: $scope.day,
          BirthMonth: $scope.month,
          BirthYear: 20 + $scope.year,
          CodIsoCode: '--',
          CooIsoCode: 'IE'
        };
      } else {
        $scope.age = {
          BirthDay: $scope.day,
          BirthMonth: $scope.month,
          BirthYear: 19 + $scope.year,
          CodIsoCode: '--',
          CooIsoCode: 'IE'
        };
      }
      // send age to heineken's portal
      AGWaaSfactory.postData($scope.age)
      .then(response => {
        $scope.ageVerify = response.data.CodAllowed;
        // store verification in memory for steps controller
        GlobalFactory.setData($scope.ageVerify);
        // set local storage key to remeber that user is legaly verified
        GlobalFactory.storeData('age-verification', $scope.ageVerify);
        return $scope.ageVerify;
      })
      .then( (verif) => {
        // if age is verified, hide again enter button
        if (verif) {
          $scope.enter = false;
          pagepilingService.setAgeGate(verif);
          // set local storage key to remeber that user is legaly verified
          GlobalFactory.storeData('user-dob', JSON.stringify($scope.age) );
          // if user has logged in with facebook before,
          $scope.facebookUser = GlobalFactory.retriveData('facebook-name');
          // skip steps
          if ( $scope.facebookUser ) {
            $location.hash('fblogin');
          }
          else {
            $location.hash('stepone');
          }
        }
        else {
          $scope.enter = true;
          $scope.underaged(ev);
        }
      })
      .catch(error => {
        $scope.ageVerify = error;
        console.error('age gate error ', error);
      });

    };

    $scope.underaged = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#agegate')))
        .clickOutsideToClose(true)
        .title('Age verification failed')
        .textContent('Sorry, you have to be of legal drinking age to enter this site')
        .ariaLabel('Age Gate Alert')
        .ok('OK')
        .targetEvent(ev)
      );
    };

  }

  angular
  .module('tigerApp')
  .controller('AgeGateCtrl',
  ['$scope', '$location', '$mdDialog', 'AGWaaSfactory', 'GlobalFactory', 'pagepilingService',
  AgeGateCtrl]);
})();
