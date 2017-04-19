// grab the things we need
var mongoose = require('../../db');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  netid: String,
  password:String,
  salt: String,
  first_name: String,
  last_name: String,
  dob: String,
  email: String,
  picture_ref: String,
  roles:[String],
  team_ids: [String]
});


var User = mongoose.model('Users', userSchema, 'Users');



// make this available to our users in our Node applications
module.exports = User;
