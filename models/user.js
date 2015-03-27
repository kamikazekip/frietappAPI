// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

// Define our user schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [String]
}, { versionKey: false });

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

UserSchema.methods.hasAnyRole = function(roles){
    if(!Array.isArray(roles)){
      roles = [roles];
    }

    var lowerCaseRoles = _.map(this.roles, function(role){ return role.toLowerCase(); });
    for(var index in roles){
      if(_.contains(lowerCaseRoles, roles[index].toLowerCase())){
        // If any role matches, it's allright, we can return true;
        return true;
      }
    };

    return false;
  };

UserSchema.methods.hasAllRoles = function(roles){
    if(!Array.isArray(roles)){
      roles = [roles];
    }

    var lowerCaseRoles = _.map(this.roles, function(role){ return role.toLowerCase(); });
    for(var index in roles){
      if(!_.contains(lowerCaseRoles, roles[index].toLowerCase())){
        // If any role doesn't match, we can return false.
        return false;
      }
    };

    return true;
  };


// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);