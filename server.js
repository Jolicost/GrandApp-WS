var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Activity = require('./api/models/activityModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
var production = 'mongodb://heroku_xwn18t95:bojkqnjfvltgf6bdcakcqd5aga@ds137643.mlab.com:37643/heroku_xwn18t95'
var local = 'mongodb://localhost/Grandapp';
var dbURL = production;

const environment = process.env.NODE_ENV || 'development';

if (environment === 'development' ) {
    dbURL = local;
}

mongoose.connect(dbURL);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var routes = require('./api/routes/activityRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);