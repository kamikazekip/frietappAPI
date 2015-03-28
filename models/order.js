// Load required packages
var mongoose = require('mongoose');

// Define group schema
var OrderSchema   = new mongoose.Schema({
  creator: String,
  date: Date,
  group_id: { type: String, ref: 'Group' },
  active: Boolean,
  dishes: [{ type: String, ref: 'Dish' }],
  snackbar: { snackbar: String, url: String }
}, { versionKey: false });

OrderSchema.path('date').validate(function(){
	return this.date <= new Date();
}, 'Creation date can\'t be in the future!');

OrderSchema.path('active').validate(function(){
	return this.active === true || false
}, 'The active field has to be a Boolean!');

// Export the Mongoose model
module.exports = mongoose.model('Order', OrderSchema);