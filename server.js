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
    Achievement = require('./api/models/achievementModel'),
    Activity = require('./api/models/activityModel'),
    Entity = require('./api/models/entityModel'),
    User = require('./api/models/userModel'),
    //ActivityList = require('./api/models/activityListModel'),
    bodyParser = require('body-parser');


/* set mongoose variables and disable warnings */
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(DB,{
    useNewUrlParser: true
});

// Upload limit
let limit = '5mb';
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: limit}));
app.use(bodyParser.text({limit: limit}));

// Alow cross origin
// CORS
var cors = require('cors');
app.use(cors());

// Load routes
var activityRoutes = require('./api/routes/activityRoutes');
var userRoutes = require('./api/routes/userRoutes');
var sessionRoutes = require('./api/routes/sessionRoutes');
var imageRoutes = require('./api/routes/imageRoutes');
var entityRoutes = require('./api/routes/entityRoutes');
var statisticsRoutes = require('./api/routes/statisticsRoutes');
var commonRoutes = require('./api/routes/commonRoutes');
var achievementRoutes = require('./api/routes/achievementRoutes');
var chatRoutes = require('./api/routes/chatRoutes');

// Register routes
commonRoutes(app);
activityRoutes(app);
userRoutes(app);
sessionRoutes(app);
imageRoutes(app);
entityRoutes(app);
statisticsRoutes(app);
achievementRoutes(app);
chatRoutes(app);

// Listen and go
module.exports = app.listen(PORT);

console.log('Grandapp RESTful API server started on: ' + port);
