// grab the things we need
var mongoose = require('../../db');
var Schema = mongoose.Schema;

// create a schema
var teamSchema = new Schema({
  teamid: String,
  sport:String,
  category: String,
  division: String,
  season: String,
  teamname: String,
  win: Number,
  loss: Number,
  ranking: Number,
  roster: [String]
});


var Teams = mongoose.model('Teams', teamSchema, 'Teams');



// make this available to our users in our Node applications
module.exports = Teams;
