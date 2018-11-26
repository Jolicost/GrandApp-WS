'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');
    var restful = require('node-restful');
    var Entities = app.entities = restful.model('Entities',null)
        .methods(['get', 'post', 'put', 'delete']);

    Entities.register(app,'/entities');
    

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
