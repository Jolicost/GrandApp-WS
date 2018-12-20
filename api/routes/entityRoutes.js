'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');
    var user = require('../controllers/userController');

    var restful = require('node-restful');
    var Entities = app.entities = restful.model('Entities',null)
        .methods(['get', 'post', 'put', 'delete']);

    var entityMiddleware = require('../middleware/entityMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');

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

    app.get('/entity/entities/:entityId/emergency', [
        entityMiddleware.allowedUser,
        userMiddleware.selectEntityUserAttributes,
        userMiddleware.selectNormalUsersFilter,
        userMiddleware.selectRequestEntityUsersFilter,
        entityMiddleware.getUsers
    ], entity.getEmergencyUsers);

    
    /* Admin routes */
    Entities.after('delete', entityMiddleware.purgeReferences);
    Entities.register(app,'/admin/entities');


}
