// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  if(req.body.roles){
    var roles = [];
    roles.push(req.body.roles);
    user.roles = roles;
  } else {
    user.roles = ["user"];
  }

   User.find({username : req.body.username}, function (err, docs) {
        if (docs.length){
            res.json({
              "isSuccessfull": false,
              "userAlreadyExists": true
            })
        }else{
            user.save(function(err) {
              if (err)
                res.send(err);

              res.json({ 
                "isSuccessfull": true,
                "username": req.body.username,
                "password": req.body.password
              });
            });
        }
    });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
}

exports.deleteUser = function(req, res){
  User.remove({"username": req.params.username}, function(err, result){
    res.send((result === 1) ? { isSuccessfull: true } : { msg: "error: " + err });
  });
}