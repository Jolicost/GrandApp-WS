'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var session = require('../controllers/sessionController');
    var sessionMdw = require('../middleware/sessionMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/sessionRoutes');

    // User API Routes
    app.route('/login')
        .post(session.login);

    app.route('/logout')
        .get(session.logout);

    app.route('/register')
        .post(session.register);

    app.get('/verify', [
        sessionMdw.verifyToken, 
        sessionMdw.obtainUser
    ], session.testAuthorization);

    app.post('/changePassword', [
        validate(validations.changePassword),
        sessionMdw.verifyToken, 
        sessionMdw.obtainUser
    ], session.changePassword);

    app.post('/forgotPassword', session.forgotPassword);
}
