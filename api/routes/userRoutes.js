'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var restful = require('node-restful');
    var sessionMiddleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var activityMiddleware = require('../middleware/activityMiddleware');
    var achievementMiddleware = require('../middleware/achievementMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/userRoutes');
    var validations_activity = require('./validation/activityRoutes');

    var Users = app.users = restful.model('Users',null)
        .methods(['get', 'post', 'put', 'delete']);

    /* NORMAL SECTION */
    // READ
    app.get('/normal/users/:userId', [
        userMiddleware.selectTargetUser,
        userMiddleware.selectUserAttributes
    ], user.read);

    // UPDATE
    app.put('/normal/users/:userId', [
        validate(validations.updateNormal),
        userMiddleware.selectTargetUser,  
        userMiddleware.allowedUser,
        userMiddleware.userNotExistsOnUpdate
    ], user.updateNormal);

    // DELETE
    app.delete('/normal/users/:userId', [
        userMiddleware.selectTargetUser,
        userMiddleware.allowedUser,
        userMiddleware.onDeleteUser
    ], user.delete);

    // GET EMERGENCY PHONES
    app.get('/normal/users/:userId/emergency', [
        userMiddleware.selectTargetUser,
        userMiddleware.allowedUser
    ], user.getEmergencyPhones);

    // UPDATE EMERGENCY PHONES
    app.post('/normal/users/:userId/emergency', [
        userMiddleware.selectTargetUser,
        userMiddleware.allowedUser
    ], user.setEmergencyPhones);

    // GEO UPDATE
    app.put('/geo', [
        validate(validations_activity.geo),
        sessionMiddleware.verifyAndObtain,
        userMiddleware.getUserEntity,
        activityMiddleware.isActiveUser,
        achievementMiddleware.checkNumberAchievements
    ], user.updateCoords);

    // BLOCK USER
    app.post('/normal/users/:userId/block', [
        userMiddleware.userIsNotBlocked
    ], user.block);

    // UNBLOCK USER
    app.post('/normal/users/:userId/unblock', [
        userMiddleware.userIsBlocked
    ], user.unblock);


    /* ENTITY REGION */
    // READ USER
    app.get('/entity/users/:userId', [
        userMiddleware.selectTargetUser,
        userMiddleware.selectUserAttributes
    ], user.read);

    // LIST
    app.get('/entity/users', [
        userMiddleware.selectEntityUserAttributes,
        userMiddleware.selectNormalUsersFilter,
        userMiddleware.selectUserFilters,
        userMiddleware.populateUserFilters,
        activityMiddleware.populatePagination
    ], user.list);

    // COUNT
    app.get('/entity/count/users', [
        userMiddleware.selectNormalUsersFilter,
        userMiddleware.selectUserFilters
    ], user.count);
    
    // UPDATE
    app.put('/entity/users/:userId', [
        validate(validations.updateEntity),
        userMiddleware.selectTargetUser,  
        userMiddleware.allowedEntity,
        userMiddleware.userNotExistsOnUpdate
    ], user.updateEntity);

    // DELETE
    app.delete('/entity/users/:userId', [
        userMiddleware.selectTargetUser,
        userMiddleware.allowedEntity,
        userMiddleware.onDeleteUser
    ], user.delete);

    // GET EMERGENCY PHONES
    app.get('/entity/users/:userId/emergency', [
        userMiddleware.selectTargetUser,
        userMiddleware.allowedEntity
    ], user.getEmergencyPhones);

    // UPDATE EMERGENCY PHONES
    app.post('/entity/users/:userId/emergency', [
        userMiddleware.selectTargetUser,
        userMiddleware.allowedEntity
    ], user.setEmergencyPhones);



    
    /* ADMIN ROUTES */
    Users.after('delete', userMiddleware.purgeReferences);
    Users.register(app,'/admin/users');



}
