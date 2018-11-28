'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');
    var restful = require('node-restful');
    var Entities = app.entities = restful.model('Entities',null)
        .methods(['get', 'post', 'put', 'delete']);

    Entities.register(app,'/entities');
    

    app.get('/entities/:entityId/users', entity.getUsers);
    app.get('/entities/:entityId/activities', entity.getActivities);
    /*
    // entity Routes
    app.route('/entities')
        .get(entity.list)
        .post(entity.create)
        .delete(entity.deleteAll);

    app.route('/entities/:entityId')
        .get(entity.read)
        .put(entity.update)
        .delete(entity.delete);
    */
}
