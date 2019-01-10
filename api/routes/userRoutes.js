'use strict';
module.exports = function(app) {
    /* User routes. CRUD operations and more based on requester type */
    var user = require('../controllers/userController');
    var restful = require('node-restful');
    var sessionMiddleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var activityMiddleware = require('../middleware/activityMiddleware');
    var achievementMiddleware = require('../middleware/achievementMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/userRoutes');
    var validations_activity = require('./validation/activityRoutes');

    // Restful library. Registers all operations but allows every operation
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
    var passwordHash = require('password-hash');
    Users.after('delete', userMiddleware.purgeReferences);
    /* Hash password when performing updates */
    var hash = function(req, res, next) {
        if (req.body.password)
            req.body.password = passwordHash.generate(req.body.password);
        next(); 
    };
    
    Users.before('post', hash);
    Users.before('put', hash);
    
    Users.register(app,'/admin/users');



}
