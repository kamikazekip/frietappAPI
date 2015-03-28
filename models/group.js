// Load required packages
var mongoose = require('mongoose');

// Define group schema
var GroupSchema   = new mongoose.Schema({
  name: String,
  creator: String,
  users: [String],
  orders: [{ type: String, ref: 'Order' }]
}, { versionKey: false });

GroupSchema.path('name').validate(function(){
	return this.name.length > 2;
}, 'The groupname has to have 3 or more characters!');

// Export the Mongoose model
module.exports = mongoose.model('Group', GroupSchema);