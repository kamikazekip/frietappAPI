// Load required packages
var Group = require('../models/group');
var Order = require('../models/order');

// Create endpoint /groups for POST
exports.postGroup = function(req, res) {
  var group = new Group();

  group.name = req.params.group_id;
  group.creator =  req.user.username;
  group.users = [req.user.username]

  // Save the group and check for errors
  group.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Groep toegevoegd!', data: group });
  });
};

exports.addUserToGroup = function(req, res){
  var group_id = req.params.group_id;


  var username = req.params.username;
  Group.findByIdAndUpdate( group_id, {$push: {"users": username}}, function(err, group) {
      if (err)
        res.send(err);

      res.json(group);
  });
};

exports.putGroup = function(req, res){
  var group_id = req.params.group_id;
  Group.findByIdAndUpdate( group_id, {"name": req.body.name}, function(err, group){
    if( err) 
      res.send(err);
    res.json(group);
  });
}

// Create endpoint /groups for GET
exports.getGroups = function(req, res) {
  

  // Use the Group model to find all groups
  Group.find({ users: req.user.username }, function(err, groups) {
    if (err){
      res.send(err);
    }
    else{
        var io = req.io;
        var update = {"update" : "orders"};
        io.on("connection", function (socket) {

           for(var i = 0 ; i < groups.length; i ++){
               // connecten met een room.
                socket.join('room'+groups[i]._id);
            }        
            socket.join("1234");
        });
        update = {field: "roomsssss"};
        io.to('room').emit("update", update);
        
        res.json(groups);
    }
      
   
  });
};

// Create endpoint /groups/:group_id for DELETE
exports.deleteGroup = function(req, res) {
  // Use the Group model to find a specific group and remove it
  Group.remove({_id: req.params.group_id, creator: req.user.username }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Groep verwijderd uit de database' });
  });
};