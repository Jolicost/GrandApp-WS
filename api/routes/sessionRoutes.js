'use strict';
module.exports = function(app) {
    // SESSION ROUTES. These routes do not require special permissions
    var user = require('../controllers/userController');
    var session = require('../controllers/sessionController');
    var sessionMdw = require('../middleware/sessionMiddleware');
    var userMdw = require('../middleware/userMiddleware');
    var validate = require('express-validation');
    var validations = require('./validation/sessionRoutes');

    // login
    app.route('/login')
        .post(session.login);

    // does nothing but it's cool. Clear the token buddy
    app.route('/logout')
        .get(session.logout);

    // normal register
    app.post('/register',[
        validate(validations.register),
        userMdw.userNotExists
    ], session.register);

    // gets the information about the own user
    app.get('/verify', [
        sessionMdw.verifyToken, 
        sessionMdw.obtainUser
    ], session.testAuthorization);

    // change password
    app.post('/changePassword', [
        validate(validations.changePassword),
        sessionMdw.verifyToken, 
        sessionMdw.obtainUser
    ], session.changePassword);

    // forgot password
    app.post('/forgotPassword', [
        validate(validations.forgotPassword)
    ], session.forgotPassword);

    // google login
    app.post('/login/google', [
        validate(validations.serviceLogin)
    ], session.googleLogin);

    // facebook login
    app.post('/login/facebook', [
        validate(validations.serviceLogin)
    ], session.facebookLogin)
}
