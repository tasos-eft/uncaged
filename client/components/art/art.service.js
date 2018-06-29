'use strict';

angular.module('tigerApp')
  .factory('GenApp', function($http) {
    /* generative art factory */
    var GenApp = {};

    var _p5 = {};

    // <div id="p5_loading" style="position: absolute;">Loading...</div>

    GenApp = {

        _appVersion: 'ALPHA 023',
        _testing: false,
        _configJSON: [],
        _p5: null,
        _mode: 'composer',
        _container: null,
        _completeCallbackCalled: false,
        _completeCallback: null,

        _uisettings: null,

        debug: function(message) {
          if (this._testing) {
            // console.log(message)
          };
        },

        // init

        init: function(container, configJSON, completeCallback, testing) { // configJSON, testing
          this._container = container;
          this._configJSON = JSON.parse(configJSON);
          this._completeCallback = completeCallback;
          this._testing = testing;
          this._mode = this._configJSON.params.mode;
          this.debug('App.init, waiting for Document load');
          this.debug('Renderer Mode: ' + this._mode);

          // init view
          // this.initView();
          // wait for load
          this.wait();


        },

        wait: function() {

          $(document).ready(function() {
            GenApp.debug('Document Loaded')
            GenApp.start();
          });

        },


        // application runs here once doc loaded
        start: function() {
          this.debug('App Ver: ' + this._appVersion);

          var containerW = this._container.width();
          var containerH = this._container.height();

          // p5
          this.initP5(containerW, containerH);
          _p5.setParams(GenApp._configJSON.params);

        },

        // uiChange: function() {
        //   GenApp._configJSON.params.dob_yyyy = this._uisettings.dob_yyyy;
        //   GenApp._configJSON.params.x = this._uisettings.x;
        //   GenApp._configJSON.params.y = this._uisettings.y;
        //   GenApp._configJSON.params.z = this._uisettings.z;
        //
        //   _p5.setParams(GenApp._configJSON.params);
        // },


        // p5 methods

        initP5: function(p5w, p5h) {

          var sketch = function(p) {

            //assets
            var ltr_sprites = [];
            var bg_imgs = [];
            var zodiac_imgs = [];
            var fontRegular;
            var overbrand_x;
            var overbrand;

            var _paramChange = true;

            // var _params = [];
            /* loading parameters up of front */
            var _params = GenApp._configJSON.params;

            var _bgImage;
            var _fullname = [];
            var _zodiac;
            var _alphabet = 'abcdefghijklmnopqrstuvwxyz';
            var _alphaValues = [];
            var _alphaLength = 26;
            var _dateValues = [];
            var _x = 0;
            var _y = 0;
            var _z = 1;

            var frameWidth = p5w;
            var frameHeight = p5h;
            var criticalDimension = Math.min(p5w, p5h);
            var artworkCriticalDimension = 1024;
            var artworkTextTop = 75; // px position at original artwork dimensions
            var artworkTextRight = 45; // px position at original artwork dimensions
            var artworkGlobalScaling = criticalDimension / artworkCriticalDimension;


            var fr = 30; // framerate

            var maxPatternSteps = 30;
            var patternsSteps = p.floor(maxPatternSteps * _z);
            var patternStep = 0;
            var patternProgress = 0.0;

            var initParams = false;
            var autorun = true;

            var touchTrack = false;
            var touchLastX = 0;

            var isNight = false;
            var totalSprites = 68;
            var spriteSelection = [];

            var totalBGs = 10;

            p.setParams = function(params) {
              _params = params;
              _paramChange = true;
            };

            p.init = function() {

              // create lookup array of base alphabet values
              p.setAlphaValues();

            };

            p.processParams = function() {

              if (_paramChange) { // only if params have changed

                if (initParams) { // not first update, switch off autorun
                  autorun = false;
                }


                // modify, type or handle input params here
                if (!initParams) { // IS first update, switch off autorun
                  _x = 0;
                } else {
                  _x = p.float(_params.x);
                }

                _y = p.float(_params.y);
                _z = p.float(_params.z);

                // process dob dates
                var yearNow = new Date().getFullYear();
                _dateValues['day'] = {
                  dd: _params.dob_dd,
                  norm: p.constrain((_params.dob_dd / 31), 0, 1)
                };
                _dateValues['month'] = {
                  mm: _params.dob_mm,
                  norm: p.constrain((_params.dob_mm / 12), 0, 1)
                };
                _dateValues['year'] = {
                  yyyy: _params.dob_yyyy,
                  norm: p.constrain(((yearNow - _params.dob_yyyy) / 100), 0, 1)
                };

                // toggel off _paramChange
                _paramChange = false;

                //switch 'initParams' so we know first update is done.
                initParams = true;
              }

            };

            p.setAlphaValues = function() {

              // create lookup array of base alphabet values
              for (var i = 0, len = _alphabet.length; i < len; i++) {
                _alphaValues[_alphabet.charAt(i)] = ((i + 1) / _alphaLength);
              }

              // append other character exceptions to lookup
              _alphaValues['-'] = 0;
              _alphaValues['à'] = _alphaValues['a'];
              _alphaValues['ä'] = _alphaValues['a'];
              _alphaValues['é'] = _alphaValues['e'];
              _alphaValues['ö'] = _alphaValues['o'];
              _alphaValues['ü'] = _alphaValues['u'];

            };

            p.cleanFullname = function() {
              var cleanedFullname = _params.fullname.toLowerCase().replace(/ /g, '');
              _fullname = []; // clear array (as constant updates)

              for (var i = 0, len = cleanedFullname.length; i < len; i++) {
                var thisChar = cleanedFullname.charAt(i);
                if (_alphaValues[thisChar]) {
                  _fullname.push({
                    letter: thisChar,
                    norm: _alphaValues[thisChar]
                  });
                }
              }
            };

            p.preload = function() {

              p.preloadSetup();

              // night/day path
              var nightDayPath;
              if (isNight == true) {
                nightDayPath = 'night';
              }
              else {
                nightDayPath = 'day';
              }

              GenApp.debug('Night/Day: ' + nightDayPath);

              // load shortlisted sprites for this user

              for (var s = 0; s < spriteSelection.length; s++) {
                ltr_sprites[s] = p.loadImage('img/sprites/letters/' + nightDayPath + '/png/icon-' + spriteSelection[s] + '.png');
              }

              // load selected bg for this user
              bg_imgs[0] = p.loadImage('img/bgs/' + nightDayPath + '/png/bg-' + _bgImage + '.png');

              //zodiac
              zodiac_imgs[0] = p.loadImage('img/sprites/zodiac/png/' + _zodiac + '.png');

              // fonts
              fontRegular = p.loadFont('assets/fonts/Montserrat-Regular.ttf');

              // branding
              overbrand = p.loadImage('assets/images/branding/overbrand.png');

            };

            p.preloadSetup = function() {
              // night / day
              var h = p.float(_params.hour);
              var n = p.float(_params.startNight);
              var d = p.float(_params.startDay);

              // default
              isNight = false;
              if ((h >= n) || (h < d)) {
                isNight = true;
              }

              // set alphavalues
              p.setAlphaValues();

              // process fullname into array
              p.cleanFullname();

              // get letter sprites for each letter in name, from range, offset by random start, seeded by 'hour'
              p.randomSeed(h * 1000);
              var deterministicOffset = p.floor(p.random(0, totalSprites));

              GenApp.debug('First Letter Offset: ' + deterministicOffset);

              for (var l = 0; l < _fullname.length; l++) {
                var letterVal = p.floor(p.map(_fullname[l].norm, 0, 1, 1, _alphaLength));
                var offsetSpriteID = p.getIndexFromOffsetRange(deterministicOffset, totalSprites, letterVal);

                // log offsetSpriteID against name letter
                _fullname[l].spriteID = offsetSpriteID;

                var addToSpriteSelection = true;
                // check against spriteSelection array (have we had 'a') before, if so don't add it to list for loading
                for (var s = 0; s < spriteSelection.length; s++) {
                  if (spriteSelection[s] == offsetSpriteID) {
                    addToSpriteSelection = false;
                    // log position in loaded asset index
                    _fullname[l].spriteAssetIndex = s;
                    break;
                  }
                }

                // add to sprite selection if new
                if (addToSpriteSelection == true) {
                  spriteSelection.push(offsetSpriteID);
                  // log position in loaded asset index
                  _fullname[l].spriteAssetIndex = spriteSelection.length - 1;
                }
              }

              // bg selection
              var deterministicBGOffset = p.floor(p.random(0, totalBGs));
              _bgImage = p.getIndexFromOffsetRange(deterministicBGOffset, totalBGs, 0) + 1;
              GenApp.debug('BG: ' + _bgImage);

              // zodiac selection (direct from param)
              _zodiac = p.constrain(_params.zodiac, 0, 12);
              GenApp.debug('Zodiac: ' + _zodiac);

            }

            p.setup = function() {

              p.frameRate(fr)
              p.imageMode(p.CENTER);
              p.init();
              p.createCanvas(frameWidth, frameHeight);
              p.background(20);

            };

            p.draw = function() {
              p.processParams();
              p.background(20);
              p.drawState();
            };



            p.touchMoved = function() {
              if (p.touchX > touchLastX) {
                _y = p.constrain(_y + 0.035, -1, 1);
              } else if (p.touchX < touchLastX) {
                _y = p.constrain(_y - 0.035, -1, 1)
              }

              touchLastX = p.touchX;

              // prevent default
              return false;
            }


            p.drawState = function() {

              //bg
              p.drawBGImage(0);

              // complexity
              patternsSteps = p.constrain(_z, 0.1, 1) * maxPatternSteps;

              if (autorun) {
                if (_x < 1) {
                  _x += 0.025;
                }
              }

              // listen for completion
              if (_x >= 1) {
                if (!GenApp._completeCallbackCalled) {
                  /* call back */
                  GenApp._completeCallback();
                  GenApp._completeCallbackCalled = true;
                }
              }

              patternProgress = _x;
              patternStep = p.floor(patternsSteps * patternProgress);

              // rotation
              var maxPatternRotationAngle = (p.PI / 2) * _y; // total pattern rotation
              var patternStepRotationAngle = maxPatternRotationAngle / patternsSteps;

              // draw pattern (upto current step)
              for (var s = 0; s < patternStep; s++) {

                var patternGrowth = (s + 1) / patternsSteps;
                var rotationAngle = (s + 1) * patternStepRotationAngle;

                p.lineShapes(patternGrowth, rotationAngle);

                if (_zodiac > 0) {
                  p.zodiacShapes(patternGrowth, rotationAngle);
                }

              }


              p.drawText();
              p.drawOverbrand();


            };


            p.lineShapes = function(patternGrowth, rotationAngle) {

              // variable points on evenly spaced ellipses based on letterNorm*maxPoints

              var fullNameLen = _fullname.length
              var centerX = p.width / 2;
              var centerY = p.height / 2;
              var maxPoints = 15;
              var maxRadius = ((criticalDimension / 3) - (criticalDimension / (fullNameLen * 2))) * p.easeOutSine(patternGrowth);
              var point = 0;

              var maxPointSize = p.map(_dateValues['year'].norm, 0, 1, (criticalDimension / 16), (criticalDimension / 6)); // age norm mapped to size range
              var startAngle = (p.TWO_PI * 0.75);
              var centerOffset = (maxRadius / fullNameLen);
              var segments = 1;
              var segmentRadians = (p.TWO_PI / segments);


              for (var seg = 0; seg < segments; seg = seg + 1) {

                var segmentStart = startAngle + (segmentRadians * seg);

                // loop backwards through name
                for (var l = fullNameLen - 1; l >= 0; l--) {
                  var elRad = (maxRadius / fullNameLen + 1) * (l + 2);
                  var elPoints = p.ceil(maxPoints * _fullname[l].norm);
                  var radianIncrement = (p.TWO_PI / segments) / elPoints;

                  // position points from center
                  for (point = 0; point < elPoints; point++) {

                    var nextAngle = rotationAngle + (segmentStart + (point * radianIncrement));
                    var nextX = centerX + (elRad * p.cos(nextAngle));
                    var nextY = centerY + (elRad * p.sin(nextAngle));

                    //var pointSize = ((maxPointSize) * _fullname[l].norm) * p.easeInSine(patternGrowth); // linear point size = small 'a'.
                    var pointSize = p.map(_fullname[l].norm, 0, 1, (maxPointSize / (fullNameLen / 2)), maxPointSize) * p.easeInSine(patternGrowth); // mapped to top half of siz range




                    p.sprite(p.letterSprite(l), nextX, nextY, pointSize, pointSize, nextAngle + (p.PI / 2), _params.color_bg, 0);
                  }

                }

              }

            }


            p.zodiacShapes = function(patternGrowth, rotationAngle) {

              var fullNameLen = _fullname.length
              var centerX = p.width / 2;
              var centerY = p.height / 2;
              var maxPoints = 12;
              var maxRadius = ((criticalDimension / 2.8) - (criticalDimension / (fullNameLen * 2))) * p.easeOutSine(patternGrowth);
              var point = 0;

              var maxPointSize = criticalDimension / 10;
              var startAngle = (p.TWO_PI * 0.75);
              var centerOffset = (maxRadius / fullNameLen);
              var segments = 1;
              var segmentRadians = (p.TWO_PI / segments);


              for (var seg = 0; seg < segments; seg = seg + 1) {

                var segmentStart = startAngle + (segmentRadians * seg);

                // one loop for zodiac inner circle
                for (var l = 0; l >= 0; l--) {
                  var elRad = (maxRadius / fullNameLen + 1) * (l + 1);
                  var elPoints = 12;
                  var radianIncrement = (p.TWO_PI / segments) / elPoints;

                  // position points from center
                  for (point = 0; point < elPoints; point++) {

                    var nextAngle = rotationAngle + (segmentStart + (point * radianIncrement));
                    var nextX = centerX + (elRad * p.cos(nextAngle));
                    var nextY = centerY + (elRad * p.sin(nextAngle));
                    var pointSize = maxPointSize * p.easeInSine(patternGrowth);

                    p.sprite(p.zodiacSprite(_zodiac), nextX, nextY, pointSize, pointSize, nextAngle + (p.PI / 2), _params.color_bg, 0);
                  }

                }

              }

            }

            // utilities

            // easing based on : https://gist.github.com/cocopon/1ec025bcffb3fd7995db

            p.easeOutSine = function(t) {
              return p.sin(t * (p.PI / 2));
            }

            p.easeInSine = function(t) {
              return -p.cos(t * (p.PI / 2)) + 1.0;
            }

            p.easeOutQuart = function(t) {
              --t;
              return 1.0 - t * t * t * t;
            }

            p.easeInQuart = function(t) {
              return t * t * t * t;
            }

            p.easeInOutQuart = function(t) {
              t *= 2;
              if (t < 1) {
                return 0.5 * t * t * t * t;
              }
              t -= 2;
              return -0.5 * (t * t * t * t - 2);
            }

            // draw utilities

            p.letterSprite = function(l) {
              var spriteIndex = _fullname[l].spriteAssetIndex;
              return ltr_sprites[spriteIndex];
            }

            p.zodiacSprite = function(zID) {
              return zodiac_imgs[0];
            }

            p.sprite = function(img, x, y, w, h, r, c, a) {
              p.translate(x, y);
              p.rotate(r);
              //p.tint(p.wAlpha(c, a));
              p.image(img, 0, 0, w, h);
              p.rotate(-r);
              p.translate(-x, -y);
            }




            p.drawBGImage = function() {
              p.image(bg_imgs[0], p.width / 2, p.height / 2, p.width, p.height);
            }

            p.drawOverbrand = function() {
              var headPad = p.height * 0.03; // 3% of canvas height
              var headerHeight = p.height * 0.08; // 8% of canvas height
              p.image(overbrand, (p.width / 2), (p.height / 2), criticalDimension, criticalDimension);
            }

            p.drawText = function() {
              var textPositionV = ((p.height - criticalDimension) / 2) + (artworkTextTop * artworkGlobalScaling);
              var textPositionH = (p.width / 2) - (artworkTextRight * artworkGlobalScaling);

              p.fill(255)
              p.strokeWeight(0)
              p.textSize(22 * artworkGlobalScaling);
              p.textAlign(p.RIGHT, p.CENTER);
              p.textFont(fontRegular);
              p.text(_params.fullname.toUpperCase(), textPositionH, textPositionV);
            }

            // add alpha channel to solid color
            p.wAlpha = function(c, a) {
              var col = p.color(c);
              return p.color('rgba(' + [p.red(col), p.green(col), p.blue(col), a].join(',') + ')');
            }

            // get offset value from circular range
            p.getIndexFromOffsetRange = function(offset, rangeMax, i) {
              var offsetIndex = offset + i;
              if (offsetIndex <= rangeMax) {
                return offsetIndex;
              } else {
                return offsetIndex % rangeMax;
              }
            }


          };

          _p5 = new p5(sketch, 'genAppContanier');
        }

    }

    GenApp.saveBase64 = function(data) {
      return $http({
        method: 'POST',
        url: '/api/Tiger/art',
        contentType: false,
        processData: false,
        contentType: "application/json; charset=utf-8",
        data: {
          data
        }
      });
    };

    // Expose Service
    return GenApp;

  });
