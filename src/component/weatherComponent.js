import * as weatherSvc from '../services/weatherService';
import {weatherDataModel} from '../models/weatherDataModel.js';

// Allow acces to the DOM of the imported HTML.
const currentDocument = document.currentScript.ownerDocument;

class WeatherComponent extends HTMLElement {

	constructor(){
		super();

		this.attachShadow({mode: 'open'});
	}

		
	/**
	 * Called when the element is inserted in the DOM.
	 */
	connectedCallback(){
		const {shadowRoot} = this; 

		// Select the template and clone it. The node will be inclided into the shadowDOM
		const template = currentDocument.querySelector('#weather-component-template');
		const instance = template.content.cloneNode(true); 
		shadowRoot.appendChild(instance);
	

		this.initLocationData();
	}

	/**
	* Calls Weather Service to assign the location data provided by API
	*/
	initLocationData(){

		// ToDO: implement geolocation for initilization.

		// Using att value otherwise use a fallback location.
		var location = this.getAttribute('location')? this.getAttribute('location') :'san jose';

		// Look for initial weather data.
		 weatherSvc.getLocationOptions( location)
			.then((data)=>{
				let location = data.shift();
				
				weatherSvc.getWeatherData(location.woeid)
					.then((weatherData)=>{
						this.render(weatherDataModel(weatherData));
					});
			})
			.catch((error) => {
	            console.error(error);
	        });
	}

	/**
	 * Fill the respective areas of the component using DOM manipulation
	 * @param  {Object} weatherData : Data provided by the API
	 */
	render( weatherData ){
		var {currentData: currentWeather } = weatherData;

		this.shadowRoot.querySelector('.location-name').innerHTML = weatherData.title;
		this.shadowRoot.querySelector('.temp').innerHTML = currentWeather.the_temp.toFixed();
		this.shadowRoot.querySelector('.state').innerHTML = currentWeather.weather_state_name;
		this.shadowRoot.querySelector('.humidity').innerHTML = `${currentWeather.humidity}%`;
		this.shadowRoot.querySelector('.wind').innerHTML = `${currentWeather.wind_speed.toFixed(1)} mps ${currentWeather.wind_direction_compass}`;
	}

}

customElements.define('weather-component', WeatherComponent);





