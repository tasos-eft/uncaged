/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /https://agwaas.heineken.com/LocationService.svc/v1/IE  ->  index
 */

'use strict';

// Modules
import request from 'request';
import qs from 'querystring';
import https from 'https';

// Application Settings
var setAGWaaS = {};
setAGWaaS.username = 'tigeroriginals';
setAGWaaS.password = 'yGwtxH93uv2r7T9J0T1FcqXja';
setAGWaaS.base = 'agwaas.heineken.com';
setAGWaaS.local = '/LocationService.svc/v1/IE';
setAGWaaS.legal = '/LegalDrinkingAgeService.svc/v1/';

function getACSurl(callback) {
  return request
    .get('https://' + setAGWaaS.base + setAGWaaS.local)
    .on('response', function(res) {
      if (401 === res.statusCode) {
        callback(
          res.headers.acsurl
        );
      }
    })
    .on('error', function(err) {
      console.error('getACSurl error: ', err);
    });
}

function getWrapAccessToken(url, callback) {
  var options = {
    hostname: url,
    path: '/WRAPv0.9/',
    method: 'POST'
  };

  var values = {
    wrap_name: setAGWaaS.username,
    wrap_password: setAGWaaS.password,
    wrap_scope: 'http://agegateway-services.heineken.com'
  };

  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      if (200 === res.statusCode) {
        var token = qs.parse(data.toString('utf8'));
        // format token in order to match Authorization field
        if (token.hasOwnProperty('wrap_access_token')) {
          var header = 'WRAP access_token=\"' + token.wrap_access_token + '\"';
          callback(header);
        }
      } else {
        console.log(400, 'getAcsToken: ACS did not return a valid token');
      }
    });
  });

  req.write(qs.stringify(values));
  req.end();

  req.on('error', function(err) {
    console.error('wrap access token error: ', err);
    //res.send(400, err);
  });

  return req;
}

function legalDrinkingAge(token, jsonDOB, callback) {
  var headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  };
  var options = {
    hostname: setAGWaaS.base,
    path: setAGWaaS.legal,
    headers: headers,
    method: 'POST'
  };

  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      var body = data.toString('utf8');
      if (body) {
        callback(body);
      }
    });
  });
  req.write(jsonDOB);
  req.end();

  req.on('error', function(err) {
    console.error('legalDrinkingAge: ', err);
    callback(err);
  });
}

// Export AGWaaSs data to client
export function ageGate(req, res) {
  if (req.body) {
    var jsonDOB = JSON.stringify(req.body);
    getACSurl(function(url) {
      getWrapAccessToken(url, function(token) {
        legalDrinkingAge(token, jsonDOB, function(response) {
          res.send(response);
        });
      });
    });
  }
}
