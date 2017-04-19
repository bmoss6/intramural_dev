var express = require('express');
var userinfo = require('./api/controllers/userinfo');
var teaminfo = require('./api/controllers/teaminfo');
var seasoninfo = require('./api/controllers/seasoninfo');
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var router = express.Router();


router.route('/getprofile').get(function (req, res) {
var netid = req.user.username
userinfo.getuserByid(netid)
.then(result => {
  console.log("here is the result which should be the query in the new router");
  console.log(result);
res.header("Access-Control-Allow-Origin", "*");
res.status('200').send(result);
 })
.catch(error => { console.log(error)});


});



router.route('/adduser').post(function (req, res) {

userinfo.addUser(req.body.first_name, req.body.last_name, req.body.dob, req.body.email,  req.body.username,  req.body.pass)
.then(result => {
  console.log("here is the result which should be the query in the new router");
  console.log(result);
res.header("Access-Control-Allow-Origin", "*");

res.status('200').send("Success");
 })
.catch(error => {

  console.log(error);

  res.status('200').send("Net ID Taken");


});


});

router.route('/edituser').post(function (req, res) {

userinfo.updateUser(req.user.username, req.body.first_name, req.body.last_name, req.body.dob, req.body.email)
.then(result => {
  console.log(result);
res.header("Access-Control-Allow-Origin", "*");

res.status('200').send("Success");
 })
.catch(error => {

  console.log(error);

  res.status('200').send("Net ID Taken");


});


});



router.route('/getUsers').get(function (req, res) {

userinfo.getallusers()
.then(newstuff =>{

  res.status('200').send(newstuff);
})



});


router.route('/getGames').post(function (req, res) {
console.log("GETGAMES CALLED#@$@#$@#@#$");
console.log(req.body.season);
  seasoninfo.getGamesAll(req.body.season)
  .then(newstuff =>{
    console.log("ALGAMEMEMEMERKEQWRJEWQRWEQLJEWRRKEWRLQWRKEWLRKEWJREWQ");

    res.status('200').send(newstuff);
  })


});

router.route('/getTeams').post(function (req, res) {

  teaminfo.getTeams(req.body.season)
  .then(newstuff =>{

    res.status('200').send(newstuff);
  })



});







router.route('/addplayer').post(function (req, res) {

teaminfo.updateTeam(req.body.teamid,req.body.netid)
.then(result => {
  console.log(result);
res.header("Access-Control-Allow-Origin", "*");

res.status('200').send("Success");
 })
.catch(error => {

  console.log(error);

  res.status('200').send("Net ID Taken");


});


});

router.route('/getTeamNames').post(function (req, res) {
console.log(req.body)
console.log("Hit it!")

var teamsobject = req.body.teamobject;



game_names(teamsobject)
.then(results => {
  console.log("FIRST");
  console.log(results);

  Promise.all(results)
  .then(newresults =>{

    console.log(newresults);
    Promise.all(newresults)
    .then(fresh => {
      var merged = [].concat.apply([],fresh);

      console.log(merged);
      Promise.all(merged)
      .then(seeit => {
        console.log("341324123;l4j321kl4j");
        console.log(seeit);
        res.status('200').send(seeit);
      })

    })
  })
})


});



function game_names(teamsobject)
{
  return new Promise(function (resolve,reject){


  var real_array = [];

  for (var y = 0; y<teamsobject.length; y++)
  {
      real_array.push(process_games(teamsobject[y].games)); //The array of games for each team needs to be processed.
  }
  resolve(real_array);

})
}



function process_games(gamesarray)
{
  if(gamesarray!=undefined) {
    return new Promise (function(resolve, reject){
      var game_promises_perteam =[];
      for( var x = 0; x<gamesarray.length; x++)
      {
          console.log(gamesarray[x]);
          console.log("SHOULD BEEE GAME ID DAJKF;SKDJKLFS13423142314231");
        console.log(gamesarray[x].game_id);
        var add = gamesarray[x].game_id;
          var prom = teaminfo.getTeamNameByid(gamesarray[x].home_team, gamesarray[x].away_team,  gamesarray[x].season, add);
          game_promises_perteam.push(prom);
      }

      resolve(game_promises_perteam);



    })
}
}











router.route('/getSeason').get(function (req, res) {
  console.log("1HERE IN THE getScheduleforTeamarray ###################");

  var netid = req.user.username
  console.log(netid);
  var cur_season = seasoninfo.getCurrentSeason();
  userinfo.getuserByid(netid)
  .then(result => {
  //console.log(result.team_ids);
  var teamarray = result.team_ids;
  teaminfo.getTeamsArrayinfo(teamarray, cur_season).then(function(result){
  //console.log("This should be the array of promises");
  Promise.all(result).then(finishedarray => {

  seasoninfo.getScheduleforTeamarray(finishedarray, cur_season)
  .then(schedulearray =>{
    console.log("HERE IN THE getScheduleforTeamarray ###################");
    console.log(schedulearray);
    Promise.all(schedulearray).then(finalschedule => {

      var finalscheduleob= new Object();
      finalscheduleob.teaminfo = finishedarray;
      finalscheduleob.scheduleinfo = finalschedule;
      finalscheduleob.cur_season = cur_season;
      res.status('200').send(finalscheduleob);

    })

  })




      })

      .catch(error => {
        console.log("IN ERROR AFTER GET ROSTER");
        console.log(error);
      });

    });



  })
  .catch(error => {
    console.log(error);
  })





  res.header("Access-Control-Allow-Origin", "*");




});








router.route('/getTeam').get(function (req, res) {
var netid = req.user.username
var cur_season = seasoninfo.getCurrentSeason();
userinfo.getuserByid(netid)
.then(result => {
//console.log(result.team_ids);
var teamarray = result.team_ids;
teaminfo.getTeamsArrayinfo(teamarray, cur_season).then(function(result){
//console.log("This should be the array of promises");
Promise.all(result).then(finishedarray => {
  var final_roster =[];


  teaminfo.combineall(finishedarray)
  .then(tryit =>
  {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(tryit);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
  Promise.all(tryit).then(final_rosters => {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(final_rosters);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log(finishedarray);
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var finaldone = new Object();
    finaldone.finishedstuff = finishedarray;
    finaldone.final_rosters1 = final_rosters;
    finaldone.cur_season = cur_season;
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^SHOULD hahve!!")
    console.log(finishedarray);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    res.status('200').send(finaldone);
  })


  })



    })

    .catch(error => {
      console.log("IN ERROR AFTER GET ROSTER");
      console.log(error);
    });

  });



})
.catch(error => {
  console.log(error);
})





res.header("Access-Control-Allow-Origin", "*");
 });











module.exports = router;
