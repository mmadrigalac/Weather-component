/**
 * Destructuring of the object for easy manipulation
 * @param {Object} data : data provided by the API
 */
export function weatherDataModel(data){
    var {woeid: woeid, parent:{title:parentTitle},title: title, consolidated_weather:consolidatedWeather } = data;

    return {
        parentTitle,
        title,
        currentData: consolidatedWeather.shift(),
        consolidatedWeather,
        woeid,
        completeTitle:`${title}, ${parentTitle}`
    };
}