var Order = require('../models/order');
var Dish  = require('../models/dish');

exports.getDishes = function(req, res){
 
  var order_id = req.params.order_id;
  Order.findOne({ "_id": order_id }, function(err, order){
    if(err)
      res.send(err);

    if(order){
      Dish.find({ '_id': { $in: order.dishes } }, function(err, dishOrders){
        if(err)
          res.send(err);
        res.json(dishOrders);
      });
    } else {
      res.send("Deze order bestaat niet!");
    }
  });
}

exports.postDish = function(req, res){
      
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

exports.deleteDish = function(req, res){
  Dish.remove({"_id": req.params.dish_id}, function(err){
    if(err)
      res.send(err);

    res.json({"message": "dish " + req.params.dish_id + " deleted!"});
  });
}