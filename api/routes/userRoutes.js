'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var restful = require('node-restful');
    var Users = app.users = restful.model('Users',null)
        .methods(['get', 'post', 'put', 'delete']);

    Users.register(app,'/users');


    app.route('/users/:userId/emergency')
        .get(user.getEmergencyPhones)
        .post(user.setEmergencyPhones);
    /*
    // User API Routes
    app.route('/users')
        .get(user.list)
        .post(user.create)
        .delete(user.deleteAll);

    app.route('/users/:userId')
        .get(user.read)
        .put(user.update)
        .delete(user.delete);
    */
}
