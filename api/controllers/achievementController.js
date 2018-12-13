'use strict';

var mongoose = require('mongoose'),
    Achievement = mongoose.model('Achievements');


exports.userAchievements = function(req, res) {
    Achievement.find({}, function(err, achievements){
        if (err) res.send(err);
        achievements.map(function(achievement) {
            return exports.populateAchievement(achievement,req.user);
        });
        return res.json(achievements);
    });
}

exports.read = function(req, res) {
    let user = req.user;
    let aId = req.params.achievementId;

    Achievement.findById(aId, function(err, achievement) {
        if (err) return res.send(err);
        else if (!achievement) res.status(404).send("not found");
        else res.json(exports.populateAchievement(achievement,user));        
    });
}

exports.populateAchievement = function(achievement, user) {
    let ret = {};
    if (user.achievements.includes(achievement._id)) {
        ret.title = achievement.title;
        ret.image = achievement.image;
        ret.owned = true;
        ret.achievementType = achievement.achievementType;
        ret.key = achievement.key;
        ret.value = achievement.value;
        ret.hidden = false;
    }
    else {
        if (achievement.hidden) {
            ret.image = achievement.hiddenImage;
            ret.title = "???";
            ret.hidden = true;
            ret.owned = false;
        }
        else {
            ret.achievementType = achievement.achievementType;
            ret.key = achievement.key;
            ret.value = achievement.value;
            ret.image = achievement.image;
            ret.hidden = false;
            ret.owned = false;
        }
        ret.owned = false;
    }

    return ret;
}
