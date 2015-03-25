// Load required packages
var Group = require('../models/group');

// Create endpoint /groups for POST
exports.postGroup = function(req, res) {
  var group = new Group();

  group.name = req.params.group_id;
  group.creator = {_id: req.user._id, name: req.user.username}
  group.userIds = [req.user._id]

  // Save the group and check for errors
  group.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Groep toegevoegd!', data: group });
  });
};

// Create endpoint /groups for GET
exports.getGroups = function(req, res) {
  // Use the Group model to find all groups
  Group.find({ userIds: req.user._id }, function(err, groups) {
    if (err)
      res.send(err);

    res.json(groups);
  });
};

// Create endpoint /groups/:group_id for DELETE
exports.deleteGroup = function(req, res) {
  // Use the Group model to find a specific group and remove it
  Group.remove({ userIds: req.user._id, _id: req.params.group_id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Groep verwijderd uit de database' });
  });
};