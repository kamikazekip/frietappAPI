// Load required packages
var mongoose = require('mongoose');

// Define group schema
var GroupSchema   = new mongoose.Schema({
  name: String,
  creator: {
  	_id: String,
  	name: String
  },
  userIds: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('Group', GroupSchema);