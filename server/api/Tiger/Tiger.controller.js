/**
* Using Rails-like standard naming convention for endpoints.
* GET     /api/Tiger              ->  index
*/

'use strict';

export function generativeArt(req, res) {

  var path = require('path');
  var fs = require('fs');
  // get data
  var data = JSON.parse(req.body.data);
  // get image
  var image = data.base64;
  var base64Data = image.replace(/^data:image\/png;base64,/, "");

  var mkpath = require('mkpath');

  var targetDir = '../img/generative/' + data.folder + '/';

  // var targetDir = 'client/img/generative/' + data.folder + '/';

  mkpath( targetDir, function (err) {
    if (err) throw err;
    console.log('Directory structure created', targetDir);
  });

  mkpath.sync( targetDir, '0755');

  // path for generative art
  var imagePath = targetDir + data.folder + '.gen-art.png';
  // save image to disk
  fs.writeFile(imagePath, base64Data, 'base64',
    function(err){
      if (err) throw err
      console.log('File saved.')
    }
  );
  // return path that image is saved -> base folder + folder:facebook_name + facebook_name.gen-art.png
  var returnImagePath ='img/generative/' + data.folder + '/' + data.folder + '.gen-art.png';
  // return image path
  var jsondata = {
    path: returnImagePath
  };
  res.json(jsondata);
}

export function findPubZone(req, res) {
  // get an array with coords for all pubs
  var allPubs = JSON.parse(req.body.data);

  var zone = 2.5; // set radius to 2.5km
  var center = {};
  var points = [];
  var distance = 0;
  // populate center and points
  allPubs.forEach( function(value, key) {
    if (0 === key) {
      center = value;
    }
    else {
      points.push(value);
    }
  });
  //
  // to check proximity we check if distance from point to center
  // is less than equal to radius e.g.
  // d = sqrt( (Xp -Xc)^2 + (Yp - Yc)^2 )
  //

  // To convert degrees to radian, multiply by (Math.PI / 180)

  var checkProximity = function(cen, pnt) {
    var R = 6371; // km

    var lat1 = cen.lat;
    var lat2 = pnt.lat;
    var lng1 = cen.lng;
    var lng2 = pnt.lng;

    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var Δφ = (lat2-lat1) * (Math.PI / 180);
    var Δλ = (lng2-lng1) * (Math.PI / 180);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    // add  property to each point
    pnt.dist = d;
    //returns distance in km
    return d;
  };
  //
  var pubsInTheZone = [];
  // if distance <= push point to zone
  //
  points.forEach( function(value, key) {
    distance = checkProximity(center, value);
    if ( distance <=  zone) {
      pubsInTheZone.push( value );
    }
  });
  // sort by distance
  pubsInTheZone.sort(function (a, b) {
    if (a.dist > b.dist) {
      return 1;
    }
    if (a.dist < b.dist) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  res.json(pubsInTheZone);
}


/*


Haversine
formula:	a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2( √a, √(1−a) )
d = R ⋅ c
where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
note that angles need to be in radians to pass to trig functions!
JavaScript:
var R = 6371e3; // metres
var φ1 = lat1.toRadians();
var φ2 = lat2.toRadians();
var Δφ = (lat2-lat1).toRadians();
var Δλ = (lng2-lng1).toRadians();

var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
Math.cos(φ1) * Math.cos(φ2) *
Math.sin(Δλ/2) * Math.sin(Δλ/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

var d = R * c;

*/
