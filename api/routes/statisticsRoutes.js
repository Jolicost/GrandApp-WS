'use strict';
module.exports = function(app) {
    var statistics = require('../controllers/statisticsController');
    var middleware = require('../middleware/entityMiddleware');

    // STATISTICS ROUTES
    app.get('/entity/entities/:entityId/statistics/activities', [
        middleware.checkEntity
    ],  statistics.activities);

    app.get('/entity/entities/:entityId/statistics/users', [
        middleware.checkEntity
    ],  statistics.users);

    app.get('/entity/entities/:entityId/statistics/connections', [
        middleware.checkEntity
    ], statistics.connections);

    app.get('/entity/entities/:entityId/statistics/achievements', [
        middleware.checkEntity
    ], statistics.achievements);
}
