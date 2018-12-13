'use strict';
module.exports = function(app) {
    var sessionMiddleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var entityMiddleware = require('../middleware/entityMiddleware');

    /* Register middleware */
    app.all('/normal/*', [
        sessionMiddleware.verifyAndObtain
    ]);

    app.all('/entity/*', [
        sessionMiddleware.verifyAndObtain,
        sessionMiddleware.isEntity,
        entityMiddleware.setEntity
    ]);

    app.all('/admin/*', [
        sessionMiddleware.verifyAndObtain,
        sessionMiddleware.isAdmin
    ]);
}
