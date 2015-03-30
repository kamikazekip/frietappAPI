// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var path = require('path');
var role = require('./controllers/connectroles')();
var passport = require('passport');

//Require all the controllers
var authController      = require('./controllers/auth');
var userController      = require('./controllers/user');
var loginController     = require('./controllers/login');
var groupController     = require('./controllers/group');
var orderController     = require('./controllers/order');
var dishController      = require('./controllers/dish');
var snackbarController  = require('./controllers/snackbar');

// Connect to the MongoDB
mongoose.connect('mongodb://admin:admin@ds053139.mongolab.com:53139/frietapp');

// Create our Express application
var app = express();

var http = require('http').createServer(app);
var io = require("socket.io")(http);
http.listen(8080, "https://desolate-bayou-9128.herokuapp.com/");

var update = {field: "groups"};



io.on("connection", function (socket) {
  var update = {field: "groups"};
  // connecten met een room.
  socket.join('room');

  //emitten naar alle gebruikers in een room.
  io.to('room').emit("update", update);


    
    console.log("A user is connected");

    update = {field: "global"};
    io.emit("update", update);

    socket.on("disconnect", function () {
        "User disconnected";
    });
    var nsp = io.of('/frietapp');
    nsp.on('connection', function(socket){
      console.log('connected to frietapp namespace');
      
    });

});




// Make our db accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();

});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'img')));

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.103:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', true);



    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  
  next();
});

app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

router.route('/').get(authController.isAuthenticated, role.can('access admin resources'), function(req, res, next){
    res.render('index');
});

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/users/:username')
  .delete(authController.isAuthenticated, userController.deleteUser);

router.route('/login')
  .post(authController.isAuthenticated, loginController.login)

// Create endpoint handlers for /groups
router.route('/groups')
 .get(authController.isAuthenticated, groupController.getGroups);

router.route('/groups/:group_id')
  .delete(authController.isAuthenticated, groupController.deleteGroup)
  .post(authController.isAuthenticated, groupController.postGroup)
  .put(authController.isAuthenticated, groupController.putGroup);

router.route('/groups/:group_id/orders')
  .get(authController.isAuthenticated, orderController.getGroupOrders);

router.route('/groups/:group_id/order')
  .post(authController.isAuthenticated, orderController.postGroupOrder);

router.route('/groups/:group_id/addUser/:username')
  .post(authController.isAuthenticated, groupController.addUserToGroup);

//Create endpoint handlers for /order
router.route('/orders/:order_id')
  .put(authController.isAuthenticated, orderController.putOrder)
  .delete(authController.isAuthenticated, orderController.deleteOrder);

router.route('/orders/:order_id/dishes')
  .get(authController.isAuthenticated, dishController.getDishes)

router.route('/orders/:order_id/dish')
  .post(authController.isAuthenticated, dishController.postDish);

//Create endpoint handlers for /snackbars
router.route('/snackbars')
  .get(authController.isAuthenticated, snackbarController.getSnackbarsDummy);

app.use('/', router);

// Start the server
app.listen(process.env.PORT || 8000);

module.exports = router;