// grab the things we need
var mongoose = require('../../db');
var Schema = mongoose.Schema;

// create a schema
var gameSchema = new Schema({
  game_id: String,
  season: String,
  sport: String,
  division: String,
  home_team: String,
  away_team: String,
  field_id: String,
  date: String,
  time: String,
  ref_ids: [],
  supervisor_id: String
});


var Games = mongoose.model('Games', gameSchema, 'Games');



// make this available to our users in our Node applications
module.exports = Games;
