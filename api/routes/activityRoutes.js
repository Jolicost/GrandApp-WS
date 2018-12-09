'use strict';
module.exports = function(app) {
    var activity = require('../controllers/activityController');
    var restful = require('node-restful');
    var middleware = require('../middleware/sessionMiddleware');
    var Activities = app.activities = restful.model('Activities',null)
        .methods(['get', 'put', 'delete']);

    /* Depreciated routes */
    Activities.register(app,'/activities');
    
    app.post('/activities', [middleware.verifyToken], activity.create);
    /* End depreciated routes */
    


    /* ADMIN ROUTES */
    Activities.register(app,'/admin/activities');
}
