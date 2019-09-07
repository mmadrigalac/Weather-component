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
	let completeUrl = `location/search/?${locationType}`;

	return weatherRepo.getApiResponse( completeUrl);
}


/**
* Gets weather data based on the woeid(where On Earth ID) provided.
*/
export function getWeatherData( woeid ){

	let completeUrl = `location/${woeid}`;

	return weatherRepo.getApiResponse(completeUrl, data => JSON.parse(data));
}