'use strict';

var mongoose = require('mongoose'),
    Activity = mongoose.model('Activities');

var achievementCtrl = require('./achievementController');
var notification = require('./util/notificationSender.js')
var geolib = require('geolib');

exports.count = function(req, res) {
    Activity.countDocuments(req.activityFilters || {}).exec(function(err, n){
        if (err) return res.send(err);
        else return res.json({count: n});
    });
}

exports.list = function(req, res) {
    Activity.find(req.activityFilters || {})
    .limit(req.pagination.limit)
    .skip(req.pagination.skip)
    .exec(function(err, activities) {
        if (err)
            res.send(err);
        else
            res.json(activities);
    });
};

exports.limitSkipActivities = function(activities,limit,skip) {
    let j = 0;
    let exit = false;
    let ret = [];
    for (var i = skip || 0; i < activities.length && !exit; i++) {
        ret.push(activities[i]);
        if (limit) {
            j++;
            if (j >= limit) exit = true;
        }

    }
    return ret;
}

exports.listNormal = function(req, res) {
    let maxDist = req.query.maxDist;
    if (!maxDist || maxDist == 0) maxDist = 10 * 1000;

    let minDist = req.query.minDist || 0;

    let lat = req.user.place.lat;
    let long = req.user.place.long;
    Activity
    .find(req.activityFilters || {})
    .sort(req.sort || {})
    .exec(function(err, activities) {
        if (err) return res.send(err);
        let ret = activities.filter(activity => {
            if (!lat || !long) return true;

            let distance = geolib.getDistance(
                {latitude: lat, longitude: long},
                {latitude: activity.lat, longitude: activity.long}
            );

            return minDist <= distance && distance <= maxDist;
        });

        return res.json(exports.limitSkipActivities(ret,req.pagination.limit,req.pagination.skip));
    });
}

exports.listNormalNoDistance = function(req, res) {
    Activity.find(req.activityFilters || {},{},req.pagination || {}, function(err, activities) {
        if (err) res.send(err);
        else res.json(activities);
    });
}

exports.shortList = function(req, res) {
    //var activities = exports.list(req,res);
    /*ActivityList.find({}, function(err,activities) {
        if (err)
            res.send(err);
        else
            res.json(activities);*/

    for (var i = 0; i < activities.length - 1; i++) {
        var obj = activities[i].toObject();

        /*
        _id
        titol
        1era foto
        lat, long
        maxCapacitat
        personesApuntes: size users
        timestampInici
        */

        //Ordenar per timestamp



        delete obj.price;
        activities[i] = obj;
    }
};

exports.read = function(req, res) {
    Activity.findById(req.params.activityId, function(err, activity) {
        if (err)
            res.send(err);
        else if (!activity)
            res.status(404).send("activity not found");
        else
            var l = activity.votes.map(a => {return a.user});
            let j = activity.toObject();
            j.votes = l;
            return res.json(j);
    });
};

exports.create = function(req, res) {
    var new_activity = new Activity(req.activityData);

    new_activity.save(function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json(activity);
    });
};

exports.createNormal = function(req, res) {


    let activity = new Activity(req.activityData);

    activity.save(function(err, activity) {
        if (err) return res.send(err);
        else {
            achievementCtrl.computeAchievements(req.user,function(err) {
                return res.status(200).send("Activity created");
            }, { create: true });
        }
    });
}

exports.update = function(req, res) {
    Activity.findOneAndUpdate({
        _id: req.params.activityId
    }, req.body, {
        new: true
    }, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json(activity);
    });
};

exports.updateNormal = function(req, res) {
    console.log(req.activityData);
    Activity.findOneAndUpdate({
        _id: req.params.activityId
    }, req.activityData, function (err, activity) {
        if (err) return res.send(err);
        else return res.status(200).send("Activity updated");
    });
}

exports.delete = function(req, res) {
    Activity.remove({
        _id: req.params.activityId
    }, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'Activity deleted'
            });
    });
};

exports.deleteAll = function(req, res) {
    Activity.deleteMany({}, function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'All activities deleted'
            });
    });
};


exports.join = function(req, res) {
    Activity.findOneAndUpdate({_id: req.activity._id},
    {
        $push: {participants: req.user._id}
    }, function(err) {
        // TODO joan oliva cannot set headers after 
        notification.sendNotification(req.activity.user, 'One more!', 'A user joined your activity!', function(err) {
            if (err) return res.status(500).send(err);
        });

        User.findOne({_id: req.activity.user}, function(err, user) {
            if (err) return;
            achievementCtrl.computeAchievements(user, function(err) {

            }, {popular: true});
        });

        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("Joined to activity");
    });
}

exports.leave = function(req, res) {
    Activity.findOneAndUpdate({_id: req.activity._id},
    {
        $pullAll: {participants: [req.user._id] }
    }, function(err) {
        notification.sendNotification(req.activity.user, 'Somebody leaved!', 'A user leaved your activity.', function(err) {
            if (err) return res.status(500).send(err);
        });
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("Activity left");
    });
}

exports.updateMessage = function(req, res) {

    Activity.updateOne({_id: req.params.activityId}, {
        $inc: {
            nMessages: 1
        }
    }, function(err) {
        console.log("+1 nombre de missates");
        if (err) return res.status(500).send("Failed to update numbero of messages");
        else return res.status(200).send("Number of messages incremented by 1");
    });
}

exports.vote = function(req, res) {

    let avg = exports.computeAddAvg(req.activity,req.body.rating);
    Activity.findOneAndUpdate({_id: req.activity._id}, {
        $push: {
            votes: {
                user: req.user._id,
                rating: req.body.rating
            }
        },
        rating: avg
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        return res.status(200).send("vote registered");
    });
}

exports.unvote = function(req, res) {
    /* Fetch old rating */
    let oldRating = req.activity.votes.find(function(vote) {
        return vote.user.equals(req.user._id);
    }).rating;

    let rating = exports.computeSubAvg(req.activity,oldRating);

    Activity.findOneAndUpdate({_id: req.activity._id}, {
        $pull: {
            votes: {
                $elemMatch: {
                    user: req.user._id
                }
            }
        },
        rating: rating
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("vote unregistered");
    });
}

exports.computeAddAvg = function(activity, newRating) {
    let rating = activity.rating;
    let n = activity.votes.length;

    let d = rating * n;

    d += newRating;
    return (d/(n+1));
}

exports.computeSubAvg = function(activity, oldRating) {
    let rating = activity.rating;
    let n = activity.votes.length;

    let d = rating * n;

    d -= oldRating;

    if (d <= 0) return 0;

    return (d/(n-1));
}

exports.isActivityClose = function(activity, lat, long, meters) {
    let distance = geolib.getDistance(
        {latitude: lat, longitude: long},
        {latitude: activity.lat, longitude: activity.long}
    );

    return distance <= meters;
}
