import * as weatherRepo from './weatherRepo.js';

/**
* Verifies if the loacation is a valid coordinate.
*/
function validateCoordinate( location ){
	let coodinatesRegEx = /^\d+\.?\d*?\,-?\d+\.?\d*/i;

	return coodinatesRegEx.test(location);
}


// EXPOSED SERVICE FUNCTIONS //

/**
* Gets results for location search results.
*/
export function getLocationOptions( location ){
	
	var locationType = validateCoordinate(location)? `lattlong=${location}`: `query=${location}`;
	let completeUrl = `api/location/search/?${locationType}`;

	//Once completed the 
	return weatherRepo.getApiResponse(completeUrl);
}


/**
* Gets weather data based on the woeid(where On Earth ID) provided.
*/
export function getWeatherData( woeid ){

	let completeUrl = `api/location/${woeid}`;

	return weatherRepo.getApiResponse(completeUrl);
}

/**
 * Generates the route of the image to be displayed in the component
 * @param {Object} state: destructuring of weatherDataModel
 */
export function getStateImageURL(state){
	const IMG_URL = `${weatherRepo.SITE_URL}/static/img/weather/png/64/`;

	return `${IMG_URL}${state}.png`;
}