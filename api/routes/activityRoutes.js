'use strict';
module.exports = function(app) {
    var activity = require('../controllers/activityController');
    var restful = require('node-restful');
    var middleware = require('../middleware/sessionMiddleware');
    var activityMiddleware = require('../middleware/activityMiddleware');
    var achievementMiddleware = require('../middleware/achievementMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/activityRoutes');
    
    // restful lib
    var Activities = app.activities = restful.model('Activities',null)
        .methods(['get', 'post', 'put', 'delete']);

    /* Normal routes */
    // Gets the activity list
    app.get('/normal/activities', [
        validate(validations.list),
        //userMiddleware.userHasLocation,
        activityMiddleware.addActivityFilters,
        activityMiddleware.addActivitySort,
        activityMiddleware.populatePagination,
    ], activity.listNormal);
    // Gets the own activity list
    app.get('/normal/own/activities/', [
        activityMiddleware.populatePagination,
        activityMiddleware.ownActivities
    ], activity.listNormal);

    // Debug feature
    app.get('/normal/test/activities', [
        validate(validations.list),
        userMiddleware.userHasLocation,
        activityMiddleware.addActivityFilters,
        activityMiddleware.populatePagination,
    ], activity.listNormalNoDistance);
    // read activity
    app.get('/normal/activities/:activityId', activity.read);
    // create activity
    app.post('/normal/activities', [
        validate(validations.update),
        activityMiddleware.getActivityEntity,
        activityMiddleware.getActivityUser,
        activityMiddleware.setActivityData
    ], activity.createNormal);
    // update activity
    app.put('/normal/activities/:activityId', [
        validate(validations.update),
        activityMiddleware.populateActivity,
        activityMiddleware.getActivityEntity,
        activityMiddleware.setActivityData
    ], activity.updateNormal);
    // removes an activity
    app.delete('/normal/activities/:activityId', [
        activityMiddleware.populateActivity,
        activityMiddleware.isFromUser
    ], activity.delete)

    // join activity
    app.post('/normal/activities/:activityId/join', [
        activityMiddleware.populateActivity,
        activityMiddleware.userNotInActivity
    ], activity.join);

    // leave activity
    app.post('/normal/activities/:activityId/leave', [
        activityMiddleware.populateActivity,
        activityMiddleware.userInActivity
    ], activity.leave);

    // message sent
    app.put('/normal/activities/:activityId/message', activity.updateMessage);


    // vote activity
    app.post('/normal/activities/:activityId/vote', [
        validate(validations.vote),
        activityMiddleware.populateActivity,
        activityMiddleware.userParticipated,
        activityMiddleware.userNotVoted
    ], activity.vote);

    // unvote activity
    app.post('/normal/activities/:activityId/unvote', [
        activityMiddleware.populateActivity,
        activityMiddleware.userParticipated,
        activityMiddleware.userVoted
    ], activity.unvote);

    /* Entity routes */
    // list activities
    app.get('/entity/activities', [
        activityMiddleware.addEntityFilters,
        activityMiddleware.populatePagination
    ], activity.list);
    // counts the number of activities of the entity
    app.get('/entity/count/activities', [activityMiddleware.addEntityFilters], activity.count);
    
    // reads an activity
    app.get('/entity/activities/:activityId', [activityMiddleware.selectActivityAttributes], activity.read);
    
    // creates an activity
    app.post('/entity/activities', [
        activityMiddleware.getActivityEntity,
        activityMiddleware.setActivityData,
        activityMiddleware.checkOutOfBoundsActivity
    ], activity.createNormal);
    // updates an activity
    app.put('/entity/activities/:activityId', [
        activityMiddleware.populateActivity,
        activityMiddleware.isFromEntity,
        activityMiddleware.checkOutOfBoundsActivity,
        activityMiddleware.setActivityData
    ], activity.updateNormal);
    // removes an activity
    app.delete('/entity/activities/:activityId',[
        activityMiddleware.populateActivity,
        activityMiddleware.isFromEntity
    ], activity.delete)


    /* ADMIN ROUTES */
    Activities.register(app,'/admin/activities');
}
