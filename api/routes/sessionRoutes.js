'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var session = require('../controllers/sessionController');

    // User API Routes
    app.route('/login')
        .post(session.login);

    app.route('/logout')
        .get(session.logout);

    app.route('/register')
        .post(session.register);

    app.route('/verify')
        .get(session.testAuthorization);



    function verifyToken(req, res, next) {
        const auth = req.headers['authorization'];
        if (typeof auth !== 'undefined') {
            console.log("success");
        } else {
            res.sendStatus(403);
        }
    }
}