
var seasoninfo = require('./seasoninfo');

seasoninfo.getTeamschedule('cs1','f2017')
.then(done => {

console.log(done);

})

.catch(error => {

  console.log(error);
})
