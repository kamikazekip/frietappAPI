// Load required packages
var mongoose = require('mongoose');

// Define group schema
var GroupSchema   = new mongoose.Schema({
  name: String,
  creator: String,
  users: [String],
  orders: [{ type: String, ref: 'Order' }]
}, { versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('Group', GroupSchema);