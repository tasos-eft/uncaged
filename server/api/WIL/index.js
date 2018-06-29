'use strict';

var express = require('express');
var controller = require('./WIL.controller');

var router = express.Router();

router.post('/create', controller.createUser);
router.post('/find', controller.findUser);
router.post('/pin', controller.checkPIN);
router.post('/sms', controller.sendPIN);
router.post('/where', controller.whereToRedeem);
router.post('/offers', controller.activeOffers);
router.post('/coupons', controller.issueCoupon);
router.post('/redeem', controller.redeemCoupon);
router.post('/check', controller.checkCoupon);
router.post('/check-user', controller.canRedeem);
router.post('/pints', controller.getPints);

module.exports = router;
