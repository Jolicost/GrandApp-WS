'use strict';
module.exports = function(app) {
    var statistics = require('../controllers/statisticsController');
    var middleware = require('../middleware/entityMiddleware');

    app.get('/entities/:entityId/statistics/activities', [
        middleware.populateEntity
    ],  statistics.activities);

    app.get('/entities/:entityId/statistics/users', [
        middleware.populateEntity
    ],  statistics.users);
}
