'use strict';
module.exports = function(app) {
    var entity = require('../controllers/entityController');

    // entity Routes
    app.route('/entities')
        .get(entity.list)
        .post(entity.create)
        .delete(entity.deleteAll);

    app.route('/entities/:entityId')
        .get(entity.read)
        .put(entity.update)
        .delete(entity.delete);
}
