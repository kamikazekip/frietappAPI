// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var groupController = require('./controllers/group');
var path = require('path');

var passport = require('passport');
var authController = require('./controllers/auth');
var userController = require('./controllers/user');
var loginController = require('./controllers/login');

// Connect to the MongoDB
mongoose.connect('mongodb://admin:admin@ds053139.mongolab.com:53139/frietapp');

// Create our Express application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

router.route('/').get(authController.isAuthenticated ,function(req, res, next){
  if(req.user.rights === 1){
    res.render('index');
  } else{
    res.statusCode = 401;
    res.send("Unauthorized - geen admin rechten!");
  }
	
});

// Create endpoint handlers for /groups
router.route('/groups')
 .get(authController.isAuthenticated, groupController.getGroups);

// Create endpoint handlers for /groups/:group_id
router.route('/groups/:group_id')
  .delete(authController.isAuthenticated, groupController.deleteGroup)
  .post(authController.isAuthenticated, groupController.postGroup);

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/users/:username')
  .delete(authController.isAuthenticated, userController.deleteUser);

router.route('/login')
  .post(authController.isAuthenticated, loginController.login)

// Register all our routes with /api
app.use('/', router);

// Start the server
app.listen(8000);

module.exports = router;