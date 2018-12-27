'use strict';

var mongoose = require('mongoose'),
    Activity = mongoose.model('Activities');

var geolib = require('geolib');

exports.list = function(req, res) {
    Activity.find(req.activityFilters || {}, function(err, activities) {
        if (err)
            res.send(err);
        else
            res.json(activities);
    });
};

exports.listNormal = function(req, res) {
    let maxDist = req.query.dist || 5 * 1000;
    let lat = req.user.place.lat;
    let long = req.user.place.long;

    Activity.find(req.activityFilters || {},{},req.pagination || {}, function(err, activities) {
        if (err) return res.send(err);
        let ret = activities.filter(activity => {
            let distance = geolib.getDistance(
                {latitude: lat, longitude: long},
                {latitude: activity.lat, longitude: activity.long}
            );

            return distance <= maxDist;
        });
        return res.json(ret);
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
            res.json(activity);
    });
};

exports.create = function(req, res) {
    var new_activity = new Activity(req.body);
    new_activity.user = req.userId;
    
    new_activity.save(function(err, activity) {
        if (err)
            res.send(err);
        else
            res.json(activity);
    });
};

exports.createNormal = function(req, res) {
    
    let activity = new Activity(req.body);
    
    activity.save(function(err, activity) {
        if (err) res.send(err);
        else res.status(200).send("Activity created");
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
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("Joined to activity");
    });
}

exports.leave = function(req, res) {
    Activity.findOneAndUpdate({_id: req.activity._id},
    {   
        $pullAll: {participants: [req.user._id] } 
    }, function(err) {
        if (err) return res.status(500).send("internal server error");
        else return res.status(200).send("Activity left");
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
        return res.json({rating: avg});
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
        else return res.json({rating: rating});
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
