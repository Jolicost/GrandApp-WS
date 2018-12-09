'use strict';
module.exports = function(app) {
    var statistics = require('../controllers/statisticsController');
    var middleware = require('../middleware/entityMiddleware');

    // DEPRECIATED ROUTES
    app.get('/entities/:entityId/statistics/activities', [
        middleware.populateEntity
    ],  statistics.activities);

    app.get('/entities/:entityId/statistics/users', [
        middleware.populateEntity
    ],  statistics.users);
    // END DEPRECIATED ROUTES

    // STATISTICS ROUTES
    app.get('/entity/entities/:entityId/statistics/activities', [
        middleware.checkEntity
    ],  statistics.activities);

    app.get('/entity/entities/:entityId/statistics/users', [
        middleware.checkEntity
    ],  statistics.users);


}
