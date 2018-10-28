// Hey buddy let's see how this goes
console.log('Reading configuration files...');
const config = require('./config/config.js');
// Read the configuration variables
var PORT  = config.get('server.port');
var DB = config.get('db.host');
// Print some of them just for information
console.log('Read PORT from config: ' + PORT);
console.log('Read Database host DB from config: ' + DB);
/* express routing dependency. Add all your modules here */
var express = require('express'),
    app = express(),
    port = PORT,
    mongoose = require('mongoose'),
    Activity = require('./api/models/activityModel'),
    //ActivityList = require('./api/models/activityListModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

mongoose.connect(DB,{ 
    useNewUrlParser: true 
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var routes = require('./api/routes/activityRoutes');
routes(app);

app.listen(PORT);

console.log('Grandapp RESTful API server started on: ' + port);