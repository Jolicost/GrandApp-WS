'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');
    var restful = require('node-restful');
    var Entities = app.entities = restful.model('Entities',null)
        .methods(['get', 'post', 'put', 'delete']);

    /* Deprecatd routes */
    Entities.register(app,'/entities');
    

    app.get('/entities/:entityId/users', entity.getUsers);
    app.get('/entities/:entityId/activities', entity.getActivities);
    /* End deprecated routes */


}
