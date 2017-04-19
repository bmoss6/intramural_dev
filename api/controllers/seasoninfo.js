var Team = require('../models/teams');
var User = require('../models/Users');
var userinfo = require('./userinfo');
var Games = require('../models/games');

var teaminfo = require('./teaminfo');

var auth = require('./authenticate').module;
//console.log("Here is authenticate");
//console.log(auth);
var seasoninfo = {};

seasoninfo.getCurrentSeason = function ()
{

  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() +6;
  console.log(month);
  console.log(year);

  var season;

  if(month<=4)
  {
    season = "w";
  }


  else if(month <=6)
  {
    season = "sp";
  }

  else if(month<=8)
  {
    season = "su";
  }

  else if(month<=12)
  {
    season = "f";
  }

  var fullseason_year = season + year;
  console.log(fullseason_year);
  return fullseason_year;
}

seasoninfo.getTeamschedule= function(teamid,season)
{
  console.log('IN THE ACTUAL GET TEAM SCHEDULE!!!');
  console.log(teamid);
  console.log(season);
    return new Promise(function(resolve,reject){

      Games.find({
    $and : [
        { 'season':season },
        { $or : [ { 'home_team': teamid },   { 'away_team':teamid }  ] }
    ]
}, function (err, games) {
        if (err)
        {
          reject(err);
        }
        console.log("HERE SHOULD BE THE GAMES!!!!!!!!!");

        seasoninfo.getTeamNamesinSchedule(games, season)
        .then(promisearray =>
        {
          Promise.all(promisearray)
          .then(namearray =>{
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@ SHOULD BE NAME ARRAY');
            console.log(namearray)
            resolve(games);

          })

        })





      });


    });



}

seasoninfo.getTeamNamesinSchedule = function(gamearray,season)
{

  return new Promise (function (resolve,reject){

    var namearray=[];
    for(var t=0; t<gamearray.length; t++)

    {
      var push = teaminfo.getTeamNameByid(gamearray[t].home_team, gamearray[t].away_team,season)
      namearray.push(push);



    }

    resolve(namearray);

  })








}

seasoninfo.getDivisionschedule= function(division, sport, season)
{



}

seasoninfo.getGamesbyField = function(field, season)
{



}

seasoninfo.getGamesAll = function (season)
{

return new Promise(function(resolve,reject){
Games.find({'season':season }, function (err, games) {
  if (err)
  {
    reject(err);
  }
  console.log(games);
  resolve(games);
});
});
}





seasoninfo.getScheduleforTeamarray = function(teamarray, season)
{
  console.log('GET SCHEUDLE FOR TEAM ARRAY!!!!!!!');
  return new Promise (function (resolve, reject)
  {
    var schedulearray = [];
      for(var xx=0; xx<teamarray.length; xx ++)
      {

        var push = seasoninfo.getTeamschedule(teamarray[xx].teamid, season);

        schedulearray.push(push);

      }

      resolve(schedulearray);

  })




}

module.exports = seasoninfo;
