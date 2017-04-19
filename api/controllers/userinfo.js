var User = require('../models/Users');
var auth = require('./authenticate').module;
//console.log("Here is authenticate");
//console.log(auth);
var userinfo = {};
userinfo.getuserByid = function (netid)
{

return new Promise(function(resolve,reject){
User.findOne({ 'netid': netid }, function (err, user) {
  if (err)
  {
    reject(err);
  }
  resolve(user);
});
});
}
userinfo.getallusers = function ()
{

return new Promise(function(resolve,reject){
User.find({ },('netid first_name last_name dob email team_ids'), function (err, users) {
  if (err)
  {
    reject(err);
  }
  console.log(users);
  resolve(users);
});
});
}



userinfo.updateTeam = function (teamid,userid)
{
  console.log(teamid);
  console.log(userid);
  return new Promise( function(resolve,reject){
    User.update({"netid": userid},{$push: {team_ids: teamid}}, function(err,user){

      resolve(user);
      reject(err);


    })
  })


}

userinfo.updateremoveTeam = function (teamid,userid)
{
  console.log(teamid);
  console.log(userid);
  return new Promise( function(resolve,reject){
    User.update({"netid": userid},{$pull: {'team_ids': teamid}}, function(err,team){

      resolve(team);
      reject(err);


    })
  })


}

userinfo.authenticate = function (netid,password)
{

  return new Promise(function(resolve,reject){
  userinfo.getuserByid(netid)
  .then(function(user){
if (user==null)
{
  console.log("No username found!!");
  reject("No username found");
}
else
{


var checkpass = auth.sha512(password,user.salt);
console.log("Comparing these two: ");
console.log(checkpass.passwordHash);
console.log(user.password);
if(checkpass.passwordHash === user.password)
{
  console.log("true!!!");
  resolve(user);
}

else
{
    resolve(false);
}

}
  })
  });


}


userinfo.addUser = function (first_name, last_name, dob, email, netid, password )
{
  var newpassinfo = auth.saltHashPassword(password);
console.log("IN ADD USER");
console.log("----------------------");
console.log(newpassinfo);
console.log("Here should be the password");
console.log(newpassinfo.password.passwordHash);
console.log(newpassinfo.salt);
  var newuser = new User({
  netid: netid,
  password: newpassinfo.password.passwordHash,
  salt: newpassinfo.salt,
  first_name: first_name,
  last_name: last_name,
  dob: dob,
  email: email,
  picture_ref: '',
  roles: ['player'],
  team_ids: []
  });

return new Promise (function(resolve,reject){
newuser.save(function(err){

  if (err)
  {
    reject(err);
  }

  resolve("User is Saved!");
});

});
}

userinfo.updateUser = function (id, first_name, last_name, dob, email)
{
  console.log(id);
    console.log(first_name);
      console.log(last_name);
        console.log(dob);
          console.log(email);
  return new Promise( function(resolve,reject){
    User.findOne({"netid": id}, function(err,user){

      user.first_name = first_name;
      user.last_name = last_name;
      user.dob = dob;
      user.email = email;

      user.save(function(err, updatedUser) {
        console.log("updatedUser!!!");
        resolve(updatedUser);
        reject(err);

      })
    })
  })


}




module.exports = userinfo;
