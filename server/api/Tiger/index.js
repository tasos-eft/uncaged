'use strict';

var express = require('express');
var controller = require('./Tiger.controller');

var router = express.Router();

router.post('/art', controller.generativeArt);
router.post('/location', controller.findPubZone);

module.exports = router;
