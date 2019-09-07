(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var weatherSvc = _interopRequireWildcard(require("../services/weatherService.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

weatherSvc.getLocationOptions('san jose').then(function (data) {
  console.log(data);
});

},{"../services/weatherService.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiResponse = getApiResponse;

/**
* Metaweather repository
*/
var repoURL = "https://www.metaweather.com/api";

function getApiResponse(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(xhr.responseText);
    };

    var requestUrl = "".concat(repoURL, "/").concat(url);
    xhr.open('GET', requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  });
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocationOptions = getLocationOptions;
exports.getWeatherData = getWeatherData;

var weatherRepo = _interopRequireWildcard(require("./weatherRepo.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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
  var completeUrl = "location/search/?".concat(locationType);
  return weatherRepo.getApiResponse(completeUrl);
}
/**
* Gets weather data based on the woeid(where On Earth ID) provided.
*/


function getWeatherData(woeid) {
  var completeUrl = "location/".concat(woeid);
  return weatherRepo.getApiResponse(completeUrl, function (data) {
    return JSON.parse(data);
  });
}

},{"./weatherRepo.js":2}]},{},[1,2,3]);
