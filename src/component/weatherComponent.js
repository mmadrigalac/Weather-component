import * as weatherSvc from '../services/weatherService';
import {weatherDataModel} from '../models/weatherDataModel.js';
import { createContext } from 'vm';

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

		this.addListeners();
	}

	/**
	* Calls Weather Service to assign the location data provided by API
	*/
	initLocationData(){

		// ToDO: implement geolocation for initilization.

		// Using att value otherwise use a fallback location.
		var location = this.getAttribute('location')? this.getAttribute('location') :'Sapporo';

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
		this.shadowRoot.querySelector('.temp').innerHTML = `${currentWeather.the_temp.toFixed()}°`;
		this.shadowRoot.querySelector('.humidity').innerHTML = `${currentWeather.humidity}%`;
		this.shadowRoot.querySelector('.wind').innerHTML = `${currentWeather.wind_speed.toFixed(1)} mps`;
		this.shadowRoot.querySelector('.direction').innerHTML =`${currentWeather.wind_direction_compass}`;

		//generates the state image
		this.getWeatherStateImage(weatherData);
	}

	/**
	 * creates an image element using the correct Image route
	 * @param {Object} weatherData : Data provided by the API
	 */
	getWeatherStateImage(weatherData){
		var {currentData: {weather_state_abbr: weatherState}} = weatherData;
		
		// Set the state image 
		var image = document.createElement('img');
		image.src = weatherSvc.getStateImageURL(weatherState);
	
		this.shadowRoot.querySelector('.weather-container').style.backgroundImage =`url(static/${weatherState}.png)`;
		this.shadowRoot.querySelector('.state').innerHTML ='';
		this.shadowRoot.querySelector('.state').appendChild(image);
		
	}

	/**
	 * Add the required Listeners to the component
	 */
	addListeners(){

		// Display the location area for selection
		this.shadowRoot.querySelector('#select-location').addEventListener('click', e=>{
			this.shadowRoot.querySelector('#weather-location').style.display = 'block';
		});

		// Display the location area for selection
		this.shadowRoot.querySelector('.close').addEventListener('click', e=>{
			cleanLocationSelector(this);
		});

		// Find search suggestions
		this.shadowRoot.querySelector('#searchButton').addEventListener('click', e=>{
			let searchCriteria = this.shadowRoot.querySelector('#searchCriteria').value;

			this.generateLocationList(searchCriteria);
			
		});
	}

	/**
	 * Clean location Selector and clear search criteria
	 */
	cleanLocationSelector(){
		this.shadowRoot.querySelector('#weather-location').style.display = 'none';
		this.shadowRoot.querySelector('.location-results').innerHTML ="";
		this.shadowRoot.querySelector('#searchCriteria').value ="";
	}

	/**
	 * 
	 * @param {string} searchCriteria: text entered in the search box
	 */
	generateLocationList(searchCriteria) {
		weatherSvc.getLocationOptions(searchCriteria)
			.then((data)=>{
				
				/**
				 * Append text to a new node and include it into the parentNode
				 * @parameter {Object} parentElement:
				 * @parameter {string} text
				 */
				function appendTextNode(parentElement, text){
					var textNode = document.createTextNode(text);
					parentElement.appendChild(textNode);
				}

				//Cleans the result container before show the new results
				this.shadowRoot.querySelector('.location-results').innerHTML ="";

				if(!data.length){
					var messageSpan = document.createElement('span');
					appendTextNode( messageSpan,'Location was not found');

					messageSpan.classList.add('missing-location');
					
					// message is added to result container
					this.shadowRoot.querySelector('.location-results').appendChild(messageSpan);
					return;
				}

				// For each location shown a new element will be added to the list
				 data.forEach(location => {
					var locationLink = document.createElement('a'),
						locationTitle = document.createElement('span');

						appendTextNode(locationTitle, location.title);
						
						locationLink.setAttribute('href','#');
						locationLink.setAttribute('role','button');
						locationLink.setAttribute('woeid',location.woeid);
						locationLink.classList.add('location-result');

						locationLink.append(locationTitle);
						
						// Calls API to update component under selection
						locationLink.addEventListener('click', e=>{
							var woeid = e.currentTarget.attributes.woeid.nodeValue;

							weatherSvc.getWeatherData(woeid)
							.then((weatherData)=>{
								this.render(weatherDataModel(weatherData));
							});
							
							this.cleanLocationSelector();

							});
							
						this.shadowRoot.querySelector('.location-results').appendChild(locationLink);
				 });
			});
	}

}

customElements.define('weather-component', WeatherComponent);





