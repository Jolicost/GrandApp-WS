'use strict';
module.exports = function(app) {
    var activity = require('../controllers/activityController');
    var restful = require('node-restful');
    var middleware = require('../middleware/sessionMiddleware');
    var Activities = app.activities = restful.model('Activities',null)
        .methods(['get', 'put', 'delete']);

    Activities.register(app,'/activities');
    
    app.post('/activities', [middleware.verifyToken], activity.create);
    /*
    // activity Routes
    app.route('/activities')
        .get(activity.list)
        .post(activity.create)
        .delete(activity.deleteAll);

    app.route('/activities/:activityId')
        .get(activity.read)
        .put(activity.update)
        .delete(activity.delete);

    app.route('/activitiesList')
        .get(activity.shortList);
    */
}
