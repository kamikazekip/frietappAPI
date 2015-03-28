// Load required packages
var mongoose = require('mongoose');

// Define group schema
var DishSchema   = new mongoose.Schema({
  creator: String,
  order_id: { type: String, ref: 'Dish' },
  dish: String,
  date: Date
}, { versionKey: false });

DishSchema.path('date').validate(function(){
	return this.date <= new Date();
}, 'Creation date can\'t be in the future!');

DishSchema.path('dish').validate(function(){
	return this.dish.length > 2;
}, 'The dish has to have 3 or more characters!');

// Export the Mongoose model
module.exports = mongoose.model('Dish', DishSchema);