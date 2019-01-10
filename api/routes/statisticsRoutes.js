'use strict';
module.exports = function(app) {
    var statistics = require('../controllers/statisticsController');
    var middleware = require('../middleware/entityMiddleware');

    /* ENTITY STATISTICS ROUTES */

    // ACTIVITY STATISTICS
    app.get('/entity/entities/:entityId/statistics/activities', [
        middleware.checkEntity
    ],  statistics.activities);

    // USER STATISTICS
    app.get('/entity/entities/:entityId/statistics/users', [
        middleware.checkEntity
    ],  statistics.users);

    // CONNECTION STATISTICS
    app.get('/entity/entities/:entityId/statistics/connections', [
        middleware.checkEntity
    ], statistics.connections);

    // ACHIEVEMENT STATISTICS
    app.get('/entity/entities/:entityId/statistics/achievements', [
        middleware.checkEntity
    ], statistics.achievements);
}
