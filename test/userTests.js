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
var base = {'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json'};

function makePostRequest(route, json, statusCode, done){
	request(app).post(route).set({'Content-Type': 'application/json'}).send(json).expect(statusCode).expect('Content-type', 'application/json').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

function makeDeleteRequest(route, statusCode, done){
	request(app).delete(route).set(base).expect(200).expect('Content-Type', 'application/json').end(function(err, res){
		if(err) {
			done(err);
		} else {
			done(null, res);
		}
	});
}

function standardEnd(err, res, done){
	
}

describe('Testing /users', function(){
	describe('Making a user', function(){
		it('STEP 1: Make a test user in the database', function(done){
			newUser.username = "testUser" + (new Date).getTime();
			makePostRequest('/users', newUser, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.username).to.equals(newUser.username);
				expect(res.body.password).to.equals(newUser.password);
				expect(res.body.isSuccessfull).to.equals(true);
				done();
			});
		});
		it('STEP 2: Delete the test user', function(done){
			var deleteRoute = '/users/' + newUser.username;
			makeDeleteRequest(deleteRoute, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.isSuccessfull).to.equals(true);
				done();
			});
		});
	});
});