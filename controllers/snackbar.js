var https = require('https');
var qs = require('querystring');

exports.getSnackbars = function(snackbarRequest, snackbarResponse){
	var str = snackbarRequest.url.split('?')[1];
	var querystrings = qs.parse(str);

	var url = 'https://api.eet.nu/venues?query=snackbar&geolocation=' + querystrings.lat + "," + querystrings.long
	console.log(url);
	var req = https.get(url, function(res) {
	  console.log("statusCode: ", res.statusCode);
	  console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	  	snackbarResponse.json(d);
	  });
	});

	req.on('error', function(e) {
	  console.error(e);
	});
}

exports.getSnackbarsDummy = function(snackbarRequest, snackbarResponse){
	snackbarResponse.json([{
		"snackbar": "Cafetaria-twekkelerveld",
		"url": "https://www.eet.nu/enschede/cafetaria-twekkelerveld"
	},{
		"snackbar": "De stip",
		"url": "https://www.eet.nu/enschede/cafetaria-twekkelerveld"
	},{
		"snackbar": "De kromme patat",
		"url": "https://www.eet.nu/enschede/cafetaria-twekkelerveld"
	},{
		"snackbar": "Kees Kroket",
		"url": "https://www.eet.nu/enschede/cafetaria-twekkelerveld"
	},{
		"snackbar": "Freek Frikandel",
		"url": "https://www.eet.nu/enschede/cafetaria-twekkelerveld"
	},]);
}