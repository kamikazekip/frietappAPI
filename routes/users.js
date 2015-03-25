var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Load required packages
var User = require('../models/user');


router.get('/', function(req, res, next){
	User.find(function(err, users) {
    	if (err)
     	res.send(err);

    	res.json(users);
  	});
});

// Create endpoint /api/users for POST
router.post('/', function(req, res, next){
	var user = new User({
    	username: req.body.username,
    	password: req.body.password
  	});

  	if(req.body.rights){
    	user.rights = req.body.rights;
  	}

  	user.save(function(err) {
    	if (err)
     	res.send(err);

    	res.json({ 
     		"isSuccessfull": true,
      		"username": req.body.username,
      		"password": req.body.password
    	});
  	});	
});

router.delete('/:username', function(req, res, next){
	User.remove({"username": req.params.username}, function(err, result){
    	res.send((result === 1) ? { msg: '' } : { msg: "error: " + err });
 	});
});
  
