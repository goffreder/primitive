/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _shapes = __webpack_require__(1);

	var _utils = __webpack_require__(2);

	var _ui = __webpack_require__(3);

	(function () {
	    var baseColors = {};
	    var shapeCount = 0;

	    var analyzeImage = function analyzeImage() {
	        var oc = document.getElementById('sourceCanvas');
	        var octx = oc.getContext('2d');
	        var tc = document.getElementById('targetCanvas');
	        var tctx = tc.getContext('2d');

	        var w = oc.clientWidth;
	        var h = oc.clientHeight;

	        var octxImageData = octx.getImageData(0, 0, w, h);

	        var minFrequency = document.getElementById('minFrequency').value;

	        var _getColorAnalysis = (0, _utils.getColorAnalysis)(octxImageData, minFrequency);

	        var meanColor = _getColorAnalysis.meanColor;
	        var colors = _getColorAnalysis.colors;

	        var mostSimilarColor = (0, _utils.getMostSimilarColor)(octxImageData, meanColor, (0, _utils.getImageSimilarityToColor)(octxImageData, meanColor));
	        var mostSimilarColorHex = (0, _utils.getColorHex)(mostSimilarColor.r, mostSimilarColor.g, mostSimilarColor.b);

	        tc.width = w;
	        tc.height = h;

	        tctx.fillStyle = mostSimilarColorHex;
	        tctx.fillRect(0, 0, w, h);

	        var tctxImageData = tctx.getImageData(0, 0, w, h);

	        var sim = (0, _utils.getImageSimilarityToColor)(octxImageData, mostSimilarColor);
	        var simPerc = sim * 100 / Math.sqrt(255 * 255 * 3 * octxImageData.data.length);

	        (0, _ui.setInfoDiv)(mostSimilarColorHex, sim, simPerc);

	        baseColors = colors;
	        shapeCount = 0;
	    };

	    var drawRandomShape = function drawRandomShape(colors, shapeType) {
	        var colorObj = colors[Math.floor(Math.random() * colors.length)];
	        var color = Object.keys(colorObj)[0];

	        var shape = null;

	        var alpha = document.getElementById('opacity').value;

	        var oc = document.getElementById('sourceCanvas');
	        var octx = oc.getContext('2d');
	        var tc = document.getElementById('targetCanvas');
	        var tctx = tc.getContext('2d');
	        var ac = document.getElementById('auxCanvas');
	        var actx = ac.getContext('2d');
	        var w = tc.clientWidth;
	        var h = tc.clientHeight;

	        ac.width = w;
	        ac.height = h;

	        actx.drawImage(tc, 0, 0);

	        switch (shapeType) {
	            case 'rectangle':
	                (0, _shapes.drawRectangle)(color, actx, w, h, alpha);
	                break;
	            case 'triangle':
	                (0, _shapes.drawTriangle)(color, actx, w, h, alpha);
	                break;
	        }

	        var curSimilarity = (0, _utils.getImagesSimilarity)(octx.getImageData(0, 0, w, h), tctx.getImageData(0, 0, w, h));
	        var newSimilarity = (0, _utils.getImagesSimilarity)(octx.getImageData(0, 0, w, h), actx.getImageData(0, 0, w, h));

	        if (newSimilarity < curSimilarity) {
	            tctx.drawImage(ac, 0, 0);
	            (0, _ui.addNewSimilarityInfo)(newSimilarity, ++shapeCount);
	        }

	        return newSimilarity;
	    };

	    this.setup = function () {
	        var img = document.getElementById('image');
	        var w = img.clientWidth;
	        var h = img.clientHeight;

	        var oc = document.getElementById('sourceCanvas');
	        var octx = oc.getContext('2d');

	        oc.width = w;
	        oc.height = h;

	        octx.drawImage(img, 0, 0);

	        var button = document.getElementById('startAnalysis');
	        button.addEventListener('click', function () {
	            return analyzeImage();
	        });

	        button = document.getElementById('startProcess');
	        button.addEventListener('click', function () {
	            var shape = document.getElementById('shapeSelector').value;
	            var startTime = Date.now();
	            var sim = drawRandomShape(baseColors, shape);

	            var interval = setInterval(function () {
	                sim = drawRandomShape(baseColors, shape);

	                if (sim < document.getElementById('minSimilarity').value) {
	                    clearInterval(interval);

	                    var infoDiv = document.getElementById('info');
	                    var timeDiv = document.createElement('div');
	                    timeDiv.textContent = 'Total time: ' + (Date.now() - startTime) / 1000 + 's';

	                    infoDiv.appendChild(timeDiv);
	                }
	            }, 1);
	        });
	    };
	}).bind(window)();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.drawRectangle = drawRectangle;
	exports.drawTriangle = drawTriangle;

	var _randomJs = __webpack_require__(4);

	var _randomJs2 = _interopRequireDefault(_randomJs);

	var _utils = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var floor = Math.floor;
	var max = Math.max;
	var sqrt = Math.sqrt;
	var pow = Math.pow;
	var acos = Math.acos;


	var random = (0, _randomJs2.default)(_randomJs2.default.engines.browserCrypto);

	function drawRectangle(color, ctx, w, h, alpha) {
	    var x = random() * w;
	    var y = random() * h;

	    var sw = random() * (w - x);
	    var sh = random() * (h - y);

	    ctx.globalAlpha = alpha;
	    ctx.fillStyle = color;
	    ctx.fillRect(x, y, sw, sh);
	};

	function drawTriangle(color, ctx, w, h, alpha) {
	    var shape = {
	        a: {
	            x: random.real(0, w, true),
	            y: random.real(0, h, true)
	        },
	        b: {
	            x: random.real(0, w, true),
	            y: random.real(0, h, true)
	        },
	        c: {
	            x: random.real(0, w, true),
	            y: random.real(0, h, true)
	        }
	    };

	    if (valid(shape)) {
	        ctx.beginPath();
	        ctx.moveTo(shape.a.x, shape.a.y);
	        ctx.lineTo(shape.b.x, shape.b.y);
	        ctx.lineTo(shape.c.x, shape.c.y);

	        ctx.globalAlpha = alpha;
	        ctx.fillStyle = color;
	        ctx.fill();
	    }
	};

	function getPointsDistance(a, b) {
	    var deltaX = b.x - a.x;
	    var deltaY = b.y - a.y;

	    return sqrt(deltaX * deltaX + deltaY * deltaY);
	}

	function getAngleFromSides(AB, AC, BC) {
	    return acos((0, _utils.clampInt)((AC * AC + BC * BC - AB * AB) / (2 * AC * BC), -1, 1)) * 180 / Math.PI;
	}

	function valid(shape) {
	    var minAngle = 15;

	    var AB = getPointsDistance(shape.a, shape.b);
	    var AC = getPointsDistance(shape.a, shape.c);
	    var BC = getPointsDistance(shape.b, shape.c);

	    var first = getAngleFromSides(AB, AC, BC);

	    if (first < minAngle) {
	        return false;
	    }

	    var second = getAngleFromSides(AC, AB, BC);

	    if (second < minAngle) {
	        return false;
	    }

	    if (180 - first - second < minAngle) {
	        return false;
	    }

	    return true;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getColorHex = getColorHex;
	exports.getColorAnalysis = getColorAnalysis;
	exports.getImageSimilarityToColor = getImageSimilarityToColor;
	exports.getMostSimilarColor = getMostSimilarColor;
	exports.getImagesSimilarity = getImagesSimilarity;
	exports.clampInt = clampInt;
	function getColorHex(r, g, b) {
	    var hr = r.toString(16);
	    var hg = g.toString(16);
	    var hb = b.toString(16);

	    hr.length === 1 && (hr = '0' + hr);
	    hg.length === 1 && (hg = '0' + hg);
	    hb.length === 1 && (hb = '0' + hb);

	    return ['#', hr, hg, hb].join('');
	};

	function getColorAnalysis(imgData) {
	    var minFrequency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	    var pxNum = imgData.data.length / 4;
	    var meanColor = { r: 0, g: 0, b: 0, a: 255 };
	    var r,
	        g,
	        b,
	        colors = {};

	    imgData.data.forEach(function (v, i) {
	        switch (i % 4) {
	            case 0:
	                r = v;
	                meanColor.r += v;
	                break;
	            case 1:
	                g = v;
	                meanColor.g += v;
	                break;
	            case 2:
	                b = v;
	                meanColor.b += v;
	                break;
	            case 3:
	                var hexColor = getColorHex(r, g, b);

	                if (colors[hexColor] === undefined) {
	                    colors[hexColor] = 0;
	                }

	                colors[hexColor]++;
	                break;
	        }
	    });

	    meanColor.r = ~~(meanColor.r / pxNum);
	    meanColor.g = ~~(meanColor.g / pxNum);
	    meanColor.b = ~~(meanColor.b / pxNum);

	    var colors = Object.keys(colors).map(function (c) {
	        var color = {};
	        color[c] = colors[c];
	        return color;
	    });

	    if (minFrequency > 0) {
	        colors = colors.filter(function (c) {
	            return c[Object.keys(c)[0]] >= minFrequency;
	        });
	    }

	    colors = colors.sort(function (a, b) {
	        return b[Object.keys(b)[0]] - a[Object.keys(a)[0]];
	    });

	    return {
	        colors: colors,
	        meanColor: meanColor
	    };
	};

	function getImageSimilarityToColor(imgData, color) {
	    var da = imgData.data;

	    var delta = 0;
	    var sum = 0;

	    for (var i = 0; i < da.length; i++) {
	        switch (i % 4) {
	            case 0:
	                delta = da[i] - color.r;
	                sum += delta * delta;
	                break;
	            case 1:
	                delta = da[i] - color.g;
	                sum += delta * delta;
	                break;
	            case 2:
	                delta = da[i] - color.b;
	                sum += delta * delta;
	                break;
	            case 3:
	                break;
	        }
	    }

	    return Math.sqrt(sum);
	};

	function getMostSimilarColor(imgData, baseColor, baseSimilarity) {
	    if (baseSimilarity === 0) {
	        return baseColor;
	    }

	    var delta = 5;
	    var minSimilarity = baseSimilarity;
	    var bestColor = baseColor;

	    for (var r = Math.max(baseColor.r - delta, 0); r < Math.min(baseColor.r + delta, 256); r++) {
	        for (var g = Math.max(baseColor.g - delta, 0); g < Math.min(baseColor.g + delta, 256); g++) {
	            for (var b = Math.max(baseColor.b - delta, 0); b < Math.min(baseColor.b + delta, 256); b++) {
	                var color = { r: r, g: g, b: b };
	                var sim = getImageSimilarityToColor(imgData, color);

	                if (sim < minSimilarity) {
	                    minSimilarity = sim;
	                    bestColor = color;
	                }
	            }
	        }
	    }

	    return bestColor;
	};

	function getImagesSimilarity(imgDataA, imgDataB) {
	    var da = imgDataA.data;
	    var db = imgDataB.data;

	    var delta = 0;
	    var sum = 0;

	    if (da.length !== db.length) {
	        throw new Error('ImageData not valid');
	    }

	    for (var i = 0; i < da.length; i++) {
	        switch (i % 4) {
	            case 0:
	            case 1:
	            case 2:
	                delta = da[i] - db[i];
	                sum += delta * delta;
	                break;
	            case 3:
	                break;
	        }
	    }

	    return Math.sqrt(sum);
	};

	function clampInt(x, lo, hi) {
	    return x < lo ? lo : x > hi ? hi : x;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addNewSimilarityInfo = addNewSimilarityInfo;
	exports.setInfoDiv = setInfoDiv;
	function addNewSimilarityInfo(similarity, count) {
	    var newSimDiv = document.getElementById('newSim');

	    newSimDiv.textContent = 'New similarity: ' + similarity;

	    var shapeCountDiv = document.getElementById('shapeCount');

	    shapeCountDiv.textContent = 'Shape count: ' + count;
	};

	function setInfoDiv(mainColor, mainSimilarity, simPerc) {
	    var infoDiv = document.getElementById('info');
	    infoDiv.innerHTML = '';

	    var colorDiv = document.createElement('div');
	    var colorSpan = document.createElement('span');
	    colorSpan.textContent = mainColor;
	    colorSpan.style.color = mainColor;

	    colorDiv.textContent = 'Main color: ';
	    colorDiv.id = 'mainColor';
	    colorDiv.appendChild(colorSpan);

	    infoDiv.appendChild(colorDiv);

	    var mainSimDiv = document.createElement('div');
	    var mainSimSpan = document.createElement('span');
	    mainSimSpan.textContent = Math.round(mainSimilarity * 100) / 100 + " (" + Math.round(simPerc * 100) / 100 + "%)";

	    mainSimDiv.textContent = 'Main color similarity: ';
	    colorDiv.id = 'mainSimilarity';
	    mainSimDiv.appendChild(mainSimSpan);

	    infoDiv.appendChild(mainSimDiv);

	    var newSimDiv = document.createElement('div');
	    newSimDiv.id = 'newSim';

	    infoDiv.appendChild(newSimDiv);

	    var shapeCountDiv = document.createElement('div');
	    shapeCountDiv.id = 'shapeCount';

	    infoDiv.appendChild(shapeCountDiv);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*jshint eqnull:true*/
	(function (root) {
	  "use strict";

	  var GLOBAL_KEY = "Random";

	  var imul = (typeof Math.imul !== "function" || Math.imul(0xffffffff, 5) !== -5 ?
	    function (a, b) {
	      var ah = (a >>> 16) & 0xffff;
	      var al = a & 0xffff;
	      var bh = (b >>> 16) & 0xffff;
	      var bl = b & 0xffff;
	      // the shift by 0 fixes the sign on the high part
	      // the final |0 converts the unsigned value into a signed value
	      return (al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0;
	    } :
	    Math.imul);

	  var stringRepeat = (typeof String.prototype.repeat === "function" && "x".repeat(3) === "xxx" ?
	    function (x, y) {
	      return x.repeat(y);
	    } : function (pattern, count) {
	      var result = "";
	      while (count > 0) {
	        if (count & 1) {
	          result += pattern;
	        }
	        count >>= 1;
	        pattern += pattern;
	      }
	      return result;
	    });

	  function Random(engine) {
	    if (!(this instanceof Random)) {
	      return new Random(engine);
	    }

	    if (engine == null) {
	      engine = Random.engines.nativeMath;
	    } else if (typeof engine !== "function") {
	      throw new TypeError("Expected engine to be a function, got " + typeof engine);
	    }
	    this.engine = engine;
	  }
	  var proto = Random.prototype;

	  Random.engines = {
	    nativeMath: function () {
	      return (Math.random() * 0x100000000) | 0;
	    },
	    mt19937: (function (Int32Array) {
	      // http://en.wikipedia.org/wiki/Mersenne_twister
	      function refreshData(data) {
	        var k = 0;
	        var tmp = 0;
	        for (;
	          (k | 0) < 227; k = (k + 1) | 0) {
	          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
	          data[k] = data[(k + 397) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
	        }

	        for (;
	          (k | 0) < 623; k = (k + 1) | 0) {
	          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
	          data[k] = data[(k - 227) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
	        }

	        tmp = (data[623] & 0x80000000) | (data[0] & 0x7fffffff);
	        data[623] = data[396] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
	      }

	      function temper(value) {
	        value ^= value >>> 11;
	        value ^= (value << 7) & 0x9d2c5680;
	        value ^= (value << 15) & 0xefc60000;
	        return value ^ (value >>> 18);
	      }

	      function seedWithArray(data, source) {
	        var i = 1;
	        var j = 0;
	        var sourceLength = source.length;
	        var k = Math.max(sourceLength, 624) | 0;
	        var previous = data[0] | 0;
	        for (;
	          (k | 0) > 0; --k) {
	          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x0019660d)) + (source[j] | 0) + (j | 0)) | 0;
	          i = (i + 1) | 0;
	          ++j;
	          if ((i | 0) > 623) {
	            data[0] = data[623];
	            i = 1;
	          }
	          if (j >= sourceLength) {
	            j = 0;
	          }
	        }
	        for (k = 623;
	          (k | 0) > 0; --k) {
	          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x5d588b65)) - i) | 0;
	          i = (i + 1) | 0;
	          if ((i | 0) > 623) {
	            data[0] = data[623];
	            i = 1;
	          }
	        }
	        data[0] = 0x80000000;
	      }

	      function mt19937() {
	        var data = new Int32Array(624);
	        var index = 0;
	        var uses = 0;

	        function next() {
	          if ((index | 0) >= 624) {
	            refreshData(data);
	            index = 0;
	          }

	          var value = data[index];
	          index = (index + 1) | 0;
	          uses += 1;
	          return temper(value) | 0;
	        }
	        next.getUseCount = function() {
	          return uses;
	        };
	        next.discard = function (count) {
	          uses += count;
	          if ((index | 0) >= 624) {
	            refreshData(data);
	            index = 0;
	          }
	          while ((count - index) > 624) {
	            count -= 624 - index;
	            refreshData(data);
	            index = 0;
	          }
	          index = (index + count) | 0;
	          return next;
	        };
	        next.seed = function (initial) {
	          var previous = 0;
	          data[0] = previous = initial | 0;

	          for (var i = 1; i < 624; i = (i + 1) | 0) {
	            data[i] = previous = (imul((previous ^ (previous >>> 30)), 0x6c078965) + i) | 0;
	          }
	          index = 624;
	          uses = 0;
	          return next;
	        };
	        next.seedWithArray = function (source) {
	          next.seed(0x012bd6aa);
	          seedWithArray(data, source);
	          return next;
	        };
	        next.autoSeed = function () {
	          return next.seedWithArray(Random.generateEntropyArray());
	        };
	        return next;
	      }

	      return mt19937;
	    }(typeof Int32Array === "function" ? Int32Array : Array)),
	    browserCrypto: (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function" && typeof Int32Array === "function") ? (function () {
	      var data = null;
	      var index = 128;

	      return function () {
	        if (index >= 128) {
	          if (data === null) {
	            data = new Int32Array(128);
	          }
	          crypto.getRandomValues(data);
	          index = 0;
	        }

	        return data[index++] | 0;
	      };
	    }()) : null
	  };

	  Random.generateEntropyArray = function () {
	    var array = [];
	    var engine = Random.engines.nativeMath;
	    for (var i = 0; i < 16; ++i) {
	      array[i] = engine() | 0;
	    }
	    array.push(new Date().getTime() | 0);
	    return array;
	  };

	  function returnValue(value) {
	    return function () {
	      return value;
	    };
	  }

	  // [-0x80000000, 0x7fffffff]
	  Random.int32 = function (engine) {
	    return engine() | 0;
	  };
	  proto.int32 = function () {
	    return Random.int32(this.engine);
	  };

	  // [0, 0xffffffff]
	  Random.uint32 = function (engine) {
	    return engine() >>> 0;
	  };
	  proto.uint32 = function () {
	    return Random.uint32(this.engine);
	  };

	  // [0, 0x1fffffffffffff]
	  Random.uint53 = function (engine) {
	    var high = engine() & 0x1fffff;
	    var low = engine() >>> 0;
	    return (high * 0x100000000) + low;
	  };
	  proto.uint53 = function () {
	    return Random.uint53(this.engine);
	  };

	  // [0, 0x20000000000000]
	  Random.uint53Full = function (engine) {
	    while (true) {
	      var high = engine() | 0;
	      if (high & 0x200000) {
	        if ((high & 0x3fffff) === 0x200000 && (engine() | 0) === 0) {
	          return 0x20000000000000;
	        }
	      } else {
	        var low = engine() >>> 0;
	        return ((high & 0x1fffff) * 0x100000000) + low;
	      }
	    }
	  };
	  proto.uint53Full = function () {
	    return Random.uint53Full(this.engine);
	  };

	  // [-0x20000000000000, 0x1fffffffffffff]
	  Random.int53 = function (engine) {
	    var high = engine() | 0;
	    var low = engine() >>> 0;
	    return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
	  };
	  proto.int53 = function () {
	    return Random.int53(this.engine);
	  };

	  // [-0x20000000000000, 0x20000000000000]
	  Random.int53Full = function (engine) {
	    while (true) {
	      var high = engine() | 0;
	      if (high & 0x400000) {
	        if ((high & 0x7fffff) === 0x400000 && (engine() | 0) === 0) {
	          return 0x20000000000000;
	        }
	      } else {
	        var low = engine() >>> 0;
	        return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
	      }
	    }
	  };
	  proto.int53Full = function () {
	    return Random.int53Full(this.engine);
	  };

	  function add(generate, addend) {
	    if (addend === 0) {
	      return generate;
	    } else {
	      return function (engine) {
	        return generate(engine) + addend;
	      };
	    }
	  }

	  Random.integer = (function () {
	    function isPowerOfTwoMinusOne(value) {
	      return ((value + 1) & value) === 0;
	    }

	    function bitmask(masking) {
	      return function (engine) {
	        return engine() & masking;
	      };
	    }

	    function downscaleToLoopCheckedRange(range) {
	      var extendedRange = range + 1;
	      var maximum = extendedRange * Math.floor(0x100000000 / extendedRange);
	      return function (engine) {
	        var value = 0;
	        do {
	          value = engine() >>> 0;
	        } while (value >= maximum);
	        return value % extendedRange;
	      };
	    }

	    function downscaleToRange(range) {
	      if (isPowerOfTwoMinusOne(range)) {
	        return bitmask(range);
	      } else {
	        return downscaleToLoopCheckedRange(range);
	      }
	    }

	    function isEvenlyDivisibleByMaxInt32(value) {
	      return (value | 0) === 0;
	    }

	    function upscaleWithHighMasking(masking) {
	      return function (engine) {
	        var high = engine() & masking;
	        var low = engine() >>> 0;
	        return (high * 0x100000000) + low;
	      };
	    }

	    function upscaleToLoopCheckedRange(extendedRange) {
	      var maximum = extendedRange * Math.floor(0x20000000000000 / extendedRange);
	      return function (engine) {
	        var ret = 0;
	        do {
	          var high = engine() & 0x1fffff;
	          var low = engine() >>> 0;
	          ret = (high * 0x100000000) + low;
	        } while (ret >= maximum);
	        return ret % extendedRange;
	      };
	    }

	    function upscaleWithinU53(range) {
	      var extendedRange = range + 1;
	      if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
	        var highRange = ((extendedRange / 0x100000000) | 0) - 1;
	        if (isPowerOfTwoMinusOne(highRange)) {
	          return upscaleWithHighMasking(highRange);
	        }
	      }
	      return upscaleToLoopCheckedRange(extendedRange);
	    }

	    function upscaleWithinI53AndLoopCheck(min, max) {
	      return function (engine) {
	        var ret = 0;
	        do {
	          var high = engine() | 0;
	          var low = engine() >>> 0;
	          ret = ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
	        } while (ret < min || ret > max);
	        return ret;
	      };
	    }

	    return function (min, max) {
	      min = Math.floor(min);
	      max = Math.floor(max);
	      if (min < -0x20000000000000 || !isFinite(min)) {
	        throw new RangeError("Expected min to be at least " + (-0x20000000000000));
	      } else if (max > 0x20000000000000 || !isFinite(max)) {
	        throw new RangeError("Expected max to be at most " + 0x20000000000000);
	      }

	      var range = max - min;
	      if (range <= 0 || !isFinite(range)) {
	        return returnValue(min);
	      } else if (range === 0xffffffff) {
	        if (min === 0) {
	          return Random.uint32;
	        } else {
	          return add(Random.int32, min + 0x80000000);
	        }
	      } else if (range < 0xffffffff) {
	        return add(downscaleToRange(range), min);
	      } else if (range === 0x1fffffffffffff) {
	        return add(Random.uint53, min);
	      } else if (range < 0x1fffffffffffff) {
	        return add(upscaleWithinU53(range), min);
	      } else if (max - 1 - min === 0x1fffffffffffff) {
	        return add(Random.uint53Full, min);
	      } else if (min === -0x20000000000000 && max === 0x20000000000000) {
	        return Random.int53Full;
	      } else if (min === -0x20000000000000 && max === 0x1fffffffffffff) {
	        return Random.int53;
	      } else if (min === -0x1fffffffffffff && max === 0x20000000000000) {
	        return add(Random.int53, 1);
	      } else if (max === 0x20000000000000) {
	        return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
	      } else {
	        return upscaleWithinI53AndLoopCheck(min, max);
	      }
	    };
	  }());
	  proto.integer = function (min, max) {
	    return Random.integer(min, max)(this.engine);
	  };

	  // [0, 1] (floating point)
	  Random.realZeroToOneInclusive = function (engine) {
	    return Random.uint53Full(engine) / 0x20000000000000;
	  };
	  proto.realZeroToOneInclusive = function () {
	    return Random.realZeroToOneInclusive(this.engine);
	  };

	  // [0, 1) (floating point)
	  Random.realZeroToOneExclusive = function (engine) {
	    return Random.uint53(engine) / 0x20000000000000;
	  };
	  proto.realZeroToOneExclusive = function () {
	    return Random.realZeroToOneExclusive(this.engine);
	  };

	  Random.real = (function () {
	    function multiply(generate, multiplier) {
	      if (multiplier === 1) {
	        return generate;
	      } else if (multiplier === 0) {
	        return function () {
	          return 0;
	        };
	      } else {
	        return function (engine) {
	          return generate(engine) * multiplier;
	        };
	      }
	    }

	    return function (left, right, inclusive) {
	      if (!isFinite(left)) {
	        throw new RangeError("Expected left to be a finite number");
	      } else if (!isFinite(right)) {
	        throw new RangeError("Expected right to be a finite number");
	      }
	      return add(
	        multiply(
	          inclusive ? Random.realZeroToOneInclusive : Random.realZeroToOneExclusive,
	          right - left),
	        left);
	    };
	  }());
	  proto.real = function (min, max, inclusive) {
	    return Random.real(min, max, inclusive)(this.engine);
	  };

	  Random.bool = (function () {
	    function isLeastBitTrue(engine) {
	      return (engine() & 1) === 1;
	    }

	    function lessThan(generate, value) {
	      return function (engine) {
	        return generate(engine) < value;
	      };
	    }

	    function probability(percentage) {
	      if (percentage <= 0) {
	        return returnValue(false);
	      } else if (percentage >= 1) {
	        return returnValue(true);
	      } else {
	        var scaled = percentage * 0x100000000;
	        if (scaled % 1 === 0) {
	          return lessThan(Random.int32, (scaled - 0x80000000) | 0);
	        } else {
	          return lessThan(Random.uint53, Math.round(percentage * 0x20000000000000));
	        }
	      }
	    }

	    return function (numerator, denominator) {
	      if (denominator == null) {
	        if (numerator == null) {
	          return isLeastBitTrue;
	        }
	        return probability(numerator);
	      } else {
	        if (numerator <= 0) {
	          return returnValue(false);
	        } else if (numerator >= denominator) {
	          return returnValue(true);
	        }
	        return lessThan(Random.integer(0, denominator - 1), numerator);
	      }
	    };
	  }());
	  proto.bool = function (numerator, denominator) {
	    return Random.bool(numerator, denominator)(this.engine);
	  };

	  function toInteger(value) {
	    var number = +value;
	    if (number < 0) {
	      return Math.ceil(number);
	    } else {
	      return Math.floor(number);
	    }
	  }

	  function convertSliceArgument(value, length) {
	    if (value < 0) {
	      return Math.max(value + length, 0);
	    } else {
	      return Math.min(value, length);
	    }
	  }
	  Random.pick = function (engine, array, begin, end) {
	    var length = array.length;
	    var start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
	    var finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
	    if (start >= finish) {
	      return void 0;
	    }
	    var distribution = Random.integer(start, finish - 1);
	    return array[distribution(engine)];
	  };
	  proto.pick = function (array, begin, end) {
	    return Random.pick(this.engine, array, begin, end);
	  };

	  function returnUndefined() {
	    return void 0;
	  }
	  var slice = Array.prototype.slice;
	  Random.picker = function (array, begin, end) {
	    var clone = slice.call(array, begin, end);
	    if (!clone.length) {
	      return returnUndefined;
	    }
	    var distribution = Random.integer(0, clone.length - 1);
	    return function (engine) {
	      return clone[distribution(engine)];
	    };
	  };

	  Random.shuffle = function (engine, array, downTo) {
	    var length = array.length;
	    if (length) {
	      if (downTo == null) {
	        downTo = 0;
	      }
	      for (var i = (length - 1) >>> 0; i > downTo; --i) {
	        var distribution = Random.integer(0, i);
	        var j = distribution(engine);
	        if (i !== j) {
	          var tmp = array[i];
	          array[i] = array[j];
	          array[j] = tmp;
	        }
	      }
	    }
	    return array;
	  };
	  proto.shuffle = function (array) {
	    return Random.shuffle(this.engine, array);
	  };

	  Random.sample = function (engine, population, sampleSize) {
	    if (sampleSize < 0 || sampleSize > population.length || !isFinite(sampleSize)) {
	      throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
	    }

	    if (sampleSize === 0) {
	      return [];
	    }

	    var clone = slice.call(population);
	    var length = clone.length;
	    if (length === sampleSize) {
	      return Random.shuffle(engine, clone, 0);
	    }
	    var tailLength = length - sampleSize;
	    return Random.shuffle(engine, clone, tailLength - 1).slice(tailLength);
	  };
	  proto.sample = function (population, sampleSize) {
	    return Random.sample(this.engine, population, sampleSize);
	  };

	  Random.die = function (sideCount) {
	    return Random.integer(1, sideCount);
	  };
	  proto.die = function (sideCount) {
	    return Random.die(sideCount)(this.engine);
	  };

	  Random.dice = function (sideCount, dieCount) {
	    var distribution = Random.die(sideCount);
	    return function (engine) {
	      var result = [];
	      result.length = dieCount;
	      for (var i = 0; i < dieCount; ++i) {
	        result[i] = distribution(engine);
	      }
	      return result;
	    };
	  };
	  proto.dice = function (sideCount, dieCount) {
	    return Random.dice(sideCount, dieCount)(this.engine);
	  };

	  // http://en.wikipedia.org/wiki/Universally_unique_identifier
	  Random.uuid4 = (function () {
	    function zeroPad(string, zeroCount) {
	      return stringRepeat("0", zeroCount - string.length) + string;
	    }

	    return function (engine) {
	      var a = engine() >>> 0;
	      var b = engine() | 0;
	      var c = engine() | 0;
	      var d = engine() >>> 0;

	      return (
	        zeroPad(a.toString(16), 8) +
	        "-" +
	        zeroPad((b & 0xffff).toString(16), 4) +
	        "-" +
	        zeroPad((((b >> 4) & 0x0fff) | 0x4000).toString(16), 4) +
	        "-" +
	        zeroPad(((c & 0x3fff) | 0x8000).toString(16), 4) +
	        "-" +
	        zeroPad(((c >> 4) & 0xffff).toString(16), 4) +
	        zeroPad(d.toString(16), 8));
	    };
	  }());
	  proto.uuid4 = function () {
	    return Random.uuid4(this.engine);
	  };

	  Random.string = (function () {
	    // has 2**x chars, for faster uniform distribution
	    var DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";

	    return function (pool) {
	      if (pool == null) {
	        pool = DEFAULT_STRING_POOL;
	      }

	      var length = pool.length;
	      if (!length) {
	        throw new Error("Expected pool not to be an empty string");
	      }

	      var distribution = Random.integer(0, length - 1);
	      return function (engine, length) {
	        var result = "";
	        for (var i = 0; i < length; ++i) {
	          var j = distribution(engine);
	          result += pool.charAt(j);
	        }
	        return result;
	      };
	    };
	  }());
	  proto.string = function (length, pool) {
	    return Random.string(pool)(this.engine, length);
	  };

	  Random.hex = (function () {
	    var LOWER_HEX_POOL = "0123456789abcdef";
	    var lowerHex = Random.string(LOWER_HEX_POOL);
	    var upperHex = Random.string(LOWER_HEX_POOL.toUpperCase());

	    return function (upper) {
	      if (upper) {
	        return upperHex;
	      } else {
	        return lowerHex;
	      }
	    };
	  }());
	  proto.hex = function (length, upper) {
	    return Random.hex(upper)(this.engine, length);
	  };

	  Random.date = function (start, end) {
	    if (!(start instanceof Date)) {
	      throw new TypeError("Expected start to be a Date, got " + typeof start);
	    } else if (!(end instanceof Date)) {
	      throw new TypeError("Expected end to be a Date, got " + typeof end);
	    }
	    var distribution = Random.integer(start.getTime(), end.getTime());
	    return function (engine) {
	      return new Date(distribution(engine));
	    };
	  };
	  proto.date = function (start, end) {
	    return Random.date(start, end)(this.engine);
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return Random;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== "undefined" && typeof require === "function") {
	    module.exports = Random;
	  } else {
	    (function () {
	      var oldGlobal = root[GLOBAL_KEY];
	      Random.noConflict = function () {
	        root[GLOBAL_KEY] = oldGlobal;
	        return this;
	      };
	    }());
	    root[GLOBAL_KEY] = Random;
	  }
	}(this));

/***/ }
/******/ ]);