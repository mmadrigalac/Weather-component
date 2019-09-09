(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var indexOf = function (xs, item) {
    if (xs.indexOf) return xs.indexOf(item);
    else for (var i = 0; i < xs.length; i++) {
        if (xs[i] === item) return i;
    }
    return -1;
};
var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    if (context) {
        forEach(Object_keys(ctx), function (key) {
            context[key] = ctx[key];
        });
    }

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.isContext = function (context) {
    return context instanceof Context;
};

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},{}],2:[function(require,module,exports){
"use strict";

var weatherSvc = _interopRequireWildcard(require("../services/weatherService"));

var _weatherDataModel = require("../models/weatherDataModel.js");

var _vm = require("vm");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Allow acces to the DOM of the imported HTML.
var currentDocument = document.currentScript.ownerDocument;

var WeatherComponent =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(WeatherComponent, _HTMLElement);

  function WeatherComponent() {
    var _this;

    _classCallCheck(this, WeatherComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WeatherComponent).call(this));

    _this.attachShadow({
      mode: 'open'
    });

    return _this;
  }
  /**
   * Called when the element is inserted in the DOM.
   */


  _createClass(WeatherComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var shadowRoot = this.shadowRoot; // Select the template and clone it. The node will be inclided into the shadowDOM

      var template = currentDocument.querySelector('#weather-component-template');
      var instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);
      this.initLocationData();
      this.addListeners();
    }
    /**
    * Calls Weather Service to assign the location data provided by API
    */

  }, {
    key: "initLocationData",
    value: function initLocationData() {
      var _this2 = this;

      // ToDO: implement geolocation for initilization.
      // Using att value otherwise use a fallback location.
      var location = this.getAttribute('location') ? this.getAttribute('location') : 'Sapporo'; // Look for initial weather data.

      weatherSvc.getLocationOptions(location).then(function (data) {
        var location = data.shift();
        weatherSvc.getWeatherData(location.woeid).then(function (weatherData) {
          _this2.render((0, _weatherDataModel.weatherDataModel)(weatherData));
        });
      })["catch"](function (error) {
        console.error(error);
      });
    }
    /**
     * Fill the respective areas of the component using DOM manipulation
     * @param  {Object} weatherData : Data provided by the API
     */

  }, {
    key: "render",
    value: function render(weatherData) {
      var currentWeather = weatherData.currentData;
      this.shadowRoot.querySelector('.location-name').innerHTML = weatherData.title;
      this.shadowRoot.querySelector('.temp').innerHTML = "".concat(currentWeather.the_temp.toFixed(), "\xB0");
      this.shadowRoot.querySelector('.humidity').innerHTML = "".concat(currentWeather.humidity, "%");
      this.shadowRoot.querySelector('.wind').innerHTML = "".concat(currentWeather.wind_speed.toFixed(1), " mps");
      this.shadowRoot.querySelector('.direction').innerHTML = "".concat(currentWeather.wind_direction_compass); //generates the state image

      this.getWeatherStateImage(weatherData);
    }
    /**
     * creates an image element using the correct Image route
     * @param {Object} weatherData : Data provided by the API
     */

  }, {
    key: "getWeatherStateImage",
    value: function getWeatherStateImage(weatherData) {
      var weatherState = weatherData.currentData.weather_state_abbr; // Set the state image 

      var image = document.createElement('img');
      image.src = weatherSvc.getStateImageURL(weatherState);
      this.shadowRoot.querySelector('.weather-container').style.backgroundImage = "url(static/".concat(weatherState, ".png)");
      this.shadowRoot.querySelector('.state').innerHTML = '';
      this.shadowRoot.querySelector('.state').appendChild(image);
    }
    /**
     * Add the required Listeners to the component
     */

  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this3 = this;

      // Display the location area for selection
      this.shadowRoot.querySelector('#select-location').addEventListener('click', function (e) {
        _this3.shadowRoot.querySelector('#weather-location').style.display = 'block';
      }); // Display the location area for selection

      this.shadowRoot.querySelector('.close').addEventListener('click', function (e) {
        _this3.cleanLocationSelector(_this3);
      }); // Find search suggestions

      this.shadowRoot.querySelector('#searchButton').addEventListener('click', function (e) {
        var searchCriteria = _this3.shadowRoot.querySelector('#searchCriteria').value;

        if (searchCriteria) _this3.generateLocationList(searchCriteria);
      });
    }
    /**
     * Clean location Selector and clear search criteria
     */

  }, {
    key: "cleanLocationSelector",
    value: function cleanLocationSelector() {
      this.shadowRoot.querySelector('#weather-location').style.display = 'none';
      this.shadowRoot.querySelector('.location-results').innerHTML = "";
      this.shadowRoot.querySelector('#searchCriteria').value = "";
    }
    /**
     * 
     * @param {string} searchCriteria: text entered in the search box
     */

  }, {
    key: "generateLocationList",
    value: function generateLocationList(searchCriteria) {
      var _this4 = this;

      weatherSvc.getLocationOptions(searchCriteria).then(function (data) {
        /**
         * Append text to a new node and include it into the parentNode
         * @parameter {Object} parentElement:
         * @parameter {string} text
         */
        function appendTextNode(parentElement, text) {
          var textNode = document.createTextNode(text);
          parentElement.appendChild(textNode);
        } //Cleans the result container before show the new results


        _this4.shadowRoot.querySelector('.location-results').innerHTML = "";

        if (!data.length) {
          var messageSpan = document.createElement('span');
          appendTextNode(messageSpan, 'Location was not found');
          messageSpan.classList.add('missing-location'); // message is added to result container

          _this4.shadowRoot.querySelector('.location-results').appendChild(messageSpan);

          return;
        } // For each location shown a new element will be added to the list


        data.forEach(function (location) {
          var locationLink = document.createElement('a'),
              locationTitle = document.createElement('span');
          appendTextNode(locationTitle, location.title);
          locationLink.setAttribute('href', '#');
          locationLink.setAttribute('role', 'button');
          locationLink.setAttribute('woeid', location.woeid);
          locationLink.classList.add('location-result');
          locationLink.append(locationTitle); // Calls API to update component under selection

          locationLink.addEventListener('click', function (e) {
            var woeid = e.currentTarget.attributes.woeid.nodeValue;
            weatherSvc.getWeatherData(woeid).then(function (weatherData) {
              _this4.render((0, _weatherDataModel.weatherDataModel)(weatherData));
            });

            _this4.cleanLocationSelector();
          });

          _this4.shadowRoot.querySelector('.location-results').appendChild(locationLink);
        });
      });
    }
  }]);

  return WeatherComponent;
}(_wrapNativeSuper(HTMLElement));

