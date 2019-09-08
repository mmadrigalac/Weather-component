const repoURL = "https://www.metaweather.com/api";

/**
* Creates a promise besed on an ajax call using the Url provided.
*/
export function getApiResponse(url){
	
	return new Promise((resolve, reject) => { 
		let xhr= new XMLHttpRequest();

		xhr.onload = ()=>{
			resolve( JSON.parse(xhr.responseText));
		};

		let requestUrl = `${repoURL}/${url}`;

		xhr.open('GET', requestUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();
	});
}