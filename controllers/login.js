// Load required packages
var Group = require('../models/group');

// Create endpoint /api/users for GET
exports.login = function(req, res) {
  Group.find({ users: req.user.username }, function(err, groups) {
    if (err)
      res.send(err);

    res.json({
    	isSuccessfull: true,
    	groups: groups
    });
  });
}