'use strict';
module.exports = function(app) {
    var achievement = require('../controllers/achievementController');
    var restful = require('node-restful');
    var Achievements = app.achievements = restful.model('Achievements',null)
        .methods(['get', 'post', 'put', 'delete']);


    /* Normal routes */
    app.get('/normal/achievements', achievement.userAchievements);

    app.put('/normal/achievements', achievement.checkAchievements);

    /* ADMIN ROUTES */
    Achievements.register(app,'/admin/achievements');
}
