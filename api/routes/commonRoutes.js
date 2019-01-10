'use strict';
module.exports = function(app) {
    var sessionMiddleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var entityMiddleware = require('../middleware/entityMiddleware');

    /* Normal users */
    app.all('/normal/*', [
        sessionMiddleware.verifyAndObtain
    ]);

    /* entity routes */
    app.all('/entity/*', [
        sessionMiddleware.verifyAndObtain,
        sessionMiddleware.isEntity,
        entityMiddleware.setEntity
    ]);

    /* admin routes */
    app.all('/admin/*', [
        sessionMiddleware.verifyAndObtain,
        sessionMiddleware.isAdmin
    ]);
}
