'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var session = require('../controllers/sessionController');
    var sessionMdw = require('../middleware/sessionMiddleware');
    var userMdw = require('../middleware/userMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/sessionRoutes');

    // User API Routes
    app.route('/login')
        .post(session.login);

    app.route('/logout')
        .get(session.logout);

    app.post('/register',[
        validate(validations.register),
        userMdw.userNotExists
    ], session.register);

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

    app.post('/login/google', [
        validate(validations.serviceLogin)
    ], session.googleLogin);

    app.post('/login/facebook', [
        validate(validations.serviceLogin)
    ], session.facebookLogin)
}
