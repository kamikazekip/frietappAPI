var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var path = require('path');
var express = require('express');
var passport = require('passport');
var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
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

var newOrder = {
	_id: ""
}

var newDish = {
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

function postRequest(route, json, statusCode, done){
	request(app).post(route).set(base).send(json)
	.expect(statusCode)
	.expect('Content-type', 'application/json; charset=utf-8').end(function(err, res){
		if(err) {var path = require('path');
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

function updateOrderActive(route, statusCode, done){
	request(app).put(route).set(base)
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

describe('Testing the API', function(){
	describe('Users', function(){
		it('TEST 1: Register a test user', function(done){
			newUser.username = "testUser" + (new Date).getTime();
			addUserRequest('/users', newUser, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.username).to.equals(newUser.username);
				expect(res.body.password).to.equals(newUser.password);
				expect(res.body.isSuccessfull).to.equals(true);
				done();
			});
		});
		it('TEST 2: Log in test user', function(done){
			postRequestNoJSON('/login', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.isSuccessfull).to.equals(true);
				expect(res.body.groups).to.be.array;
				done();
			});
		});
		it('TEST 3: Retreiving all users', function(done){
			makeGetRequest('/users', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.not.be.null;
				expect(res.body).to.be.array;
				done();
			});
		});
		it('TEST 4: Accessing the admin panel', function(done){
			request(app).get('/').set(base).expect(200)
			.expect('Content-type', 'text/html; charset=utf-8').end(function(err, res){
				if(err) {
					return done(err);
				} else {
					expect(res.body).to.not.be.null;
					done();
				}
			});
		});
	});
	describe('Groups', function(){
		it('TEST 5: Making a group', function(done){
			var url = '/groups/' + new Date().getTime();
			postRequestNoJSON(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.message).to.not.be.null
				expect(res.body.data).to.not.be.null
				newGroup._id = res.body.data._id;
				done();
			});
		});
		it('TEST 6: Getting groups of the user', function(done){
			makeGetRequest('/groups', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.be.array;
				done();
			});
		});
		it('TEST 7: Adding a user to the group', function(done){
			var url = '/groups/' + newGroup._id + '/addUser/sven'; 
			postRequestNoJSON(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.not.be.null;
				expect(res.body.creator).to.equals('admin');
				done();
			});
		});
		it('TEST 8: Update the groupname to "FrietIsLekkerEnzo"', function(done){
			var url = '/groups/' + newGroup._id;
			updateGroupName(url, {"name": "FrietIsLekkerEnzo"}, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.not.be.null;
				expect(res.body._id).to.equals(newGroup._id);
				done();
			});
		});
	});
	describe('Orders', function(){
		it('TEST 9: Adding a test order to the made group', function(done){
			var url = '/groups/' + newGroup._id + '/order';
			postRequest(url, {"snackbar": "De stip", "url": "http://url.com"}, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.group).to.not.be.null;
				expect(res.body.group._id).to.equals(newGroup._id);
				expect(res.body.order).to.not.be.null;
				expect(res.body.order.creator).to.equals('admin');
				newOrder._id = res.body.order._id;
				done();
			});
		});
		it('TEST 10: Getting snackbar suggestions for a new order', function(done){
			var url = '/snackbars/?lat=51.6978162&long=5.3548050';
			makeGetRequest(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.be.array
				expect(res.body[0].snackbar).to.not.be.null;
				done();
			});
		});
		it('TEST 11: Get all orders in the made group', function(done){
			var url = '/groups/' + newGroup._id + '/orders';
			makeGetRequest(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body[0]._id).to.equals(newOrder._id);
				expect(res.body[0].creator).to.equals('admin');
				done();
			});
		});
		it('TEST 12: Get all orders in the made group ordered by active', function(done){
			var url = '/groups/' + newGroup._id + '/orders?orderBy=active';
			makeGetRequest(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body[0].active).to.equals(true);
				done();
			});
		});
		it('TEST 13: Change the made order active status to false', function(done){
			var url = '/orders/' + newOrder._id;
			updateOrderActive(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.not.be.null;
				expect(res.body._id).to.equals(newOrder._id);
				expect(res.body.creator).to.equals('admin');
				done();
			});
		});
	});
	describe("Dishes", function(){
		it('TEST 14: Adding a dish ( frikandel ) to the made order', function(done){
			var url = '/orders/' + newOrder._id + "/dish";
			postRequest(url, { "dish": "Frikandel" }, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.order).to.not.be.null;
				expect(res.body.order._id).to.equals(newOrder._id);
				expect(res.body.dish.dish).to.equals("Frikandel");
				expect(res.body.dish.creator).to.equals("admin");
				newDish._id = res.body.dish._id;
				done();
			});
		});
		it("TEST 15: Getting that dish ( frikandel ) from the made order", function(done){
			var url = '/orders/' + newOrder._id + "/dishes";
			makeGetRequest(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body[0]).to.not.be.null;
				expect(res.body[0]._id).to.equals(newDish._id);
				expect(res.body[0].creator).to.equals("admin");
				done();
			});
		});
	});
	describe('Deleting junk', function(){
		it('TEST 16: Delete the test order', function(done){
			var url = '/orders/' + newOrder._id;
			makeDeleteRequest(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.message).to.not.be.null;
				done();
			});
		});
		it('TEST 17: Delete the test group', function(done){
			var url = '/groups/' + newGroup._id;
			makeDeleteRequest(url, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.message).to.not.be.null;
				done();
			});
		});
		it('TEST 18: Delete the test user', function(done){
			var deleteRoute = '/users/' + newUser.username;
			makeDeleteRequest(deleteRoute, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.isSuccessfull).to.equals(true);
				done();
			});
		});
		it('TEST 19: Delete the test dish', function(done){
			var deleteRoute = '/dishes/' + newDish._id;
			makeDeleteRequest(deleteRoute, 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.message).to.not.be.null;
				done();
			});
		});
	});
});