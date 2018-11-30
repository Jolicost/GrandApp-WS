'use strict';
module.exports = function(app) {
    var user = require('../controllers/userController');
    var restful = require('node-restful');
    var middleware = require('../middleware/sessionMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    var Users = app.users = restful.model('Users',null)
        .methods(['post', 'put', 'delete']);

    app.get('/users',[
        middleware.verifyAndObtain,
        userMiddleware.filterAttributes
    ], user.list);
    
    Users.before('get',[
        middleware.verifyAndObtain, 
        userMiddleware.seeOwn,
        userMiddleware.seeAll,
        userMiddleware.filterEntity
    ]);

    Users.after('get', [
        //userMiddleware.filterUser
    ]);

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