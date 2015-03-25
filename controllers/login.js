// Load required packages
var Group = require('../models/group');

// Create endpoint /api/users for GET
exports.login = function(req, res) {
  Group.find({ userIds: req.user._id }, function(err, groups) {
    if (err)
      res.send(err);

    res.json({
    	isSuccessfull: true,
    	groups: groups
    });
  });
}