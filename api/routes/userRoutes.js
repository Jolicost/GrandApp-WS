'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var restful = require('node-restful');
    var sessionMiddleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/userRoutes');
    var validations_activity = require('./validation/activityRoutes');

    /* DEPRECIATED ROUTES */
    var Users = app.users = restful.model('Users',null)
        .methods(['get', 'post', 'put', 'delete']);

    //Users.register(app,'/users');

    app.put('/users/:userId/geo', [
        sessionMiddleware.verifyAndObtain
    ], user.updateCoords);

    
    app.route('/users/:userId/emergency')
        .get(user.getEmergencyPhones)
        .post(user.setEmergencyPhones);

    app.put('/users/:userId', [
        validate(validations.updateNormal),
        sessionMiddleware.verifyAndObtain,
        userMiddleware.userNotExistsOnUpdate,   
        userMiddleware.ownUserOrAllowedEntity, 
    ], user.updateNormal);
    /* End DEPRECIATED ROUTES */


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
    app.put('/normal/users/:userId/geo', [
        validate(validations_activity.update),
        userMiddleware.selectTargetUser,
        userMiddleware.allowedUser,
        userMiddleware.getUserEntity
        
    ], user.updateCoords);

    // GEO UPDATE
    app.put('/geo', [
        validate(validations_activity.update),
        sessionMiddleware.verifyAndObtain,
        userMiddleware.getUserEntity
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
        userMiddleware.selectUserFilters
    ], user.list);

    
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
