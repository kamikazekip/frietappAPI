// Load required packages
var mongoose = require('mongoose');

// Define group schema
var DishSchema   = new mongoose.Schema({
  creator: String,
  order_id: { type: String, ref: 'Dish' },
  dish: String,
  date: Date
}, { versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('Dish', DishSchema);