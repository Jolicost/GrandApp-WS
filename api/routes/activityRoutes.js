'use strict';
module.exports = function(app) {
    var activity = require('../controllers/activityController');
    var restful = require('node-restful');
    var middleware = require('../middleware/sessionMiddleware');
    var activityMiddleware = require('../middleware/activityMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/activityRoutes');
    var Activities = app.activities = restful.model('Activities',null)
        .methods(['get', 'put', 'delete']);

    /* Depreciated routes */
    Activities.register(app,'/activities');
    
    app.post('/activities', [middleware.verifyToken], activity.create);
    /* End depreciated routes */
    
    /* Normal routes */
    app.get('/normal/activities', [
        userMiddleware.userHasLocation,
        activityMiddleware.addActivityFilters,
        activityMiddleware.populatePagination,
    ], activity.listNormal);
    app.get('/normal/activities/:activityId', activity.read);
    app.post('/normal/activities', [
        validate(validations.update),
        activityMiddleware.getActivityEntity
    ], activity.createNormal);
    app.put('/normal/activities/:activityId', [
        validate(validations.update),
        activityMiddleware.populateActivity,
        activityMiddleware.getActivityEntity,
        activityMiddleware.setActivityData
    ], activity.updateNormal);
    app.delete('/normal/activities/:activityId', [
        activityMiddleware.populateActivity,
        activityMiddleware.isFromUser
    ], activity.delete)


    app.post('/normal/activities/:activityId/join', [
        activityMiddleware.populateActivity,
        activityMiddleware.userNotInActivity
    ], activity.join);

    app.post('/normal/activities/:activityId/leave', [
        activityMiddleware.populateActivity,
        activityMiddleware.userInActivity
    ], activity.leave);


    app.post('/normal/activities/:activityId/vote', [
        validate(validations.vote),
        activityMiddleware.populateActivity,
        activityMiddleware.userParticipated,
        activityMiddleware.userNotVoted
    ], activity.vote);

    app.post('/normal/activities/:activityId/unvote', [
        activityMiddleware.populateActivity,
        activityMiddleware.userParticipated,
        activityMiddleware.userVoted
    ], activity.unvote);

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
