(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var weatherSvc = _interopRequireWildcard(require("../services/weatherService"));

var _weatherDataModel = require("../models/weatherDataModel.js");

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
      var location = this.getAttribute('location') ? this.getAttribute('location') : 'san jose'; // Look for initial weather data.

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
      this.shadowRoot.querySelector('.temp').innerHTML = currentWeather.the_temp.toFixed();
      this.shadowRoot.querySelector('.state').innerHTML = currentWeather.weather_state_name;
      this.shadowRoot.querySelector('.humidity').innerHTML = "".concat(currentWeather.humidity, "%");
      this.shadowRoot.querySelector('.wind').innerHTML = "".concat(currentWeather.wind_speed.toFixed(1), " mps ").concat(currentWeather.wind_direction_compass);
    }
  }]);

  return WeatherComponent;
}(_wrapNativeSuper(HTMLElement));

customElements.define('weather-component', WeatherComponent);

},{"../models/weatherDataModel.js":2,"../services/weatherService":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiResponse = getApiResponse;
var repoURL = "https://www.metaweather.com/api";
/**
* Creates a promise besed on an ajax call using the Url provided.
*/

function getApiResponse(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(JSON.parse(xhr.responseText));
    };

    var requestUrl = "".concat(repoURL, "/").concat(url);
    xhr.open('GET', requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  });
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocationOptions = getLocationOptions;
exports.getWeatherData = getWeatherData;

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
  var completeUrl = "location/search/?".concat(locationType); //Once completed the 

  return weatherRepo.getApiResponse(completeUrl);
}
/**
* Gets weather data based on the woeid(where On Earth ID) provided.
*/


function getWeatherData(woeid) {
  var completeUrl = "location/".concat(woeid);
  return weatherRepo.getApiResponse(completeUrl);
}

},{"./weatherRepo.js":3}]},{},[1,2,3,4]);
