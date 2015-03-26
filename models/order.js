// Load required packages
var mongoose = require('mongoose');

// Define group schema
var OrderSchema   = new mongoose.Schema({
  creator: String,
  date: Date,
  group_id: { type: String, ref: 'Group' },
  active: Boolean,
  dishes: [{ type: String, ref: 'Dish' }]
}, { versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('Order', OrderSchema);