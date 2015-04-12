// Load required packages
var Group = require('../models/group');
var Order = require('../models/order');
var qs = require('querystring');

exports.getGroupOrders = function(req, res){
  var str = req.url.split('?')[1];
  var queryStrings = qs.parse(str);

  var group_id = req.params.group_id;
  Group.findOne({ "_id": group_id }, function(err, group){
    if(err)
      res.send(err);

    if(group){
      Order.find({ '_id': { $in: group.orders } }, function(err, orders){
        if(err)
          res.send(err);

        if(Object.keys(queryStrings).length === 0){
            orders.sort(function(a, b){
              if(a["date"].getDate() < b["date"].getDate()) return 1;
              if(a["date"].getDate() > b["date"].getDate()) return -1;
              return 0;
            });
            for(var x = 0; x < orders.length; x++){
              console.log(orders[x]["date"].getDate())
            }
            res.json(orders);
        } else {
            orders.sort(function(a,b){
              if (b[queryStrings.orderBy] < a[queryStrings.orderBy]) return -1;
              if (b[queryStrings.orderBy] > a[queryStrings.orderBy]) return 1;
              if(b["date"].getDate() < a["date"].getDate()) return -1;
              if(b["date"].getDate() > a["date"].getDate()) return 1;
              return 0;
            });
            for(var x = 0; x < orders.length; x++){
              console.log(orders[x]["date"].getDate())
            }
            res.json(orders);
        }
      });
    } else {
      res.send("Deze groep bestaat niet!");
    }
  });
}

exports.postGroupOrder = function(req, res){
  var order       = new Order();

  order.creator     = req.user.username;
  order.date        = new Date();
  order.group_id    = req.params.group_id;
  order.active      = true
  order.dishes      = []
  if(req.body.telephone == undefined){
    req.body.telephone = "0000000"
  } else {
    req.body.telephone = req.body.telephone.replace(/\s+/g, '');
  }
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