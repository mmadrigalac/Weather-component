/**
* Metaweather repository
*/
const repoURL = "https://www.metaweather.com/api";


export function getApiResponse(url){
	
	return new Promise((resolve, reject) => { 
		let xhr= new XMLHttpRequest();

		xhr.onload = ()=>{
			resolve( xhr.responseText);
		};

		let requestUrl = `${repoURL}/${url}`;

		xhr.open('GET', requestUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();
	});
}