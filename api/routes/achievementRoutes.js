'use strict';
module.exports = function(app) {
    var achievement = require('../controllers/achievementController');
    var restful = require('node-restful');
    var achievementMiddleware = require('../middleware/achievementMiddleware');
    var userMiddleware = require('../middleware/userMiddleware');
    // Restful lib
    var Achievements = app.achievements = restful.model('Achievements',null)
        .methods(['get', 'post', 'put', 'delete']);


    /* Normal routes */
    app.get('/normal/achievements', achievement.userAchievements);

    // Gets user achievements
    app.get('/normal/users/:userId/achievements', [
    	userMiddleware.selectTargetUser
    ], achievement.getAchievements);
    
    // DEPRECATED
    // computes all user acheivements.
    app.put('/normal/achievements', achievement.checkAchievements);

    /* ADMIN ROUTES */
    Achievements.after('delete', achievementMiddleware.purgeReferences);
    Achievements.register(app,'/admin/achievements');
}
