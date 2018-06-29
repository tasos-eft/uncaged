/*
* Using Rails-like standard naming convention for endpoints.
* GET   /api/WIL   ->  index
* POST  /api/WIL   ->  index
*/

'use strict';

import request from 'request';

// Application Settings
var setWIL = {};
setWIL.username = 'havas@whereitslive.com';
setWIL.password = 'h@v@s';
// setWIL.base = 'http://staging.whereitslive.com/'
setWIL.base = 'http://whereitslive.com/';
setWIL.token = '5b5b8cedb27e95f0aa1f4a561e805a00';
setWIL.createUserURL = setWIL.base + 'api/v4/heineken/users/create';
setWIL.findUserURL = setWIL.base + 'api/v4/heineken/users/find';
setWIL.checkPinURL = setWIL.base + 'api/v4/heineken/users/verify';
setWIL.sendPinURL = setWIL.base + 'api/v4/heineken/users/send-pin';
setWIL.activeOffersURL = setWIL.base + 'api/v4/heineken/offers/active';
setWIL.whereToRedeemURL = setWIL.base + 'api/v4/heineken/rothco/where-to-redeem';
setWIL.issueCouponURL = setWIL.base + 'api/v4/heineken/users/issue-coupon';
setWIL.redeemCouponURL = setWIL.base + 'api/v4/heineken/wallet/redeem';
setWIL.checkCouponsURL = setWIL.base + 'api/v4/heineken/wallet/coupons';
setWIL.canRedeemURL = setWIL.base + 'api/v4/heineken/rothco/check-user';
setWIL.getPintsURL = setWIL.base + 'api/v4/heineken/offers/get';

// all requests (req) come from angular client WILfactory.service.js
// all responses (res) are consumed by the same service.

// calls to external WIL API is initilized by the client after a successful post

// CREATE USER
export function createUser(req, res) {
  var user = JSON.parse(req.body.data);
  var createJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'user': {
        'phone': user.phone,
        'fullname': user.fullname
      }
    }
  };
  if (req.body) {
    console.log('create user', createJson);
    request({
      url: setWIL.createUserURL,
      method: 'POST',
      json: createJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('create user error: ', error);
      }
      if (body) {
        console.log('create user', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// FIND USER
export function findUser(req, res) {
  var userData = JSON.parse(req.body.data);
  var findJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'user': {
        'phone': userData.phone
      }
    }
  };
  if (req.body) {
    console.log('find user', findJson);
    request({
      url: setWIL.findUserURL,
      method: 'POST',
      json: findJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('find user error: ', error);
      }
      if (body) {
        console.log('find user', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// CHECK PIN
export function checkPIN(req, res) {
  var pinData = JSON.parse(req.body.data);
  var pinJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'user': {
        'phone': pinData.phone,
        'pin': pinData.pin
      }
    }
  };
  if (req.body) {
    console.log('PIN', pinJson);
    request({
      url: setWIL.checkPinURL,
      method: 'POST',
      json: pinJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('find user error: ', error);
      }
      if (body) {
        console.log('PIN', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// SEND PIN
export function sendPIN(req, res) {
  var pinData = JSON.parse(req.body.data);
  var pinJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'user': {
        'phone': pinData.phone
      }
    }
  };
  if (req.body) {
    console.log('PIN', pinJson);
    request({
      url: setWIL.sendPinURL,
      method: 'POST',
      json: pinJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('find user error: ', error);
      }
      if (body) {
        console.log('PIN', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// ACTIVE OFFERS
export function activeOffers(req, res) {
  var offersJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      }
    }
  };
  if (req.body) {
    console.log('offers', offersJson);
    request({
      url: setWIL.activeOffersURL,
      method: 'POST',
      json: offersJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('active offers error: ', error);
      }
      if (body) {
        console.log('offers', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// WHERE TO REDEEM
export function whereToRedeem(req, res) {
  var offer = JSON.parse(req.body.data);
  var whereTo = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'offer': {
        'id': offer.offerID
      }
    }
  };
  if (req.body) {
    console.log('pubs', whereTo);
    request({
      url: setWIL.whereToRedeemURL,
      method: 'POST',
      json: whereTo
    },
    function(error, response, body) {
      if (error) {
        return console.error('where to redeem error: ', error);
      }
      if (body) {
        console.log('pubs', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// ISSUE COUPON
export function issueCoupon(req, res) {
  var couponData = JSON.parse(req.body.data);
  var issueJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'offer': {
        'id': couponData.offerID
      },
      'user': {
        'id': couponData.userID
      }
    }
  };
  if (req.body) {
    console.log('issue coupon', issueJson);
    request({
      url: setWIL.issueCouponURL,
      method: 'POST',
      json: issueJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('issue coupon error: ', error);
      }
      if (body) {
        console.log('issue coupon', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// REDEEM COUPON
export function redeemCoupon(req, res) {
  var redeemData = JSON.parse(req.body.data);
  var redeemJson = {
    'request': {
      'token': {
        'hash': redeemData.userToken
      },
      'coupon': {
        'code': redeemData.couponCode
      },
      'place': {
        'id': redeemData.placeID
      }
    }
  };
  if (req.body) {
    console.log('redeem coupon', redeemJson);
    request({
      url: setWIL.redeemCouponURL,
      method: 'POST',
      json: redeemJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('redeem coupon error: ', error);
      }
      if (body) {
        console.log('redeem coupon', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// CHECK COUPON
export function checkCoupon(req, res) {
  var checkData = JSON.parse(req.body.data);
  var checkJson = {
    'request': {
      'token': {
        'hash': checkData.userToken
      }
    }
  };
  if (req.body) {
    console.log('check coupon', checkJson);
    request({
      url: setWIL.checkCouponsURL,
      method: 'POST',
      json: checkJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('check coupon error: ', error);
      }
      if (body) {
        console.log('check coupon', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}

// CAN USER REDEEM A COUPON?
export function canRedeem(req, res) {
  var canUser = JSON.parse(req.body.data);
  var canJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'user': {
        'phone': canUser.phone
      },
      'offer': {
        'id': 219
      }
    }
  };
  if (req.body) {
    console.log('can redeem', canJson);
    request({
      url: setWIL.canRedeemURL,
      method: 'POST',
      json: canJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('can redeem error: ', error);
      }
      if (body) {
        console.log('can redeem', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}


// GET PINTS
export function getPints(req, res) {
  var pintsJson = {
    'request': {
      'token': {
        'hash': setWIL.token
      },
      'offer': {
        'id': 219
      }
    }
  };
  if (req.body) {
    console.log('offers', pintsJson);
    request({
      url: setWIL.getPintsURL,
      method: 'POST',
      json: pintsJson
    },
    function(error, response, body) {
      if (error) {
        return console.error('get offers error: ', error);
      }
      if (body) {
        console.log('pints', body.response);
        res.json(body.response);
      }
    })
    .auth(setWIL.username, setWIL.password, false);
  }
}
