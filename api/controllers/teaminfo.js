var Team = require('../models/teams');
var User = require('../models/Users');
var userinfo = require('./userinfo');
var auth = require('./authenticate').module;
//console.log("Here is authenticate");
//console.log(auth);
var teaminfo = {};
teaminfo.getTeamByid = function (teamid, season)
{
console.log("in teambyid");
console.log(teamid);
return new Promise(function(resolve,reject){
Team.findOne({ 'teamid': teamid, 'season': season}, function (err, team) {
  if (err)
  {
    console.log("In ERROR ON TEAM SEARCH");
    console.log(err);
    reject(err);
  }
  console.log("NO ERROR ON SEARCH");
  console.log(team);
  resolve(team);
});
});

}


teaminfo.getTeams = function (season)
{

return new Promise(function(resolve,reject){
Team.find({'season':season },function (err, teams) {
  if (err)
  {
    reject(err);
  }
  console.log(teams);
  resolve(teams);
});
});
}


teaminfo.getTeamNameByid = function (hometeam,awayteam, season, gameid)
{
  console.log("IN THE TEAM NAME FUNCTION 13423142314231");
  console.log(hometeam);
  console.log(awayteam);
  console.log(gameid);


  return new Promise(function (resolve,reject){


var hometeam1;
  teaminfo.getTeamByid(hometeam,season)
  .then( hometeam => {
    hometeam1 = hometeam;
    teaminfo.getTeamByid(awayteam,season)
    .then( awayteam => {

        var teamnames = new Object();
        teamnames.hometeam = hometeam1.teamname;
        teamnames.awayteam = awayteam.teamname;
        teamnames.gameid = gameid;
        console.log("HERE IS THE TEAM NAME OBJECT !@#@$#!%#@%!%!#$%#@%!@")
        console.log(teamnames);
        resolve(teamnames);

    })
    .catch(error =>{
      console.log(error);
    })
  })
  .catch(error =>{
    console.log(error);
  })
    })

}


teaminfo.getNameOnRoster= function(roster)
{
  console.log("IN GET NAME ON ROSTER");
  console.log(roster);
  return new Promise(function(resolve,reject){
  roster_array = [];
  for( var x =0; x<roster.length; x++)
  {
    console.log("IN FOR LOOP FOR USERS");
    console.log(roster[x]);
    var prom = userinfo.getuserByid(roster[x]);
    roster_array.push(prom);
  }
  console.log("HERE IS ROSTER ARRAY OF PROMISES");
  console.log(roster_array);
resolve(roster_array);
reject(error);
});
}

teaminfo.getTeamsArrayinfo = function (teamarray, season)
{
  console.log("in team array info");
return new Promise(function(resolve,reject){
var teams_promise = [];
console.log(teamarray);
for (var x=0; x<teamarray.length; x++)
{
  var prom = teaminfo.getTeamByid(teamarray[x], season);
  teams_promise.push(prom);

}
resolve(teams_promise);
reject("Error occured");
});
}

teaminfo.combined_roster= function(team, fullroster){
  return new Promise(function(resolve,reject){


    team["fullroster"] = fullroster;

    resolve(team);

  })


}


teaminfo.addTeam = function (teamid, sport, category, division, season, teamname )
{

  var newteam = new Team({
  teamid: teamid,
  sport: sport,
  category: category,
  division: division,
  season: season,
  teamname, teamname,
  win: 0,
  loss: 0
  });

return new Promise (function(resolve,reject){
newteam.save(function(err){

  if (err)
  {
    reject(err);
  }

  resolve("Team is Saved!");
});

});
}



teaminfo.combineall = function(finishedarray){
  return new Promise (function (resolve, reject){

var tryarray =[]
for(var xx = 0; xx<finishedarray.length; xx++)
{

var push =  teaminfo.combineall2(finishedarray[xx]);
tryarray.push(push);

}

    resolve(tryarray);
    })
  }

  teaminfo.updateTeam = function (teamid,userid)
  {
    console.log(teamid);
    console.log(userid);
    return new Promise( function(resolve,reject){
      Team.update({"teamid": teamid},{$push: {roster: userid}}, function(err,team){

        resolve(team);
        reject(err);


      })
    })


  }


teaminfo.combineall2 = function(finished){
  return new Promise (function (resolve, reject){




  teaminfo.getNameOnRoster(finished.roster)
  .then(function(fullroster){
    Promise.all(fullroster).then(complete =>{
      resolve(complete);

    });
    })
  });
}




module.exports = teaminfo;
