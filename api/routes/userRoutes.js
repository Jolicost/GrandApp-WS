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
        sessionMiddleware.verifyToken,
        sessionMiddleware.obtainUser,
        userMiddleware.userNotExistsOnUpdate,
        validate(validations.updateNormal)
    ], user.updateNormal)
    app.route('/users/:userId/emergency')
        .get(user.getEmergencyPhones)
        .post(user.setEmergencyPhones);
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
