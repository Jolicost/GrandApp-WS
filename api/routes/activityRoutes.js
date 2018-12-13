'use strict';
module.exports = function(app) {
    var activity = require('../controllers/activityController');
    var restful = require('node-restful');
    var middleware = require('../middleware/sessionMiddleware');
    var activityMiddleware = require('../middleware/activityMiddleware');
    var Activities = app.activities = restful.model('Activities',null)
        .methods(['get', 'put', 'delete']);

    /* Depreciated routes */
    Activities.register(app,'/activities');
    
    app.post('/activities', [middleware.verifyToken], activity.create);
    /* End depreciated routes */
    
    /* Normal routes */
    app.get('/normal/activities', activity.list);
    app.post('/normal/activities', [activityMiddleware.getActivityEntity], activity.createNormal);


    app.post('/normal/activities/:activityId/join', [
        activityMiddleware.populateActivity,
        activityMiddleware.userNotInActivity
    ], activity.join);

    app.post('/normal/activities/:activityId/leave', [
        activityMiddleware.populateActivity,
        activityMiddleware.userInActivity
    ], activity.leave);




    /* Entity routes */
    app.get('/entity/activities', [activityMiddleware.addEntityFilters], activity.list);
    app.get('/entity/activities/:activityId', [activityMiddleware.selectActivityAttributes], activity.read);
    app.post('/entity/activities', [activityMiddleware.setActivityData], activity.createNormal);
    app.put('/entity/activities/:activityId', [
        activityMiddleware.populateActivity,
        activityMiddleware.isFromEntity,
        activityMiddleware.setActivityData
    ], activity.updateNormal);
    app.delete('/entity/activities/:activityId',[
        activityMiddleware.populateActivity,
        activityMiddleware.isFromEntity
    ], activity.delete)


    /* ADMIN ROUTES */
    Activities.register(app,'/admin/activities');
}
