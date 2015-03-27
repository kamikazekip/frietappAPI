var ConnectRoles = require('connect-roles');

module.exports = function(){
	var roles = new ConnectRoles({
  		failureHandler: function (req, res, action) {
  			res.statusCode = 401;
	    	res.send("Insufficient permission!");
	  	}
	});

	// Admins can do everything
	roles.use('access admin resources', function (req) {
  		if(req.user.hasAnyRole('administrator')){
  			return true;
  		};
	});

	return roles;
};