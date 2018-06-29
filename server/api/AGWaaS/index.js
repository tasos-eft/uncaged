'use strict';

var express = require('express');
var controller = require('./AGWaaS.controller');

var router = express.Router();

router.post('/agegate', controller.ageGate);

module.exports = router;