customElements.define('weather-component', WeatherComponent);

},{"../models/weatherDataModel.js":3,"../services/weatherService":5,"vm":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weatherDataModel = weatherDataModel;

/**
 * Destructuring of the object for easy manipulation
 * @param {Object} data : data provided by the API
 */
function weatherDataModel(data) {
  var woeid = data.woeid,
      parentTitle = data.parent.title,
      title = data.title,
      consolidatedWeather = data.consolidated_weather;
  return {
    parentTitle: parentTitle,
    title: title,
    currentData: consolidatedWeather.shift(),
    consolidatedWeather: consolidatedWeather,
    woeid: woeid,
    completeTitle: "".concat(title, ", ").concat(parentTitle)
  };
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiResponse = getApiResponse;
exports.SITE_URL = void 0;
// Keeps the current API main route
var SITE_URL = "https://www.metaweather.com";
/**
* Creates a promise besed on an ajax call using the Url provided.
*/

exports.SITE_URL = SITE_URL;

function getApiResponse(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(JSON.parse(xhr.responseText));
    };

    var requestUrl = "".concat(SITE_URL, "/").concat(url);
    xhr.open('GET', requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  });
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocationOptions = getLocationOptions;
exports.getWeatherData = getWeatherData;
exports.getStateImageURL = getStateImageURL;

var weatherRepo = _interopRequireWildcard(require("./weatherRepo.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
* Verifies if the loacation is a valid coordinate.
*/
function validateCoordinate(location) {
  var coodinatesRegEx = /^\d+\.?\d*?\,-?\d+\.?\d*/i;
  return coodinatesRegEx.test(location);
} // EXPOSED SERVICE FUNCTIONS //

/**
* Gets results for location search results.
*/


function getLocationOptions(location) {
  var locationType = validateCoordinate(location) ? "lattlong=".concat(location) : "query=".concat(location);
  var completeUrl = "api/location/search/?".concat(locationType); //Once completed the 

  return weatherRepo.getApiResponse(completeUrl);
}
/**
* Gets weather data based on the woeid(where On Earth ID) provided.
*/


function getWeatherData(woeid) {
  var completeUrl = "api/location/".concat(woeid);
  return weatherRepo.getApiResponse(completeUrl);
}
/**
 * Generates the route of the image to be displayed in the component
 * @param {Object} state: destructuring of weatherDataModel
 */


function getStateImageURL(state) {
  var IMG_URL = "".concat(weatherRepo.SITE_URL, "/static/img/weather/png/64/");
  return "".concat(IMG_URL).concat(state, ".png");
}

},{"./weatherRepo.js":4}]},{},[2,3,4,5]);
