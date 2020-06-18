


var baseURL = 'http://www.omdbapi.com/?apikey='
var key = '15c982b';
var urlWithAPIKey = baseURL + key;

var query = '&t=pleasantville&y=1998'

var fullQuery = urlWithAPIKey + query;

console.log(fullQuery);