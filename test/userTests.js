var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var express = require('express');
var passport = require('passport');
var app = express();
var user = require('../routes/users');
var router = require('../server');
var bodyParser = require('body-parser').json();

// Use the passport package in our application
app.use(passport.initialize());
app.use(bodyParser);
app.use('/', router);

var newUser = {
	username: "",
	password: "eenPass",
}
var newGroup = {
	_id: ""
}

var base = {'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json'};

function makeGetRequest(route, statusCode, done){
	request(app).get(route).set(base).expect(statusCode)
	.expect('Content-type', 'application/json; charset=utf-8').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

function addUserRequest(route, json, statusCode, done){
	request(app).post(route).set({'Content-Type': 'application/json'}).send(json)
	.expect(statusCode)
	.expect('Content-type', 'application/json; charset=utf-8').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

function postRequestNoJSON(route, statusCode, done){
	request(app).post(route).set(base)
	.expect(statusCode)
	.expect('Content-type', 'application/json; charset=utf-8').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

function updateGroupName(route, json, statusCode, done){
	request(app).put(route).set(base).send(json)
	.expect(statusCode)
	.expect('Content-type', 'application/json; charset=utf-8').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

function makeDeleteRequest(route, statusCode, done){
	request(app).delete(route).set(base).expect(200).expect('Content-Type', 'application/json; charset=utf-8').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

describe('Testing /users', function(){
	describe('Making a user', function(){
		it('STEP 1: Make a test user in the database', function(done){
			newUser.username = "testUser" + (new Date).getTime();
			addUserRequest('/users', newUser, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.username).to.equals(newUser.username);
				expect(res.body.password).to.equals(newUser.password);
				expect(res.body.isSuccessfull).to.equals(true);
				done();
			});
		});
		it('STEP 2: Log in route', function(done){
			postRequestNoJSON('/login', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.isSuccessfull).to.equals(true);
				expect(res.body.groups).to.be.array;
				done();
			});
		});
		it('STEP 3: Making a group', function(done){
			var url = '/groups/' + new Date().getTime();
			postRequestNoJSON(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.message).to.not.be.null
				expect(res.body.data).to.not.be.null
				newGroup._id = res.body.data._id;
				done();
			});
		});
		it('STEP 4: Getting groups of the user', function(done){
			makeGetRequest('/groups', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.be.array;
				expect(res.body[0].creator).to.equals('admin');
				done();
			});
		});
		it('STEP 5: Adding a user to the group', function(done){
			var url = '/groups/' + newGroup._id + '/addUser/sven'; 
			postRequestNoJSON(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.not.be.null;
				expect(res.body.creator).to.equals('admin');
				done();
			});
		});
		it('STEP 6: Update the groupname to "FrietIsLekkerEnzo"', function(done){
			var url = '/groups/' + newGroup._id;
			updateGroupName(url, {"name": "FrietIsLekkerEnzo"}, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.not.be.null
				expect(res.body._id).to.equals(newGroup._id);
				done();
			});
		});
		it('STEP 7: Delete the group', function(done){
			var url = '/groups/' + newGroup._id;
			makeDeleteRequest(url, 200, function(err, res){
				if(err){ return done(err); }


				done();
			});
		});
		it('STEP 8: Delete the test user', function(done){
			var deleteRoute = '/users/' + newUser.username;
			makeDeleteRequest(deleteRoute, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.isSuccessfull).to.equals(true);
				done();
			});
		});
	});
});