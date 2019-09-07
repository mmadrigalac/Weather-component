import * as weatherSvc from '../services/weatherService.js';

weatherSvc.getLocationOptions('san jose')
.then(
	(data)=>{
		console.log(data);		
	});


