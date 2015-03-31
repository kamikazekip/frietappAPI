var https = require('https');
var qs = require('querystring');

exports.getSnackbars = function(snackbarRequest, snackbarResponse){
	var str = snackbarRequest.url.split('?')[1];
	var querystrings = qs.parse(str);

	var url = 'https://api.eet.nu/venues?query=snackbar&geolocation=' + querystrings.lat + "," + querystrings.long

	var req = https.get(url, function(result) {	 
	  	var stringRepsonse = "";

	  	result.on('data', function(d) {
	  		stringRepsonse += ("" + d);
	  	});

	  	result.on('error', function(e) {
	  		console.error(e);
		});

  		result.on('end', function () {
		    var jsonResponse = JSON.parse(stringRepsonse);
		    var firstFiveResults = jsonResponse.results.splice(0,5);
		    var snackbarArray = []
		    for(var x = 0; x < firstFiveResults.length; x++){
		    	snackbarArray.push({ snackbar: firstFiveResults[x].name, url: firstFiveResults[x].url })
		    }
		    snackbarArray.push({ snackbar: "Overig", url: "Sorry, geen url" })
		    snackbarResponse.json(snackbarArray);
		});
	});	
}