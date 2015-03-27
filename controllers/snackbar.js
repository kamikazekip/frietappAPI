var https = require('https');
var qs = require('querystring');

exports.getSnackbars = function(req, frietappres){
	//https://api.eet.nu/venues?query=snackbar&max_distance=10&lat=51.6978162&lng=5.3548050
	var chunks;
	var str = req.url.split('?')[1];
	var querystrings = qs.parse(str);
	var path = 'https://api.eet.nu/venues?query=snackbar&lat=' + querystrings.lat + "&long=" + querystrings.long
	console.log(path);
	
	https.get(path, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function(d) {
	    chunks = d;
	  });

	  res.on('end', function(d){
	  	frietappres.send(d);
	  })

	}).on('error', function(e) {
	  console.error(e);
	});

}