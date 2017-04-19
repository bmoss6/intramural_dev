var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://admin:password@192.168.23.128:27017/intramural_dev');
module.exports=db;
