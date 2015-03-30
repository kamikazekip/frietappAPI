// Load required packages
var Group = require('../models/group');
var Order = require('../models/order');

exports.getGroupOrders = function(req, res){
  var group_id = req.params.group_id;
  Group.findOne({ "_id": group_id }, function(err, group){
    if(err)
      res.send(err);

    Order.find({ '_id': { $in: group.orders } }, function(err, orders){
      if(err)
        res.send(err);
      res.json(orders);
    });
  });
}

exports.postGroupOrder = function(req, res){
  var order       = new Order();

  order.creator     = req.user.username;
  order.date        = new Date();
  order.group_id    = req.params.group_id;
  order.active      = true
  order.dishes      = []
  order.snackbar    = req.body
  order.save(function(err, newOrder){
    if(err)
      res.send(err);

    Group.findByIdAndUpdate( newOrder.group_id, { $push: { "orders": newOrder._id } }, function(err, group) {
      if (err)
        res.send(err);

      res.json({
        group: group,
        order: newOrder
      });
    });
  });
}

exports.putOrder = function(req, res){
 
  var order_id = req.params.order_id;
  Order.findOneAndUpdate({"_id": order_id}, {active: false}, function(err, order){
    if(err)
      res.send(err);
    res.json(order);
  });
}

exports.deleteOrder = function(req, res){
  Order.remove({"_id": req.params.order_id}, function(err){
    if(err)
      res.send(err);

    res.json({"message": "order " + req.params.order_id + " deleted!"});
  });
}