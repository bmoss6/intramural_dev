var express = require('express')
var app = express()
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
const LocalStrategy       = require('passport-local').Strategy;
const passport            = require('passport');
const session             = require('express-session');
var userinfo = require('./api/controllers/userinfo');
var flash = require('connect-flash');
var path    = require("path");
var engine = require('ejs-locals');
var api_routes = require('./api_routes');
var  routes = require('./static_routes');
//Use path module for directory: path.resolve




app.engine('ejs', engine);
app.set('view engine', 'ejs');
// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/api', api_routes);
app.use('/', routes);
app.use(express.static(__dirname + '/'));



app.listen(3000,'0.0.0.0', function () {
  console.log('We are ready to rumble!')
})
