'use strict';

var mongoose = require('mongoose'),
    Achievement = mongoose.model('Achievements'),
    Activity = mongoose.model('Activities');

var async = require('async');


exports.userAchievements = function(req, res) {
    async.parallel({
        owns: function(callback) {
            Achievement.find({
                _id: {
                    $in: req.user.achievements
                } 
            }, function(err, achievements){
                callback(null,achievements);
            });
        },
        missing: function(callback) {
            Achievement.find({
                _id: {
                    $nin: req.user.achievements
                } 
            }, function(err, achievements){
                callback(null,achievements);
            });
        }
    }, function(err, results) {
        let ret = [];
        ret = ret.concat(results.owns.map(achievement => { return exports.populateOwnAchievement(achievement) }));
        ret = ret.concat(results.missing.map(achievement => { return exports.populateMissingAchievement(achievement) }));
        return res.json(ret);
    });
}


exports.populateOwnAchievement = function(achievement) {
    return {
        achievementType: achievement.achievementType,
        key: achievement.key,
        value: achievement.value,
        title: achievement.title,
        image: achievement.image,
        owned: true
    };
}

exports.populateMissingAchievement = function(achievement) {
    return {
        achievementType: achievement.achievementType,
        key: achievement.key,
        value: achievement.value,
        title: '???',
        image: achievement.hiddenImage,
        owned: false
    };
}

exports.checkAchievements = function(req, res) {
    exports.computeAchievements(req.user, function(err, achievements) {
        if (err) return res.send(err);
        else return res.json(achievements);
    });
}

exports.computeAchievements = function(user, callback, options = {all: true}) {
    async.parallel({
        number: function(callback) {
            // Exit if not interested
            if (!options.number && !options.all) {
                callback(null,[]);
                return;
            }

            Achievement.find({achievementType:'number'}, function(err, achievements) {
                if (err) callback(err,null);
                else {
                    Activity.countDocuments({ 
                        active: user
                    }, function(err, n) {
                        if (err) callback(err,null);
                        else callback(null,exports.computeGiveAchievements(achievements, n));
                    });
                }
            });
        },
        create: function(callback) {
            if (!options.create && !options.all) {
                callback(null,[]);
                return;
            }

            Achievement.find({achievementType:'create'}, function(err, achievements) {
                if (err) callback(err,null);
                else {
                    Activity.countDocuments({
                        user: user
                    }, function(err, n) {
                        if (err) callback(err,null);
                        else callback(null,exports.computeGiveAchievements(achievements, n));
                    });
                }
            });
        },
        popular: function(callback) {
            if (!options.popular && !options.all) {
                callback(null,[]);
                return; 
            }

            Achievement.find({achievementType:'popular'}, function(err, achievements) {
                if (err) callback(err, null);
                else {
                    let aggregate = [
                        {
                            $match: {
                                user: user._id
                            },
                        },
                        {
                            "$group":
                            {
                                "_id": false,
                                "count":
                                {
                                    "$sum": { "$size": "$participants" }
                                }
                            }
                        },
                    ];

                    Activity.aggregate(aggregate, function(err, results) {
                        let count = 0;

                        if (results.length > 0)
                            count = results[0].count;
                        callback(null,exports.computeGiveAchievements(achievements, count));
                    });
                }
            });
        }
    }, function(err, results) {
        let achievements = [];
        Object.keys(results).forEach(function(key) {
            results[key].forEach(ach => { 
                achievements.push(ach);
            });
        });

        User.updateOne({_id: user._id}, { 
                $addToSet: {
                    achievements: achievements
                }
            }, function(err){
            if (err) callback(err,null);
            else callback(null,achievements);
        });
    });
}

exports.computeGiveAchievements = function(achievements, n) {
    let give = [];
    achievements.forEach(achievement => {
        if (n >= achievement.key) {
            give.push(achievement);
        }
    });
    return give;
}