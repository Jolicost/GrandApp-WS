'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');
    var user = require('../controllers/userController');

    var restful = require('node-restful');
    // Restful library. Auto implements the whole restful routing model
    var Entities = app.entities = restful.model('Entities',null)
        .methods(['get', 'post', 'put', 'delete']);

    var entityMiddleware = require('../middleware/entityMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');

    /* Entity routes */
    // READ ENTITY
    app.get('/entity/entities/:entityId', [
    	entityMiddleware.allowedUser
    ], entity.read);

    // UPDATE ENTITY 
    app.put('/entity/entities/:entityId', [
    	entityMiddleware.allowedUser
    ], entity.update);

    // GET EMERGENCY USERS
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
