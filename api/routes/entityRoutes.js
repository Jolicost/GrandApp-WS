'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');
    var restful = require('node-restful');
    var Entities = app.entities = restful.model('Entities',null)
        .methods(['get', 'post', 'put', 'delete']);

    var entityMiddleware = require('../middleware/entityMiddleware');

    /* Deprecatd routes */
    Entities.register(app,'/entities');
    
    app.get('/entities/:entityId/users', entity.getUsers);
    app.get('/entities/:entityId/activities', entity.getActivities);
    /* End deprecated routes */

    /* Entity routes */
    app.get('/entity/entities/:entityId', [
    	entityMiddleware.allowedUser
    ], entity.read);

    app.put('/entity/entities/:entityId', [
    	entityMiddleware.allowedUser
    ], entity.update);

    app.post('entity/entities/:entityId/usersNotInRange', [
        entityMiddleware.getEntity,
        entityMiddleware.getUsers
    ], entity.getUsersNotInRange);

    /* Admin routes */
    Entities.register(app,'/admin/entities');


}
