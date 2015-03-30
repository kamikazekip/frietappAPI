var Order = require('../models/order');
var Dish  = require('../models/dish');

exports.getDishes = function(req, res){
 
  var order_id = req.params.order_id;
  Order.findOne({ "_id": order_id }, function(err, order){
    if(err)
      res.send(err);

    Dish.find({ '_id': { $in: order.dishes } }, function(err, dishOrders){
      if(err)
        res.send(err);
      res.json(dishOrders);
    });
  });
}

exports.postDish = function(req, res){
  
  io = req.io;
  var update = {"update" : "orders"};
  io.emit("update", update);
  console.log('order geplaatst');
      
  var dish       = new Dish();

  dish.creator     = req.user.username;
  dish.order_id   = req.params.order_id;
  dish.dish       = req.body.dish;
  dish.date        = new Date();

  dish.save(function(err, newDish){
    if(err)
      res.send(err);

    Order.findByIdAndUpdate( newDish.order_id, { $push: { "dishes": newDish._id } }, function(err, order) {
      if (err)
        res.send(err);

      res.json({
        order: order,
        dish: newDish
      });
    });
  });
}