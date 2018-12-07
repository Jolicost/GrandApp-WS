'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var restful = require('node-restful');
    var sessionMiddleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/userRoutes');

    var Users = app.users = restful.model('Users',null)
        .methods(['get', 'post', 'delete']);

    Users.register(app,'/users');

    app.put('/users/:userId', [
        validate(validations.updateNormal),
        sessionMiddleware.verifyAndObtain,
        userMiddleware.userNotExistsOnUpdate,   
        userMiddleware.ownUserOrAllowedEntity, 
    ], user.updateNormal);

    app.put('/users/:userId/geo', [
        sessionMiddleware.verifyAndObtain
    ], user.updateCoords);
    
    app.route('/users/:userId/emergency')
        .get(user.getEmergencyPhones)
        .post(user.setEmergencyPhones);


    /* Read operations on user */
    app.get('/normal/users/:userId', [
        userMiddleware.selectTargetUser,
        userMiddleware.selectUserAttributes
    ], user.read);

    // Same logic as normal but we must add it for compatibility reasons
    app.get('/entity/users/:userId', [
        userMiddleware.selectTargetUser,
        userMiddleware.selectUserAttributes
    ], user.read);

    app.get('/entity/users', [
        userMiddleware.selectEntityUserAttributes,
        userMiddleware.selectUserFilters
    ], user.list);

    /*
    // User API Routes
    app.route('/users')
        .get(user.list)
        .post(user.create)
        .delete(user.deleteAll);

    app.route('/users/:userId')
        .get(user.read)
        .put(user.update)
        .delete(user.delete);
    */
}
