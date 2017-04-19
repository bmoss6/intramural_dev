var express = require('express');
var userinfo = require('./api/controllers/userinfo');
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
const LocalStrategy       = require('passport-local').Strategy;
const passport            = require('passport');
const session             = require('express-session');
var flash = require('connect-flash');
var path    = require("path");
var engine = require('ejs-locals');
var router = express.Router();

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("logging in!");

    userinfo.authenticate(username,password)
    .then(function(result, err){
      console.log("The login result was: " + result);
      if (result!=false)
      {
      //    console.log("Authentication RESULTS!@#$!@#$");
      //    console.log(result.roles);
          return done(null, { username: username, roles: result.roles});
      }
      else {
        return done(null, false ,{message: "Invalid netid or password!"});
      }


    })
    .catch(function(error){
      console.log("username was not found!");
      return done(null, false, {message:"No netid found!"});
    });
    //check database to see if username exists

  }
));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
  //console.log('serialize');
  //console.log(user);
    done(null, {username : user.username, roles : user.roles});
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(user ,done) {
  //console.log('deserialize');
  //console.log(user);
    done(null, { username: user.username, roles: user.roles});
});



router.route('/login-form').get(function (req, res) {
  console.log("GETTING TO LOGIN FORM");
  console.log(req.flash('Hello'));
  if(!req.user)
  {
    console.log("In login form without user authenticated");
  //  console.log(__dirname);
    res.render(path.join(__dirname + '/views/login1.ejs'));

  }
  else{
    console.log(req.user);
    console.log("Inside login form with authenticated user!");
 res.header("Access-Control-Allow-Origin", "*");
  res.sendFile(__dirname + '\\index.html');
}

});



router.route('/').get(function (req, res) {
  if(!req.user)
  {
    console.log("User not logged in");
    console.log("---------------------------------")
    console.log("SHOULD REDIRECT in / without user authen");
    console.log(req.user);
    console.log("HERE IS THE USER ADDED VARIABLE --------------");
    console.log(req.session.success)
    var useradded = req.session.success;
    var error = req.session.error;
    if (useradded==undefined)
    {
      useradded=false;
    }
    if(error==undefined)
    {
      error = false;
    }
    console.log("Should have changed here!");
    console.log(useradded);
    console.log("HERE IS THE ERROR");
    console.log(error);

   res.render(path.join(__dirname + '/views/login1.ejs'), {useradded:useradded, error:error});

  }
  else{
    console.log(req.user);
    console.log("Authentication successful! inside / ")
  //  console.log(path);

 res.header("Access-Control-Allow-Origin", "*");
 console.log(__dirname);
console.log(path.resolve(__dirname, 'index.html'));
console.log("HERE IS THE USERS ROLES!?!JDIFASDLDJFOADSIJF;")
console.log(req.user.roles);
  res.sendFile(path.resolve(__dirname, 'index.html'));

}

});





router.route('/login').post(passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login-form',
    failureFlash: true
})

);


router.route('/logout').get(function(req, res){
  console.log("Logging out!!");
  req.logout();
  res.redirect('/');
});


module.exports = router;
